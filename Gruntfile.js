/*global module:false*/
module.exports = function(grunt) {
    var sourceFiles = [
        'src/main.js',
        'src/animation.js',
        'src/audiofile.js',
        'src/camera.js',
        'src/game.js',
        'src/imagefile.js',
        'src/input.js',
        'src/map.js',
        'src/mapcollisions.js',
        'src/mapfile.js',
        'src/molecule.js',
        'src/move.js',
        'src/mwebaudio.js',
        'src/physics.js',
        'src/scene.js',
        'src/spritesheet.js',
        'src/spritesheetfile.js',
        'src/maudio.js',
        'src/sprite.js',
        'src/spritecollisions.js',
        'src/text.js',
        'src/tile.js',
        'src/utils.js',
        'src/webaudiofile.js'
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
            }

        },

        uglify: {
            options: {
                report: 'min',
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'build/<%= pkg.name %>-<%= pkg.version %>.min.js': [
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
                'build/<%= pkg.name %>.js',
                'build/<%= pkg.name %>.min.js'
            ]
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
