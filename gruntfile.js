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
            less_themes: {
                options: {
                    paths: ['.'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                        new (require('less-plugin-clean-css'))()
                    ],
                },
                files: {
                    'dist/photonui-theme-particle.css': 'less/theme-particle/photonui-theme-particle.less',
                    'dist/photonui-theme-wave.css': 'less/theme-wave/photonui-theme-wave.less'
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
            },
            demoResources: {
                expand: true,
                cwd: 'demo-src/Resources/',
                src: '**',
                dest: 'demo/'
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

    // Register runnable tasks.
    grunt.registerTask('gen-js', ['browserify', 'uglify']);
    grunt.registerTask('gen-css', ['less:less_base', 'less:less_themes', 'clean:assets', 'copy:assets']);
    grunt.registerTask('gen-docs', ['clean:docs', 'copy:demoResources', 'yuidoc']);
    grunt.registerTask('default', ['gen-js', 'gen-docs', 'gen-css']);
    grunt.registerTask('dist', ['default']);
};
