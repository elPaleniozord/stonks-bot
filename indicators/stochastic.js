const { Indicator } = require('./Indicators')

export class Stochastic extends Indicator {
  constructor(period, smoothK, smoothD) {
    super(props)
    this.id = 'stoch'
    this.period = period
    this.sk = smoothK
    this.sd = smoothD
  }
  update(tick) {
    const [openTime, closeTime, open, high, low, close, vol, q] = tick
    const spread = (c-l) / (h-l)
    
  }

  signal(){
    const territory = this.sk > .8 ? 'overbought' : this.sk < .2 ? 'oversold' : 'neutral'
    const sentiment = k < d ? 'bearish' : 'bullish'

    console.log(`${sentiment} divergence detected - ${this.sk * 100} ${territory}`)
    return {
      territory: territory,
      sentiment: sentiment,
      strength: Math.abs(.5 - this.sk)
    }
  }
}

const { SMA } = require("./ma")

const STOCH = (data, period = 14, sd = 3, sk = 3) => {
  const spread = data.map(d => (d.c - d.l)/(d.h - d.l))
  const fastK = SMA(spread, period)
  const slowK = SMA(fastK, sk)
  const slowD = SMA(slowK, sd)

  return slowD.map((d,i) => [fastK[i-(sk-1)], slowK[i-(sd-1)], d])
}

exports.STOCH = STOCH