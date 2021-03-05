const { ema,ema2 } = require('./ma')

//const ema = (last, closePrice, units) => last * (units-1) + (closePrice*2) / (units+1) 
const dea = (last, curr) => (last*8 + curr*2) / 10

const MACD = (ticks, {fast=5, slow=21, l=8}) => {
  const emaFast = ema(ticks, fast)
  const emaSlow = ema(ticks, slow)
  const macd = emaFast - emaSlow
  const signal = ema(macd, l)
  return [macd, emaFast-emaSlow, signal]
}

exports.macd = MACD