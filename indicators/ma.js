const SMA = (data, period=7) => {
  let sma = [], sum = 0
  for(let i=0; i<data.length; i++) {
    sum += data[i]
    if(i >= period-1) {
      sma.push(sum/period)
      sum -= data[i-(period-1)]
    }
  }
  return sma
}

const WMA = (data, period = 14) => {
  let wma = [], weight = (period*(period+1))/2, movingWindow = []
  for(let i=0; i<data.length; i++) {
    movingWindow.push(data[i])
    if(i >= period - 1) {
      let avg = 0
      movingWindow.forEach((price, i) => {
        avg += price * (i+1) / weight
      })
      wma.push(avg)
      movingWindow.splice(0, 1)
    }
  }
  return wma
}

const EMA = (data, period = 12) => {
  var pl = [], ema = [], prevema = 0,
  weight = 2 / (period + 1);
  for(var i = 0; i < data.length; i++) {
    pl.push(data[i]);
    var average = 0;
    if(prevema == 0 && pl.length >= period) {
      for(q in pl) average += pl[q];
      average /= period;
      ema.push(average);
      prevema = average;
    } else if(prevema != 0 && pl.length >= period) {
      average = (data[i] - prevema) * weight + prevema;
      ema.push(average);
      prevema = average;
    }
  }
  return ema;
}

exports.SMA = SMA
exports.WMA = WMA
exports.EMA = EMA