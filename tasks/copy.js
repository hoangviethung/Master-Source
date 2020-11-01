import { src, dest } from "gulp";
import { VENDORS } from "../vendors";

export const copyFavicon = () => {
  return src("public/favicon.ico").pipe(dest("_dist"));
};

export const copyImages = () => {
  return src("public/images/**.{jpg,png,svg,gif,jpeg,webp,ico}").pipe(
    dest("_dist")
  );
};

export const copyFonts = (cb) => {
  if (VENDORS.fonts.length > 0) {
    return src(VENDORS.fonts, {
      allowEmpty: true,
    }).pipe(dest("_dist/fonts"));
  }
  console.log("Không có đường dẫn fonts để copy");
  return cb();
};

export const copyPublic = () => {
  return src("public/**", {
    allowEmpty: true,
  }).pipe(dest("_dist"));
};
