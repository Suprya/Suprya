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
