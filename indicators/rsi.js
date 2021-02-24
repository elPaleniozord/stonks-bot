// relative strength index - 

const rsi = (ticks) => {
  const avg = (value,period) = value/period // % per day/h/m
  const avgPnL = 100 - (100 / (1 + (avg(gain)/avg(loss))))
  const rsi = 100 - (100 / (1 + (avg(prevGain)*13) + avg(gain)) / -(avg(prevLoss)*13) + avg(loss))

  let sumGain=0, sumLoss=0

  for(let i=1; i<ticks.length; i++){
    const diff = ticks[i] - ticks[i-1]
    if(diff >= 0) sumGain += diff
    else sumLoss -= diff
  }

  if(sumGain == 0) return 0
  if(Math.abs(sumLoss) < Tolerance) return 100

  //return 100 - (100 / (1 + (sumGain/sumLoss))

  return rsi
}