const avgOHLC = ({c,o,h,l}) => (c+o+h+l)/4
const avgHLC = ({c,h,l}) => (c+h+l)/3

const rsi = (ticks, period = 14) => {
  const candles = ticks.slice(ticks.length - period)

  let sumGain=0, sumLoss=0
  for(let i=1; i<candles.length; i++){
    const diff = avgHLC(candles[i]) - avgHLC(candles[i-1])
    if(diff >= 0) sumGain += diff
    else sumLoss -= diff
  }

  if(sumGain == 0) return 0
  //if(Math.abs(sumLoss) < Tolerance) return 100

  return 100 - (100 / (1 + (sumGain/sumLoss)))
}

exports.rsi = rsi