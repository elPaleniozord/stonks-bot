const { SMA } = require('./ma')

//indicates strength of trend and potential reversal
const BOLL = (data, period = 21, deviation = 2) => {
  let boll = [], dev = []
  const sma = SMA(data, period)
  for(let i=0; i<data.length; i++) {
    dev.push(std(data, period))
  }
  sma.forEach((d, i) => {
    boll.push([d + dev[i] * deviation, d, d - dev[i] * deviation])
  })
  return boll
}

function std(data) {
  let mean = 0
  data.forEach(d => mean += d)
  mean /= data.length
  let std = 0 
  data.forEach(d => std += (d - mean ) ** 2)
  return Math.sqrt(std/data.length);
}

exports.BOLL = BOLL