import { isProduction } from "./helpers";
import { src, dest, series } from "gulp";
import sass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import Fiber from "fibers";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import gulpif from "gulp-if";
import plumber from "gulp-plumber";
import babel from "gulp-babel";
import tsify from "tsify";
import uglify from "gulp-uglify";
import browserify from "browserify";
import buffer from "vinyl-buffer";
import source from "vinyl-source-stream";
import Watchify from "watchify";
import fancy_log from "fancy-log";

export const cssTask = () => {
  return new Promise((resolve, reject) => {
    resolve(
      src(["./app/styles/**.scss", "!app/styles/_*.scss"])
        .pipe(gulpif(!isProduction(), sourcemaps.init()))
        .pipe(
          sass({
            fiber: Fiber,
          }).on("error", sass.logError)
        )
        .pipe(
          gulpif(
            isProduction(),
            cleanCss({
              level: {
                1: {
                  all: true,
                  normalizeUrls: false,
                  specialComments: false,
                },
                2: {
                  restructureRules: true,
                },
              },
            })
          )
        )
        .pipe(
          gulpif(
            isProduction(),
            postcss([
              autoprefixer({
                cascade: false,
              }),
              cssnano(),
            ]),
            postcss([
              autoprefixer({
                cascade: false,
              }),
            ])
          )
        )
        .pipe(
          rename({
            suffix: ".min",
          })
        )
        .pipe(gulpif(!isProduction(), sourcemaps.write(".")))
        .pipe(dest("./_dist/css"))
    );
  });
};

export const tsCompile = Watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["./app/scripts/main.ts"],
    cache: {},
    packageCache: {},
  })
    .plugin(tsify, { target: "es5" })
    .transform("babelify", {
      presets: ["@babel/preset-env"],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-classes",
        "@babel/plugin-transform-async-to-generator",
      ],
      extensions: [".ts"],
    })
);

export const tsBundle = () => {
  return tsCompile
    .bundle()
    .on("error", fancy_log)
    .pipe(source("main.min.js"))
    .pipe(buffer())
    .pipe(gulpif(!isProduction(), sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulpif(!isProduction(), sourcemaps.write("./")))
    .pipe(dest("./_dist/js"));
};

tsCompile.on("update", tsBundle);
tsCompile.on("log", fancy_log);

export const JsBabel = () => {
  return new Promise((resolve, reject) => {
    src(["./app/scripts/**.js"])
      .pipe(
        plumber(function (err) {
          console.log(err);
          this.emit("end");
        })
      )

      .pipe(gulpif(!isProduction(), sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProduction(), babel()))
      .pipe(gulpif(isProduction(), uglify()))
      .pipe(
        rename({
          suffix: ".min",
        })
      )
      .pipe(gulpif(!isProduction(), sourcemaps.write("./")))
      .pipe(dest("./_dist/js"));
    resolve();
  });
};
export const main = series(cssTask, tsBundle, JsBabel);
