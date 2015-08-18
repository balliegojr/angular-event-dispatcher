module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },
            build: [
                'Grunfile.js',
                'src/*.js',
                'test/*.js',
            ]
        },
        jasmine: {
            test: {
                src: [
                    'src/*.js',
                ],
                options: {
                    summary: true,
                    display: 'short',
                    specs: ['test/*.spec.js'],
                    vendor: [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: '.bin/coverage/coverage.json',
                        report: '.bin/coverage',
                        thresholds: {
                            lines: 80,
                            statements: 80,
                            branches: 70,
                            functions: 70
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('test', 'launch js tests', ['jshint', 'jasmine']);
};