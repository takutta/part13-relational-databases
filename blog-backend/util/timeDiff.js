function checkTimeDiff(t1, t2, diffSeconds) {
  return Math.abs(t2 - t1) / 1000 >= diffSeconds;
}
module.exports = checkTimeDiff;