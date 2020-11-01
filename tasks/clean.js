import del from "del";

export const clean = (folder) => {
  return new Promise((resolve, reject) => {
    resolve(del(folder));
  });
};
