module.exports = function(grunt) {

  var files = grunt.file.readJSON('files.json');
  var projectFiles = [];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: [],
        dest: '../libs/<%= project %>.<%= pkg.version %>.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        src: '../libs/<%= project %>.<%= pkg.version %>.js',
        dest: '../libs/<%= project %>.<%= pkg.version %>.min.js'
      }
    },
    cssmin: {
      dist: {
        src: [],
        dest: '../libs/<%= project %>.<%= pkg.version %>.min.css',
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        src: [],
        dest: '../libs/<%= project %>.<%= pkg.version %>.min.html',
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        version: '<%= pkg.version %>',
        description: '<%= pkg.description %>',
        url: '<%= pkg.url %>',
        logo: '<%= pkg.logo %>',
        options: {
          paths: ['../src'],
          outdir: '../docs/behavior3js/',
          linkNatives: true,
          attributesEmit: true,
          selleck: true,
          helpers: ["../build/path.js"],
          themedir: "createjsTheme/"
        }
      }
    },
    compress: {
      build: {
        options: {
          mode:'zip',
          archive:'../docs/<%= project %>.<%= pkg.version %>.zip'
        },
        files: [
          {expand:true, src:'**', cwd:'../docs/behavior3js'}
        ]
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // DOCS
  grunt.registerTask('_docs', function() {
    grunt.config.set('project', 'behavior3js');
  });

  // CORE
  grunt.registerTask('_core', function() {
    grunt.config.set('project', 'b3core');
    grunt.config.set('concat.dist.src', files['core_source']);
  });

  // VIEW
  grunt.registerTask('_view', function() {
    grunt.config.set('project', 'b3view');
    grunt.config.set('concat.dist.src', files['view_source']);
  });

  // EDITOR
  grunt.registerTask('_editor', function() {
    grunt.config.set('project', 'b3editor');
    grunt.config.set('concat.dist.src', files['editor_source']);
  });
  grunt.registerTask('_editor_html', function() {
    grunt.config.set('project', 'b3editor');
    grunt.config.set('concat.dist.src', files['editor_html']);
    grunt.config.set('concat.dist.dest', '../libs/<%= project %>.<%= pkg.version %>.html');
    grunt.config.set('htmlmin.dist.src', '../libs/<%= project %>.<%= pkg.version %>.html');
  });
  grunt.registerTask('_editor_css', function() {
    grunt.config.set('project', 'b3editor');
    grunt.config.set('cssmin.dist.src', files['editor_css']);
  });

  // Default task(s).
  grunt.registerTask('docs', ['_docs', 'yuidoc', 'compress']);
  grunt.registerTask('core', ['_core', 'concat', 'uglify']);
  grunt.registerTask('view', ['_view', 'concat', 'uglify']);
  grunt.registerTask('editor', ['editor_app', 'editor_html','editor_css']);
  grunt.registerTask('editor_app', ['_editor', 'concat', 'uglify']);
  grunt.registerTask('editor_css', ['_editor_css', 'cssmin']);
  grunt.registerTask('editor_html', ['_editor_html', 'concat', 'htmlmin']);

};