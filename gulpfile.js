var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  livereload = require('gulp-livereload'),
  bowerFiles = require('main-bower-files');

var distPath = 'dist'

gulp.task('js', function() {
  gulp.src(['app/public/js/app.js', 'app/public/js/**/*.js', '!app/public/js/**/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
      .pipe(concat('app.min.js'))
      .pipe(ngAnnotate())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/public/js/'));
});

gulp.task('lib', function(){
  gulp.src(bowerFiles())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('app/public/js/'));
});

gulp.task('watch', ['js', 'lib'], function() {
  livereload.listen();

  gulp.watch(['app/public/js/**/*.js', '!app/public/js/**/*.min.js'], ['js']);

  gulp.watch('app/public/js/*.min.js').on('change', livereload.changed);
  gulp.watch('app/public/tpls/**/*.html').on('change', livereload.changed);
  gulp.watch('app/public/index.html').on('change', livereload.changed);

});

gulp.task('default', ['js', 'lib']);
