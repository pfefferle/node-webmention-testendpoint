/* jshint strict: true */
/* global module */
module.exports = function (grunt) {

    'use strict';
    // Project configuration.
    grunt.initConfig({
        markdown: {
            all: {
                files: [{
                    expand: true,
                    src: '*.md',
                    dest: 'templates',
                    ext: '.html'
                }],
                options: {
                    template: 'templates/template.jst'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-markdown');

    // Default task(s).
    grunt.registerTask('default', ['markdown']);
};
