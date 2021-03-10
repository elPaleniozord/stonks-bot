const avgOHLC = ({c,o,h,l}) => (c+o+h+l)/4
const avgHLC = ({c,h,l}) => (c+h+l)/3

const rsi = (data, period = 14) => {
  const rsi = []
  let sumGain=0, sumLoss=0
  for(let i=1; i<data.length; i++){
    const diff = avgHLC(data[i]) - avgHLC(data[i-1])
    if(diff >= 0) sumGain += diff
    else sumLoss -= diff
  }

  if(sumGain == 0) return 0
  //if(Math.abs(sumLoss) < Tolerance) return 100

  return 100 - (100 / (1 + (sumGain/sumLoss)))
}

exports.rsi = rsi