var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': ['src/photonui.js']
                },
                options: {
                    browserifyOptions: {
                        'standalone': '<%= pkg.name %>'
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },

        yuidoc: {
            doc: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    linkNatives: true,
                    attributesEmit: true,
                    selleck: true,
                    paths: ['./src/'],
                    outdir: './doc/',
                    tabtospace: 2
                }
            }
        },

        jshint: {
            all: ['src/**/*.js'],
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                globals: {"File": false},
                browser: true,
                browserify: true
            }
        },

        jscs: {
            src: "src/**/*.js",
            options: {
                config: ".jscsrc"
            }
        },

        jasmine: {
            pivotal: {
                src: ['dist/photonui.js', 'test/helpers.js'],
                options: {
                    specs: ['test/spec/*.js', 'test/spec/**/*.js'],
                    styles: ['dist/photonui-base.css', 'dist/photonui-theme-particle.css', 'test/style.css'],
                    helpers: []
                }
            }
        },

        less: {
            less_base: {
                options: {
                    paths: ['.'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                        new (require('less-plugin-clean-css'))()
                    ],
                },
                files: {
                    'dist/photonui-base.css': 'less/base/photonui-base.less'
                }
            },
            less_theme: {
                options: {
                    paths: ['.'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                        new (require('less-plugin-clean-css'))()
                    ],
                },
                files: {
                    'dist/photonui-theme-particle.css': 'less/theme-particle/photonui-theme-particle.less'
                }
            },
        },

        copy: {
            assets: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                cwd: 'src/assets/',
                src: '**',
                dest: 'dist/assets/'
            }
        },

        watch: {
            javascript: {
                files: ['src/**/*.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            },
            lessBase: {
                files: ['less/base/**/*.less'],
                tasks: ['less:less_base'],
                options: {
                    spawn: false
                }
            },
            lessTheme: {
                files: ['less/theme-particle/**/*.less'],
                tasks: ['less:less_theme'],
                options: {
                    spawn: false
                }
            }
        },

        clean: {
            dist: ['dist'],
            docs: ['doc'],
            assets: ['dist/assets']
        }
    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-jscs");

    // Register runnable tasks.
    grunt.registerTask('default', ['gen-js', 'gen-docs', 'gen-css']);
    grunt.registerTask('gen-js', ['browserify', 'uglify']);
    grunt.registerTask('gen-css', ['less:less_base', 'less:less_theme', 'clean:assets', 'copy:assets']);
    grunt.registerTask('gen-docs', ['clean:docs', 'yuidoc']);
    grunt.registerTask('test', ['jshint', 'jscs', 'default', 'jasmine']);
};
