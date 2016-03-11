module.exports = function (shipit) {

    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            workspace: './build',
            deployTo: './app',
            repositoryUrl: 'https://github.com/hustleandpraise/feckfriday.git',
            ignores: ['.git', 'node_modules'],
            rsync: ['--del'],
            keepReleases: 2,
        },

        staging: {
            servers: ''
        }
    });

    shipit.on('published', () => {
        console.log('Done!');  
    });

    shipit.task('deploy:clean', function () {
        shipit.local('rm -rf ./build')
    });
    
};
