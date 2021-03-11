const { Indicator } = require('./Indicators')
const { EMA } = require('./ma')

const MACD = (ticks, fast=5, slow=21, l=8) => {
  let macd = []
  const emaFast = EMA(ticks, fast)
  const emaSlow = EMA(ticks, slow)
  for(let i=0; i<emaSlow.length; i++) {
    if(emaFast && emaSlow) {
      macd.push(emaFast[i] - emaSlow[i])
    }    
  }
  
  const signal = EMA(macd.map(v => ({c: v})), l)  //set universal format for each price/indicator
  const histogram = macd.splice(0, signal.length).map((v,i) => v - signal[i])
  return {
    macd,
    signal,
    histogram
  }
}

exports.MACD = MACD