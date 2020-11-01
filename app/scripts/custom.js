const test = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Cac sau 2s");
    }, 2000);
  });
};

setTimeout(() => {
  console.log("Run sau 2s");
  test().then((a) => {
    console.log(a);
  });
}, 2000);
