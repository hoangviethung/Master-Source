import { VENDORS } from "../vendors";
import { isProduction } from "./helpers";
import { src, dest, series } from "gulp";
import concat from "gulp-concat";
import cleanCss from "gulp-clean-css";
import gulpif from "gulp-if";
import uglify from "gulp-uglify";
import strip from "gulp-strip-comments";
import gulpIf from "gulp-if";

export const cssCore = (cb) => {
  if (VENDORS.css.length > 0) {
    return new Promise((resolve, reject) => {
      resolve(
        src(VENDORS.css, {
          allowEmpty: true,
        })
          .pipe(concat("core.min.css"))
          .pipe(
            cleanCss({
              level: {
                1: {
                  all: true,
                  normalizeUrls: false,
                  specialComments: false,
                },
              },
            })
          )
          .pipe(dest("./_dist/css"))
      );
    });
  }
  console.log("Không có đường dẫn thư viện css để copy");
  return cb();
};

export const jsCore = () => {
  if (VENDORS.js.length > 0) {
    return new Promise((resolve, reject) => {
      resolve(
        src(VENDORS.js, {
          allowEmpty: true,
        })
          .pipe(concat("core.min.js"))
          .pipe(strip())
          .pipe(gulpIf(isProduction(), uglify()))
          .pipe(dest("./_dist/js"))
      );
    });
  }
  console.log("Không có đường dẫn thư viện js để copy");
  return cb();
};

export const core = series(cssCore, jsCore);
