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
});

gulp.task('fonts', function(){
  var fontsFilter = filter(['*.eot', '*.svg', '*.ttf', '*.woff']);
  gulp.src(vendorFiles)
    .pipe(fontsFilter)
      .pipe(gulp.dest('app/public/fonts'))
    .pipe(fontsFilter.restore());
});

gulp.task('songs', function(){
  gulp.src(['app/server/data/songs/bracket.open.txt',
            'app/server/data/songs/*.json',
            'app/server/data/songs/bracket.close.txt'])
    .pipe(concat('songs.json', {newLine: ','}))
    .pipe(gulp.dest('app/server/data/'));
});

gulp.task('watch', ['js', 'lib','css', 'fonts', 'songs'], function() {
  livereload.listen();

  gulp.watch(['app/public/js/**/*.js', '!app/public/js/**/*.min.js'], ['js']);

  gulp.watch('app/public/js/*.min.js').on('change', livereload.changed);
  gulp.watch('app/public/tpls/**/*.html').on('change', livereload.changed);
  gulp.watch('app/public/index.html').on('change', livereload.changed);

  gulp.watch('test/**/*.js').on('change', livereload.changed);
});

gulp.task('release', ['css', 'fonts', 'songs'], function(){
  // compile app js
  gulp.src(['app/public/js/app.js', 'app/public/js/**/*.js', '!app/public/js/**/*.min.js'])
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/public/js'));

  // compile bower components - js
  var jsFilter = filter('*.js');
  gulp.src(vendorFiles)
    .pipe(jsFilter)
      .pipe(concat('lib.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/public/js'))
    .pipe(jsFilter.restore());

  // all the other public files/folders
  gulp.src(['app/public/**', '!app/public/js/**'])
    .pipe(gulp.dest('dist/public/'));

  // server files
  gulp.src(['app/server/**', '!app/server/data/songs/**'])
    .pipe(gulp.dest('dist/server'))

  // misc
  gulp.src(['LICENSE-MIT', 'Procfile'])
    .pipe(gulp.dest('dist/'))

});

gulp.task('default', ['js', 'lib', 'css', 'fonts', 'songs']);
