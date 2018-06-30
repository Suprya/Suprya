import fs from 'fs';

// Make sure any symlinks in the project folder are resolved
export const getCwd = () => fs.realpathSync(process.cwd());

export const getPrerenderSettings = url =>
  JSON.stringify({
    // Output a JS module exporting an HTML String
    string: true,
    // Fake the JSDOM window.location variable to make the client-side
    // router libraries believe they are accessing the url
    documentUrl: `http://localhost${url}`
  });

// Merges two arrays together without creating a new one
// Might cause problems for large arrays (100,000+ elements)
// https://stackoverflow.com/a/17368101/96100
export function pushArray(original, items) {
  original.push.apply(original, items);
}