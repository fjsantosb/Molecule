/*global module:false*/
module.exports = function(grunt) {
    var sourceFiles = [
        'core/molecule.js',
        'core/animation.js',
        'core/audiofile.js',
        'core/camera.js',
        'core/game.js',
        'core/imagefile.js',
        'core/input.js',
        'core/map.js',
        'core/mapcollisions.js',
        'core/mapfile.js',
        'core/move.js',
        'core/physics.js',
        'core/scene.js',
        'core/sound.js',
        'core/sprite.js',
        'core/spritecollisions.js',
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
        tdd: {
            molecule: {
                files: {
                    sources: ['core/molecule.js', 'core/**/*.js'],
                    libs: [],
                    tests: ['tests/**/*-test.js']
                },
                options: {
                    runner: 'buster',
                    expect: true,
                    sinon: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tdd');
    grunt.loadNpmTasks('grunt-replace');

    // Default task.
    grunt.registerTask('default', ['concat', 'replace:dist', 'uglify']);
    grunt.registerTask('build', ['jshint:beforeConcat', 'concat', 'replace:dist', 'jshint:afterConcat']);
};
