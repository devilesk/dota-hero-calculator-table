var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var replace = require('gulp-replace');
var git = require('git-rev-sync');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var gulpSequence = require('gulp-sequence');
var del = require('del');

gulp.task('copy-navbar', function () {
    return gulp.src('/srv/www/dev.devilesk.com/dota2/.navbar.html')
        .pipe(gulp.dest('www/'))
});

gulp.task('html', ['copy-navbar'], function () {
    return gulp.src('www/index.html')
        .pipe(preprocess({
            context: {
                NODE_ENV: 'production',
                COMMIT_HASH: git.short()
            }
        })) //To set environment variables in-line 
        .pipe(replace('bootstrap.css', 'bootstrap.min.css'))
        .pipe(gulp.dest('dist/'))
});

gulp.task('bundle-prod', function () {
    return browserify(['./www/js/main.js'], {debug:true})  // Pass browserify the entry point
        .external('knockout')
        .external('jquery')
        .transform('brfs')
        .transform('browserify-replace', {
            replace: [
                { from: /#DEV_BUILD/, to: new Date().toString() },
                { from: /#code_version/, to: git.long() },
                { from: /environment: 'development'/, to: "environment: 'production'" }
            ]
        })
        .bundle()
        .pipe(source('./www/js/main.js'))
        .pipe(buffer())
        .pipe(rename('bundle.' + git.short() + '.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
});

gulp.task('bundle', function () {
    return browserify('./www/js/main.js', {debug:true})  // Pass browserify the entry point
        .external('knockout')
        .external('jquery')
        .transform('brfs')
        .bundle()
        .pipe(source('./www/js/main.js'))
        .pipe(buffer())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./www/js/'))
});

gulp.task('clean', function () {
    return del([
        './dist/**/*'
    ], {force: true});
});

gulp.task('staging', gulpSequence('bundle-prod', ['html']));