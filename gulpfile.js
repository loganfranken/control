var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

gulp.task('default', ['build:js', 'build:css', 'stage:js', 'stage:css', 'stage:html', 'package']);

gulp.task('build:js', function() {

  return gulp.src('./script/*.js')
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./script/'));

});

gulp.task('build:css', function() {

  return gulp.src('./style/*.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./style/'));

});

gulp.task('stage:js', ['build:js'], function() {
  return gulp.src('./script/bundle.min.js').pipe(gulp.dest('./dist/script'));
});

gulp.task('stage:css', ['build:css'], function() {
  return gulp.src('./style/main.min.css').pipe(gulp.dest('./dist/style'));
});

gulp.task('stage:html', function() {

  return gulp.src('./index.html')
    .pipe(replace(/<script src="[A-Za-z\/.]+"><\/script>/g, ''))
    .pipe(replace(/\.css/g, '.min.css'))
    .pipe(replace(/<\/body>/g, '<script src="script/bundle.min.js"></script></body>'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));

});

gulp.task('package', ['stage:js', 'stage:css', 'stage:html'], function() {

    return gulp.src('dist/**')
        .pipe(zip('control.zip'))
        .pipe(gulp.dest('dist'));

});

gulp.task('clean', function() {
  del('./script/bundle*.js');
  del('./style/main.min.css');
  del('./dist');
});
