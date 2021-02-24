const obv = (ticks) => {
  let last=[ticks[0]], obvs=[]
  for(let i=1; i<ticks.length; i++) {
    let value = 0, 

    if(ticks[i] >= ticks[i-1]) value = obvs[i-1] + ticks[i]
    else value = obvs[i-1] - ticks[i]

    obvs.push(value)
  }

  return obvs
}