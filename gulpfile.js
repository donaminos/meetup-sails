'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    exorcist = require('exorcist'),
    buffer = require('vinyl-buffer'),
    bower = require('bower'),
    templateCache = require('gulp-angular-templatecache'),
    through = require('through2'),
    gutil = require('gulp-util'),
    path = require('path'),
    _ = require('lodash'),
    gulpfile;

gulpfile = {
    /**************/
    /* GULP TASKS */
    /**************/

    initialize: function () {
        gulp.task('compile', this.compile.bind(this));
        gulp.task('watch', ['compile'], this.watch.bind(this));
        gulp.task('install', this.install.bind(this));

        gulp.task('default', ['watch']);

        return this;
    },

    install: function () {
        return bower.commands.install()
            .on('log', function (data) {
                gutil.log('bower', gutil.colors.cyan(data.id), data.message);
            })
            .on('end', function () {
                gulp.start('watch');
            });
    },

    compile: function () {
        gulp.src(['ihm/todo.html'])
            .pipe(gulp.dest('assets/'));

        gulp.src('bower_components/bootstrap/dist/css/bootstrap.css')
            .pipe(gulp.dest('assets/'));
        gulp.src('bower_components/bootstrap/dist/fonts/*')
            .pipe(gulp.dest('assets/fonts/'));

        gulp.src('ihm/views/**/*.html')
            .pipe(templateCache({
                module: 'starter'
            }))
            .pipe(this.browserify('./ihm/scripts/bootstrap.js', {
                debug: true,
                dest: 'assets/'
            }))
            .pipe(gulp.dest('assets/'));
    },

    watch: function () {
        gulp.watch('ihm/**/*', ['compile']);
    },

    /******************/
    /* GULP FUNCTIONS */
    /******************/

    browserify: function (filename, _options) {
        var dirname = path.dirname(filename),
            basename = path.basename(filename, '.js'),
            options = _.extend({}, {
                debug: false,
                dest: './tmp'
            }, _options);

        return through.obj(function (file, enc, cb) {
            var parent = this,
                b;

            b = browserify({
                debug: options.debug,
                basedir: dirname
            })
                //.require(file, {expose: 'templates'})
                .add('./' + basename)
                .add(file)
                .bundle();

            if (options.debug) {
                b = b.pipe(exorcist(options.dest + basename + '.js.map'));
            }

            b.pipe(source(basename + '.js'))
                .pipe(buffer())
                .pipe(through.obj(function (_file, _enc, _cb) {
                    parent.push(_file);
                    _cb();
                }, function () {
                    cb();
                }));
        })
    }
};
Object.create(gulpfile).initialize();
