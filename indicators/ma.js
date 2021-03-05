const SMA = (data, period=7, previous) => {
  const n = data.slice(data.length - period)
  let sma = 0
  for(let i=0; i<n.length; i++) {
    sma += n[i].c
  }
  return sma/period
}


const WMA = (data, period) => {
  const n = data.slice(data.length - period)
  let wma = 0
  for(let i=0; i<n.length; i++) {
    wma += n[i].c * (period-i)
  }
  return wma / ((period * (period+1)) / 2)
}

const EMA = (data, period = 12) => {
  var pl = [], ema = [], prevema = 0,
  weight = 2 / (period + 1);
  for(var i = 0; i < data.length; i++) {
    pl.push(data[i].c);
    var average = 0;
    if(prevema == 0 && pl.length >= period) {
      for(q in pl) average += pl[q];
      average /= period;
      ema.push(average);
      prevema = average;
    } else if(prevema != 0 && pl.length >= period) {
      average = (data[i].c - prevema) * weight + prevema;
      ema.push(average);
      prevema = average;
    }
  }
  return ema[ema.length-2];
}

function ema2(data, period, weight) {
  const k = weight ? weight : 2/(period+1)

  return period>1 ? (data[data.length - period].c * k) + (ema2(data, period-1, k) * (1-k)) : data[data.length - period].c
}

exports.sma = SMA
exports.wma = WMA
exports.ema = EMA
exports.ema2 = ema2