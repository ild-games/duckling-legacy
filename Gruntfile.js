/**
 * Function that defines the order to include directories for typescript compilation. The
 * purpose is to enforce a strict dependency chain and reduce the number of required
 * references.
 */

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            spec: {
                expand : true,
                flatten : true,
                cwd : '.',
                src : ['spec/ts/**/*.coffee'],
                dest: 'build/spec/',
                ext: '.js'
            }
        }
    });
    grunt.registerTask('default', ['coffee']);
};
