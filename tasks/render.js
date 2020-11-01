import { src, dest, series } from "gulp";
import pug from "gulp-pug";
import gulpif from "gulp-if";
import plumber from "gulp-plumber";
import { isProduction } from "./helpers";

export const html = () => {
  return new Promise((resolve, reject) => {
    resolve(
      src("./app/**.pug", {
        allowEmpty: true,
      })
        .pipe(
          plumber(function (err) {
            console.log(err);
            this.emit("end");
          })
        )
        .pipe(gulpif(isProduction(), pug({ pretty: "\t" }), pug()))
        .pipe(dest("_dist"))
    );
  });
};

export const render = series(html);
