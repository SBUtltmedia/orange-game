var gulp        = require('gulp'),
    sourcemaps  = require('gulp-sourcemaps'),
    babel       = require('gulp-babel'),
    copy        = require('gulp-copy'),
    clean       = require('gulp-rimraf'),
    mocha       = require('gulp-mocha');

var paths = {
    scripts: ['src/**/*.js', 'src/**/*.jsx'],
    tests: ['tests/**/*.js'],
    build_path: 'build/',
    tests_src_build_path: 'build/src/',
    tests_build_path: 'build/tests/'
};

gulp.task('tests:source:babel', ['clean'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tests_src_build_path));
});

gulp.task('tests:babel', ['tests:source:babel'], function () {
    return gulp.src(paths.tests)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tests_build_path));
});

gulp.task('clean', function() {
    return gulp.src([paths.build_path], { read: false }).pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch([paths.scripts, paths.tests], ['tests']);
});

gulp.task('tests', ['tests:babel'], function() {
    return gulp.src(paths.tests_build_path + '**/*.js', { read: false })
            // gulp-mocha needs filepaths so you can't have any plugins before it
            .pipe(mocha({}));
});
