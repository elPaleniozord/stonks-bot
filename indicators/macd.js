const ema = (last, closePrice, units) => last * (units-1) + (closePrice*2) / (units+1) 
const dea = (last, curr) => (last*8 + curr*2) / 10

const MACD = (ticks, {fast=5, slow=21, l=5}) => {
  const emaFast=[ticks[0]], emaSlow=[ticks[0]], diffs=[], deas=[0], bars=[]

  for(let i=1; i<ticks.length; i++) {
    emaFast.push(ema(emaFast[i-1], ticks[i], fast))
    emaSlow.push(ema(emaSlow[i-1], ticks[i], slow))
    diffs.push(emaFast[i], emaSlow[i])
    deas.push(dea(deas[i-1], diffs[i]))
    bars.push((diffs[i]-deas[i]) * 2)
  }
  return {
    diffs: diffs,
    deas: deas,
    bars: bars
  }
}