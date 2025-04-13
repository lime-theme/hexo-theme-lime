const { execSync } = require('child_process');
const { pick } = require('@ntks/toolbox');

const { resolveRootPath, ensureDirExists, cp, rm, saveData } = require('../helper');

const prjRoot = resolveRootPath();
const distRoot = `${prjRoot}/dist`;

function zipTheme(dirName) {
  const fileName = `${dirName}-theme-lime.zip`;

  rm(`${distRoot}/${fileName}`);
  execSync(`zip -rm ${fileName} ${dirName}`, { stdio: 'inherit', cwd: distRoot });
}

function copyMetaFiles() {
  const distDir = `${distRoot}/hexo`;
  const readmeTemplate = `# hexo-theme-lime

The SSG adapter for Hexo.

## Getting Started

Please follow the documentation [on the website](https://lime-theme.github.io).
`;

  saveData(`${distDir}/README.md`, readmeTemplate);
  cp(`${prjRoot}/CHANGELOG.md`, `${distDir}/`);
}

function copyHexoFiles() {
  const hexoDistRoot = `${distRoot}/hexo`;

  ensureDirExists(hexoDistRoot, true);

  ['template', 'asset'].forEach(type => {
    execSync(`npm run copy ${type} ${hexoDistRoot}`, { stdio: 'inherit', cwd: prjRoot });
  });

  const pkgFields = pick(require(`${prjRoot}/package.json`), ['version', 'description', 'repository', 'author', 'license', 'bugs', 'homepage', 'dependencies', 'peerDependencies']);

  saveData(`${hexoDistRoot}/package.json`, JSON.stringify({
    name: 'hexo-theme-lime',
    main: 'package.json',
    keywords: ['hexo', 'theme', 'lime', 'knosys', 'ksio'],
    ...pkgFields,
  }, null, 2));
  copyMetaFiles();
}

module.exports = {
  execute: () => {
    ensureDirExists(distRoot, true);
    copyHexoFiles();
    execSync('npm publish', { stdio: 'inherit', cwd: `${distRoot}/hexo` });
    zipTheme('hexo');
  },
};
