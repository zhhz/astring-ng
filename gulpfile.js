var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  livereload = require('gulp-livereload'),
  filter = require('gulp-filter'),
  bowerFiles = require('main-bower-files');

var vendorFiles = bowerFiles();

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
  var jsFilter = filter('*.js');

  gulp.src(vendorFiles)
    .pipe(jsFilter)
      .pipe(concat('lib.min.js'))
      .pipe(gulp.dest('app/public/js/'))
    .pipe(jsFilter.restore());
});


gulp.task('css', function(){
  var cssFilter = filter('*.css');

  // bower components - css
  gulp.src(vendorFiles)
    .pipe(cssFilter)
      .pipe(concat('lib.css'))
      .pipe(gulp.dest('app/public/css'))
    .pipe(cssFilter.restore());

  // app css
  // TODO: Not working now, because loading sequence matters
  /*
  gulp.src(['public/css/**', '!public/css/lib.css'])
    .pipe(cssFilter)
      .pipe(concat('app.css'))
    .pipe(cssFilter.restore())
    .pipe(gulp.dest('app/public/css'));
  */

});

gulp.task('fonts', function(){
  var fontsFilter = filter(['*.eot', '*.svg', '*.ttf', '*.woff']);
  gulp.src(vendorFiles)
    .pipe(fontsFilter)
      .pipe(gulp.dest('app/public/fonts'))
    .pipe(fontsFilter.restore());
});

/*
gulp.task('uncss', function() {
    return gulp.src('site.css')
        .pipe(uncss({
            html: ['index.html', 'about.html']
        }))
        .pipe(gulp.dest('./out'));
});
*/

gulp.task('watch', ['js', 'lib','css', 'fonts'], function() {
  livereload.listen();

  gulp.watch(['app/public/js/**/*.js', '!app/public/js/**/*.min.js'], ['js']);

  gulp.watch('app/public/js/*.min.js').on('change', livereload.changed);
  gulp.watch('app/public/tpls/**/*.html').on('change', livereload.changed);
  gulp.watch('app/public/index.html').on('change', livereload.changed);

});

gulp.task('default', ['js', 'lib', 'css', 'fonts']);
