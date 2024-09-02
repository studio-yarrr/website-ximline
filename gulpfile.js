"use strict";

const { src, dest, watch, series, parallel } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rigger = require("gulp-rigger");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();

/* Paths */
const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    php: distPath, // Добавлено
    js: distPath + "assets/js/",
    css: distPath + "assets/css/",
    images: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/",
    videos: distPath + "assets/videos/",
  },
  src: {
    html: srcPath + "*.html",
    php: srcPath + "*.php", // Добавлено
    js: srcPath + "assets/js/*.js",
    css: srcPath + "assets/scss/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    videos: srcPath + "assets/videos/**/*.{mp4,webm}",
  },
  watch: {
    html: srcPath + "**/*.html",
    php: srcPath + "**/*.php", // Добавлено
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/scss/**/*.scss",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,glb,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    videos: srcPath + "assets/videos/**/*.{mp4,webm}",
  },
  clean: "./" + distPath,
};

/* Tasks */

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
}

function html(cb) {
  panini.refresh();
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      panini({
        root: srcPath,
        layouts: srcPath + "layouts/",
        partials: srcPath + "partials/",
        helpers: srcPath + "helpers/",
        data: srcPath + "data/",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function php(cb) {
  return src(path.src.php, { base: srcPath }) // Используем исходный путь для PHP файлов
    .pipe(dest(path.build.php)) // Копируем файлы в папку dist
    .pipe(browserSync.reload({ stream: true }));
}

function css(cb) {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js(cb) {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images(cb) {
  return src(path.src.images)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 95, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function videos(cb) {
  return src(path.src.videos)
    .pipe(dest(path.build.videos))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts(cb) {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({ stream: true }));
}

function clean(cb) {
  return del(path.clean);
}

function watchFiles() {
  watch([path.watch.html], html);
  watch([path.watch.php], php); // Добавлено
  watch([path.watch.css], css);
  watch([path.watch.js], js);
  watch([path.watch.images], images);
  watch([path.watch.videos], videos);
  watch([path.watch.fonts], fonts);
}

function imagesWithoutMin() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

const build = series(
  clean,
  parallel(html, php, css, js, images, videos, fonts) // Добавлено php
);
const dev = parallel(build, watchFiles, serve);
const buildNMin = gulp.series(clean, html, css, js, imagesWithoutMin, fonts);

/* Exports Tasks */
exports.html = html;
exports.php = php; // Добавлено
exports.css = css;
exports.js = js;
exports.images = images;
exports.videos = videos;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = dev;
exports.buildNMin = buildNMin;