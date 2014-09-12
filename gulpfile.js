var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  livereload = require('gulp-livereload'),
  filter = require('gulp-filter'),
  git = require('gulp-git'),
  bump = require('gulp-bump'),
  tagVersion = requrie('gulp-tag-version'),
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

gulp.task('dist', ['css', 'fonts', 'songs'], function(){
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

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])
      .pipe(bump({type: importance})) // bump the version number in those files
      .pipe(gulp.dest('./')) // save it back to filesystem
      .pipe(git.commit('bumps package version')) // commit the changed version number
      .pipe(filter('package.json')) // read only one file to get the version number
      .pipe(tag_version()) // **tag it in the repository**
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

gulp.task('default', ['js', 'lib', 'css', 'fonts', 'songs']);
