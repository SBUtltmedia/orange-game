var gulp        = require('gulp'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    babel       = require('gulp-babel'),
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
    server_path: 'server/',
    server_files: 'server/**/*.js',
    main_server_script: 'server.js',
    build_path: 'build/',
    public_build_path: 'build/public/'
};

gulp.task('server:babel', function () {
    return gulp.src(paths.server_files)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build_path));
});

gulp.task('client:browserify', function () {
    return browserify(paths.main_client_script, {
        debug: true //it's necessary to a source map generate
    })
    .transform(babelify, { stage: 0, optional: ["runtime"] })
    .bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(gulp.dest(paths.public_build_path));
});

gulp.task('sass', function () {
    return gulp.src([paths.main_sass])
        .pipe(sass())
        .pipe(gulp.dest(paths.public_build_path));
});

gulp.task('images:copy', function() {
    return gulp.src('images/**')
        .pipe(copy(paths.public_build_path));
});

gulp.task('html:copy', function() {
    return gulp.src('index.html')
        .pipe(copy(paths.public_build_path));
});

gulp.task('server:run', ['client:compile', 'server:babel'], function() {
    server.listen( { path: paths.build_path + paths.main_server_script } );
});

gulp.task('client:compile', ['client:browserify', 'sass', 'html:copy', 'images:copy'], function() {

});

gulp.task('server:compile', ['server:babel'], function() {
    server.restart();
});

gulp.task('clean', function() {
    return gulp.src([paths.build_path], { read: false }).pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('server:run');
});

gulp.task('watch', ['default'], function () {
    //livereload.listen();
    gulp.watch([paths.scripts], ['client:compile']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.server_files, ['server:compile'])
});

gulp.task('heroku:dev', ['default']);
gulp.task('build', ['default']);
