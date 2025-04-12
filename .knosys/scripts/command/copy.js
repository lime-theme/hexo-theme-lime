const { resolve: resolvePath } = require('path');

const { resolveRootPath, copyThemeAssets, copyThemeTemplates, resolveSiteSrcDir } = require('../helper');

module.exports = {
  execute: (type = 'template') => {
    if (!['template', 'asset'].includes(type)) {
      return;
    }

    const themeDistPath = resolvePath(resolveRootPath(), resolveSiteSrcDir('default'), 'themes/lime');

    if (type === 'asset') {
      return copyThemeAssets(resolvePath(themeDistPath, 'source'), true);
    }

    copyThemeTemplates(themeDistPath);
  },
};
