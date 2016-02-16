/**
 * Function that defines the order to include directories for typescript compilation. The
 * purpose is to enforce a strict dependency chain and reduce the number of required
 * references.
 */
function getTSDirs() {
    var directories = ["src/bootstrap.ts"];

    for (var i = 0; i < arguments.length; i++) {
        directories.push("src/ts/" + arguments[i] + "/**/*.ts");
    }

    return directories;
}

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-tsd");
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install : {

            }
        },
        tsd: {
            refresh : {
                options: {
                    command: 'reinstall',
                    latest: true,
                    config: 'tsd.json',
                }

            }
        },
        typescript: {
            duckling: {
            },
            spec_helpers: {
                src: "spec/helpers/**/*.ts",
                dest: 'build/spec/tshelpers.js',
                options: {
                    module: 'commonjs',
                    sourceMap: true,
                    target: 'es5',
                    experimentalDecorators: true,
                    references: [
                        "typings/tsd.d.ts",
                        "build/scripts/duckling.d.ts"
                    ]
                }
            }
        },
        image: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'resources',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'build/resources'
                }]
            }
        },
        copy: {
            package: {
                files: [
                    {
                        expand: true,
                        src: 'package.json',
                        dest: 'build'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/fonts',
                        src: '**/*',
                        dest: 'build/fonts',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/fonts',
                        src: '**/*',
                        dest: 'build/fonts',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
            },
            spec: {
                files : [
                    {
                        expand: true,
                        src: 'spec/SpecRunner.html',
                        dest: 'build'
                    },
                    {
                        expand: true,
                        src: 'spec/package.json',
                        dest: 'build'
                    }
                ]
            }
        },
        watch: {
            scripts : {
                files: ['src/bootstrap.ts', 'src/ts/**/*.ts', 'spec/**/*.ts'],
                tasks: ['typescript']
            },
            coffeescripts : {
                files: ['spec/**/*.coffee'],
                tasks: ['coffee']
            },
            jade : {
                files: ['src/index.jade', 'src/jade/**/*.jade'],
                tasks: ['jade']
            },
            styles : {
                files: ['src/sass/**/*.scss'],
                tasks: ['sass']
            },
            resources : {
                files: ['resources/**'],
                tasks: ['copy', 'image']
            }
        },
        coffee: {
            spec: {
                files: {
                    'build/spec/specs.js' : 'spec/**/*.coffee'
                }
            }
        }
    });
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['typescript','concat','copy','jade','sass','image','coffee']);
    grunt.registerTask('install', ['bower','tsd']);
};
