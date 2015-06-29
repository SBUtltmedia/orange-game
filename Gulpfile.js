var gulp        = require('gulp'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    babelify    = require('babelify'),
    copy        = require('gulp-copy'),
    server      = require('gulp-develop-server'),
    clean       = require('gulp-rimraf'),
    plumber     = require('gulp-plumber'),
    source      = require('vinyl-source-stream')
    //livereload  = require('gulp-livereload');

var paths = {
    scripts: ['src/**/*.js', 'src/**/*.jsx'],
    tests: ['tests/**/*.js'],
    sass: ['src/**/*.s?ss'],
    main_client_script: 'src/main.js',
    main_sass: 'src/styles/main.scss',
    server_file: 'server.js',
    build_path: 'build/'
};

gulp.task('client:browserify', function () {
    return browserify(paths.main_client_script, {
              debug: true //it's necessary to a source map generate
    })
    .transform(babelify, { stage: 0, optional: ["runtime"] })
    .bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(gulp.dest(paths.build_path));
});

gulp.task('sass', function () {
    return gulp.src([paths.main_sass])
        .pipe(sass())
        .pipe(gulp.dest(paths.build_path));
});

gulp.task('images:copy', function() {
    return gulp.src('images/**')
        .pipe(copy(paths.build_path));
});

gulp.task('html:copy', function() {
    return gulp.src('index.html')
        .pipe(copy(paths.build_path));
});

gulp.task('server:run', ['client:browserify', 'sass', 'html:copy', 'images:copy'], function() {
    server.listen( { path: paths.server_file } );
});

gulp.task('server:restart', ['client:browserify', 'sass', 'html:copy', 'images:copy'], function() {
    server.restart();
    //livereload();
});

gulp.task('clean', function() {
    return gulp.src([paths.build_path], { read: false }).pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('server:run');
});

gulp.task('watch', ['default'], function () {
    //livereload.listen();
    gulp.watch([paths.scripts], ['server:restart']);
    gulp.watch(paths.sass, ['sass']);
});
