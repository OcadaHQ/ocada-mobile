const { withXcodeProject } = require('expo/config-plugins');
  
module.exports = (config) => {
    return withXcodeProject(config, async (config) => {

        const xcodeProject = config.modResults;
        xcodeProject.addBuildProperty('ENABLE_BITCODE', 'NO');

        return config;
    });
};
