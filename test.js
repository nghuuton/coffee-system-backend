const arr = [1, 1, 1, 2, 3, 4, 5, 7];

// console.log([...new Set(arr)]);

const str = "aaABbbbbcCdD";

const counterStore = (str) => {
  const newStore = [...new Set(str)];
  newStore.forEach((item) => {
    let myPattern = new RegExp(`${item}`, "g");
    console.log(`${item} - ${str.match(myPattern).length}`);
    console.log();
  });
};

counterStore(str);
