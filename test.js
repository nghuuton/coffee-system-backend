const findMax = (a, b) => {
  if (a === 0 || b === 0) return a + b;
  while (a !== b) {
    if (a < b) {
      b = b - a;
    } else {
      a = a - b;
    }
  }
  return a;
};

console.log(findMax(15, 27));
