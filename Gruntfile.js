module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            duckling: {
                src: ['src/ts/**/*.ts'],
                dest: 'build/scripts/duckling.js',
                options: {
                    module: 'commonjs',
                    sourceMap: true,
                    target: 'es5'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            jsdepend: {
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/sightglass/index.js',
                    'node_modules/rivets/dist/rivets.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'node_modules/bootstrap-select/dist/js/bootstrap-select.js',
                    'node_modules/jade/runtime.js',
                    'node_modules/mousetrap/mousetrap.js'
                ],
                dest: 'build/dependencies/dependencies.js'
            },
            cssdepend: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    'node_modules/bootstrap-select/dist/css/bootstrap-select.css'
                ],
                dest: 'build/dependencies/dependencies.css'
            }
        },
        sass: {
            dist : {
                files: {
                    'build/styles/duckling.css': 'src/sass/main.scss'
                }
            }
        },
        copy: {
            package: {
                files: [
                    {expand: true, src: 'package.json', dest: 'build'}
                ]
            }
        },
        jade: {
            index: {
                files: {
                    "build/index.html" : ["src/index.jade"]
                }
            },
            views: {
                options: {
                    client: "true",
                    namespace: "views.templates",
                    processName: function(filename) {
                        return filename.slice("src/jade/".length,-".jade".length);
                    }
                },
                files: {
                    "build/scripts/duckling_views.js" : ["src/jade/**/*.jade"]
                }
            }
        }
    });

    grunt.registerTask('default', ['typescript','concat','copy','jade', 'sass']);
}
