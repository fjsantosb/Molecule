/*global module:false*/
module.exports = function(grunt) {
    var sourceFiles = [
        'core/animation.js',
        'core/audiofile.js',
        'core/camera.js',
        'core/game.js',
        'core/imagefile.js',
        'core/input.js',
        'core/map.js',
        'core/mapfile.js',
        'core/scene.js',
        'core/sprite.js',
        'core/sound.js',
        'core/text.js',
        'core/tile.js',
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: sourceFiles,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        replace: {
            options: {
                variables: {
                    'VERSION': '<%= pkg.version %>'
                },
                prefix: '@',
                force: true
            },

            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [ 'build/<%= pkg.name %>-<%= pkg.version %>.js' ],
                        dest: 'build/'
                    }
                ]
            },

        },

        uglify: {
            options: {
                report: 'min',
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'build/<%= pkg.name %>-<%= pkg.version %>-min.js': [
                        '<%= concat.dist.dest %>'
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            beforeConcat: {
                files: {
                    src: sourceFiles
                }
            },

            afterConcat: {
                files: {
                    src: [ '<%= concat.dist.dest %>' ]
                }
            }
        },

        clean: {
            dist: [
                'build/<%= pkg.name %>-<%= pkg.version %>.js',
                'build/<%= pkg.name %>-<%= pkg.version %>-min.js'
            ],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');

    // Default task.
    grunt.registerTask('default', ['concat', 'replace:dist', 'uglify']);
    grunt.registerTask('lint', ['jshint:beforeConcat', 'concat', 'replace:dist', 'jshint:afterConcat']);
};
