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
        concat: {
          
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
            demo: ['demo'],
            assets: ['dist/assets']
        }
    });
    
    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    
    
    // Register runnable tasks.
    grunt.registerTask('gen-js', ['browserify', 'uglify']);
    grunt.registerTask('gen-css', ['less:less_base', 'less:less_themes', 'clean:assets', 'copy:assets']);
    grunt.registerTask('gen-docs', ['clean:demo', 'clean:docs', 'copy:demoResources', 'gen-demos', 'concat', 'yuidoc']);
    grunt.registerTask('default', ['gen-js', 'gen-docs', 'gen-css']);
    grunt.registerTask('dist', ['default']);
    
    grunt.registerTask('gen-demos', 'iterates over all module directories and compiles modules js files', function() {
        // Process all demo scripts
        grunt.file.expand('demo-src/*').forEach(function(file){
            
            // Return if not a js file.
            if(path.basename(file).indexOf('.js') == -1) return;

            var conf = {
                demoName: path.basename(file).split('.js').join('')
            };
            
            // Create a new concat task.
            var concat = grunt.config.get('concat') || {};
            
            // Combine the script with the header and footer.
            concat['demo-'+conf.demoName] = {
                // Replace demoName in the templates with the name of the demo.
                options: {
                    banner: '<!-- Auto-generated demo file for <%= pkg.name %> - <%= pkg.version %> -->\n',
                    process: {data:conf}
                },
                src: ['demo-src/TEMPLATE_HEADER.html', file, 'demo-src/TEMPLATE_FOOTER.html'],
                dest: 'demo/'+conf.demoName+'.html'
            };
            
            // Save the new concat configuration.
            grunt.config.set('concat', concat);
        });
    });
};
