const { task, src, dest, watch, series } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const sass = require("gulp-sass")(require('node-sass'));
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream')

function javascript(cb) {
  return src("app/**/*.js")
      .pipe(concat('all.css'))
      .pipe(babel())
      .pipe(dest("dist/js/"))
      .pipe(uglify())
      .pipe(rename({ extname: ".min.js" }))
      .pipe(dest("dist/js"));
}

function css(cb) {
  return src("app/**/*.scss")
      .pipe(sass())
      .pipe(src("app/**/*.css"))
      .pipe(concat('all.css'))
      .pipe(dest("dist/css/"))
      .pipe(sourcemaps.init())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(rename({ extname: ".min.css" }))
      .pipe(dest("dist/css"));;
}

function sprite() {
  var spriteData = src('app/images/*.jpg').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));

  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(dest('dist/css/'));

  var cssStream = spriteData.css
    .pipe(dest('app/css/'));

  return merge(imgStream, cssStream);
};

exports.default = function() {
  watch(['app/**/*.scss', 'app/**/*.css'], css);
  watch('app/**/*.js', javascript);
  watch('app/**/*.jpg', series(sprite, css));
};