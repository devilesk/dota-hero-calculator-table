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
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');

gulp.task('css', function () {
    return gulp.src([
          'www/css/*.css'
        ])
        .pipe(concat('app.css'))
        .pipe(minifyCSS())
        .pipe(rename('app.min.' + git.short() + '.css'))
        .pipe(gulp.dest('dist/css'))
});

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

gulp.task('clean-deploy', function () {
    return del([
        '/srv/www/devilesk.com/dota2/apps/hero-table/**/*'
    ], {force: true});
});

gulp.task('deploy', function () {
    return gulp.src([
            'dist/**/*'
        ])
        .pipe(gulp.dest('/srv/www/devilesk.com/dota2/heroes/hero-stat-table'));
});

gulp.task('staging', gulpSequence('bundle-prod', ['css', 'html']));

gulp.task('full-deploy', gulpSequence('staging', 'clean-deploy', 'deploy'));