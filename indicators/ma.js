const simpleMA = (data, period=7, previous) => {
  const n = data.slice(data.length - period)
  let sma = 0
  for(let i=0; i<n.length; i++) {
    sma += n[i].c
  }
  return sma/period
}


const weightedMA = (data, period) => {
  const n = data.slice(data.length - period).reverse() //reversed due to recent prices having higher weigth
  let wma = 0
  for(let i=0; i<n.length; i++) {
    wma += n[i].c * (period-i)
  }
  return wma / ((period * (period+1)) / 2)
}

const expMA = (data, period) => {
  const n = data.slice(data.length - period).reverse() //reversed due to recent prices having higher weigth
  const exp = 2/(period+1)
  let ema = n[0].c
  
  for(let i=1; i<n.length; i++) {
    ema = ema * exp + n[i].c * (1 - exp)
  }
  return ema
}

exports.sma = simpleMA
exports.wma = weightedMA
exports.ema = expMA