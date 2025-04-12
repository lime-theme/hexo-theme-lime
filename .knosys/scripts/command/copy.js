const { resolve: resolvePath } = require('path');
const { existsSync } = require('fs');

const { resolveRootPath, ensureDirExists, copyFileDeeply, copyThemeAssets, resolveSiteSrcDir } = require('../helper');

module.exports = {
  execute: (type = 'bone') => {
    if (!['bone', 'skin'].includes(type)) {
      return;
    }

    const rootPath = resolveRootPath();
    const themeDistPath = resolvePath(rootPath, resolveSiteSrcDir('default'), 'themes/lime');

    if (type === 'skin') {
      return copyThemeAssets(resolvePath(themeDistPath, 'source'), true);
    }

    const themeSrcPath = `${rootPath}/node_modules/hexo-theme-lime`;

    if (!existsSync(themeSrcPath)) {
      return;
    }

    ensureDirExists(themeDistPath);
    copyFileDeeply(themeSrcPath, themeDistPath, ['README.md', 'CHANGELOG.md', 'package.json']);
  },
};
