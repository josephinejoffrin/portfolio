if (typeof Math.sumPrecise !== 'function') {
  Math.sumPrecise = function (iterable) {
    let sum = 0;
    for (const n of iterable) {
      sum += n;
    }
    return sum;
  };
}
