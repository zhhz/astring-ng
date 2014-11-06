var fs = require('fs'),
  gulp = require('gulp'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  livereload = require('gulp-livereload'),
  filter = require('gulp-filter'),
  git = require('gulp-git'),
  ga = require('gulp-ga'),
  gsub = require('gulp-gsub'),
  bowerFiles = require('main-bower-files'),
  cChangelog = require('conventional-changelog'),
  marked = require('gulp-marked'),
  semver = require('semver'),

  bump = require('gulp-bump'),
  tagVersion = require('gulp-tag-version');

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

  // gulp.watch('test/**/*.js').on('change', livereload.changed);
});

gulp.task('clean', function (done) {
  del([
    'dist/public/**',
    'dist/server/**',
    'dist/package.json',
    'dist/Procfile'
  ], done);
});

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch   # makes v0.1.0 → v0.1.1
 *     gulp minor   # makes v0.1.1 → v0.2.0
 *     gulp major   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance){
  var version = require('./package.json').version;
  version = semver.inc(version, importance);

  gulp.src(['./package.json'])
      .pipe(bump({type: importance})) // bump the version number in those files
      .pipe(gulp.dest('./')); // save it back to filesystem

  cChangelog({
    version: version
  }, function(err, log){
    fs.writeFile('CHANGELOG.md', log, function(err){
      if(err){ console.log(err); return; }
      else{
        var tag = 'v' + version;
        gulp.src(['./package.json', './CHANGELOG.md'])
          .pipe(git.commit('release: bump version ' + tag));
        gulp.src(['./package.json'])
          .pipe(tagVersion()); // **tag it in the repository**
      }
    })
  });
};

gulp.task('patch', function() { return inc('patch'); });
gulp.task('minor', function() { return inc('minor'); });
gulp.task('major', function() { return inc('major'); });

gulp.task('release', ['clean', 'css', 'fonts', 'songs'], function(){
  var version = require('./package.json').version;

  // compile app js
  gulp.src(['app/public/js/app.js', 'app/public/js/**/*.js', '!app/public/js/**/*.min.js'])
    .pipe(concat('app.min.' + version + '.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist/public/js'));

  // compile bower components - js
  var jsFilter = filter('*.js');
  gulp.src(vendorFiles)
    .pipe(jsFilter)
      .pipe(concat('lib.min.' + version + '.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/public/js'))
    .pipe(jsFilter.restore());

  // all the other public files/folders
  gulp.src(['app/public/**', '!app/public/js/**', '!app/public/index.html'])
    .pipe(gulp.dest('dist/public/'));

  // server files
  gulp.src(['app/server/**', '!app/server/data/songs/**'])
    .pipe(gulp.dest('dist/server'))

  // misc
  gulp.src(['LICENSE-MIT', 'Procfile', 'package.json', 'CHANGELOG.md'])
    .pipe(gulp.dest('dist/'))

  // add google analytics, gsub with the compiled js
  gulp.src(['app/public/index.html'])
    .pipe(ga({url: 'a-string.us', uid: 'UA-44119310-1'}))
    .pipe(gsub({source: 'min.js', target:  'min.' + version + '.js'}))
    .pipe(gsub({source: 'version', target: '' + version}))
    .pipe(gulp.dest('dist/public/'));

  // md2html
  gulp.src('./CHANGELOG.md')
    .pipe(marked())
    .pipe(gulp.dest('./dist/public'));

});

gulp.task('default', ['js', 'lib', 'css', 'fonts', 'songs']);
