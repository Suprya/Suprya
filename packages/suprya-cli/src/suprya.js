#!/usr/bin/env node

const fs = require('fs-extra');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const program = require('commander');
const os = require('os');

const browsersList = require('./browsersList');
const paths = require('./util/paths');
const dependencies = require('./dependencies');

// Crash on unhandled rejetions instead of silently ignoring
// them. In the future, Node.js will terminate the process with
// a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

program
  .version('1.0.0', '-v, --version')
  .arguments(
    '<app-name>',
    'Specify the app name (used in package.json and for the new directory name)'
  )
  .option('-o, --output-dir [output-dir]', 'Specify the directory where the app will be created')
  .parse(process.argv);

const appName = program.name || 'suprya-app';

const appPath = paths.resolveAppPath(program.outputDir || appName);
const resolveApp = paths.resolveRelative.bind(appPath);

// Check if `appPath` is empty
if (fs.readdirSync(appPath).length) {
  console.error('The new app directory must be empty before creating a Suprya app');
  return;
}

const appPackage = {
  name: appName,
  version: '1.0.0',
  private: true,
  scripts: {
    start: 'webpack',
    build: 'webpack --run-prod --progress',
    test: 'echo "Testing with Jest is coming soon"'
  },
  dependencies: {},
  devDependencies: {},
  browserslist: browsersList
};

fs.writeFileSync(resolveApp('package.json'), JSON.stringify(appPackage, null, 2) + os.EOL);

const useYarn = fs.existsSync(resolveApp('yarn.lock'));
const templatePath = paths.resolveOwn('template');

if (fs.existsSync(templatePath)) {
  fs.copySync(templatePath, appPath);
} else {
  console.error(`Could not locate the supplied template directory: ${chalk.cyan(templatePath)}`);

  return;
}

// Rename gitignore to prevent npm from renaming it to .npmignore
// See: https://github.com/npm/npm/issues/1862

try {
  fs.moveSync(resolveApp('gitignore'), resolveApp('.gitignore'), []);
} catch (err) {
  // Apppend if there's already a `.gitignore` file
  if (err.code === 'EEXIST') {
    const tempIgnore = resolveApp('gitignore');

    const data = fs.readFileSync(tempIgnore);
    fs.appendFileSync(resolveApp('.gitignore'), data);
    fs.unlinkSync(tempIgnore);
  } else {
    throw err;
  }
}

const command = useYarn ? 'yarn' : 'npm';

const depsArgs = (useYarn ? ['add'] : ['install', '--save']).concat(dependencies.dependencies);
const devDeps = (useYarn ? ['add', '--dev'] : ['install', '--save-dev']).concat(
  dependencies.devDependencies
);

function installDeps(args, dev) {
  console.log(`Installing Suprya's ${dev ? 'dev ' : ''}dependencies using ${command}...`);

  const proc = spawn.sync(command, args, { cwd: appPath, stdio: 'inherit' });

  if (proc.status !== 0) {
    console.log(proc.error);
    console.error(`${command} ${args.join(' ')} failed`);
    return false;
  }

  return true;
}

if (!installDeps(depsArgs) || !installDeps(devDeps, true)) {
  return;
}

console.log();
console.log(`Success! Created ${appName} at ${appPath}`);
console.log('Inside that directory, you can run several commands:');
console.log();

const commands = {
  start: 'Starts the development server.',
  build: 'Bundles the app into static files for production.',
  test: 'Tests your app using Jest.'
};

Object.keys(commands).forEach(name => {
  const description = commands[name];

  console.log(chalk.cyan(`${command} run ${name}`));
  console.log(`   ${description}`);
  console.log();
});

console.log('Happy hacking!');
