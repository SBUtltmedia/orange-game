var gulp        = require('gulp'),
    browserify  = require('gulp-browserify'),
    sourcemaps  = require('gulp-sourcemaps'),
    copy        = require('gulp-copy'),
    server      = require('gulp-develop-server'),
    //watch       = require('gulp-watch'),
    plumber     = require('gulp-plumber')
    runSequence = require('run-sequence');

var paths = {
    scripts: ['src/**/*.js', 'src/**/*.jsx'],
    main_script: 'src/index.js',
    server_file: 'server.js',
    build_path: 'build/',
    images: 'images/**'
};

gulp.task('client:browserify', function () {
    return gulp.src([paths.main_script])
        .pipe(plumber())
        .pipe(browserify({
            debug: true,
            transform: [ 'babelify' ]
        }))
        .pipe(gulp.dest(paths.build_path));
});

gulp.task('images:copy', function() {
    return gulp.src(paths.images)
        .pipe(copy(paths.build_path));
});

gulp.task('html:copy', function() {
    return gulp.src('index.html')
        .pipe(copy(paths.build_path));
});

gulp.task('css:copy', function() {
    return gulp.src('style.css')
        .pipe(copy(paths.build_path));
});

gulp.task('server:run', function() {
    server.listen( { path: paths.server_file } );
});

gulp.task('default', function() {
    runSequence(
      ['client:browserify', 'images:copy', 'html:copy', 'css:copy'],
      'server:run'
    );
});

gulp.task('watch', ['default'], function () {
    gulp.watch(paths.scripts, ['client:browserify']);
});

gulp.task('heroku:dev', ['default']);
gulp.task('build', ['default']);
