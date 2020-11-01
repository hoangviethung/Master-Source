import { watch, series, parallel, src, dest } from "gulp";
import bSync from "browser-sync";
import del from "del";
import pug from "gulp-pug";
import babel from "gulp-babel";
import plumber from "gulp-plumber";
import uglify from "gulp-uglify-es";
import rename from "gulp-rename";
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import { copyFonts } from "./copy";
import { html } from "../tasks/render";
import { cssTask } from "../tasks/main";
import { jsCore, cssCore } from "../tasks/core";
import { isProduction } from "./helpers";

const imageChangeTask = (path, stats) => {
  const filePathnameGlob = path.replace(/[\/\\]/g, "/");
  const destPathname = filePathnameGlob
    .replace("public", "_dist")
    .replace(
      filePathnameGlob.split("/")[filePathnameGlob.split("/").length - 1],
      ""
    );
  console.log(`Copy: "${filePathnameGlob}"   =====>   "${destPathname}"`);
  return src(filePathnameGlob).pipe(dest(destPathname));
};

const imageRemoveTask = (path, stats) => {
  console.log(path);
  const filePathnameGlob = path.replace(/[\/\\]/g, "/");
  const destPathname = filePathnameGlob.replace("public", "_dist");
  console.log(`Deleted: "${destPathname}"`);
  return del(destPathname);
};

const renderHTML = (glob) => {
  console.log(`Rendering: ${glob}`);
  return src(glob)
    .pipe(
      plumber(function (err) {
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(
      pug({
        pretty: "\t",
      })
    )
    .pipe(dest("_dist"));
};

const jsBabel = (filePathnameGlob) => {
  console.log(`Transpile file ${filePathnameGlob}`);
  return src(filePathnameGlob)
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
};

export const serve = () => {
  bSync.init({
    notify: true,
    server: {
      baseDir: "_dist",
    },
    port: 8000,
  });
  watch("app/views/_layouts/**/**.pug", series(html));

  watch("app/*.pug").on("change", (path, stats) => {
    console.log(`Files changed: ${path}`);
    let pageName;
    let glob;
    if (path.indexOf("/") >= 0) {
      pageName = path.split("/")[1];
    } else {
      pageName = path.split("\\")[1];
    }
    if (pageName.indexOf(".pug") >= 0) {
      glob = `app/${pageName}`;
    } else {
      glob = `app/${pageName}.pug`;
    }
    return renderHTML(glob);
  });

  watch(["app/views/**/**.pug", "!app/views/_layouts/**.pug"]).on(
    "change",
    (path, stats) => {
      console.log(`Files changed: ${path}`);
      let pageName;
      let glob;
      if (path.indexOf("/") >= 0) {
        pageName = path.split("/")[2];
      } else {
        pageName = path.split("\\")[2];
      }
      if (pageName.indexOf(".pug") >= 0) {
        glob = `app/${pageName}`;
      } else {
        glob = `app/${pageName}.pug`;
      }
      return renderHTML(glob);
    }
  );

  watch(["public/**/**.**"], {
    ignorePermissionErrors: true,
    delay: 300,
    events: "all",
  })
    .on("add", imageChangeTask)
    .on("change", imageChangeTask)
    .on("addDir", imageChangeTask)
    .on("unlink", imageRemoveTask)
    .on("unlinkDir", imageRemoveTask);

  watch(["app/scripts/**.js"]).on("change", (path, stats) => {
    const filePathnameGlob = path.replace(/[\/\\]/g, "/");
    return jsBabel(filePathnameGlob);
  });

  watch(
    ["app/styles/**/**.scss"],
    {
      delay: 500,
    },
    series(cssTask)
  );

  watch(
    ["vendors.js", "vendors/**/**.**"],
    parallel(jsCore, cssCore, copyFonts)
  );

  watch(["_dist/**.html", "_dist/css/**/**.css", "_dist/js/**/**.js"]).on(
    "change",
    bSync.reload
  );
};
