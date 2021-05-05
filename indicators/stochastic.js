const { Indicator } = require('./Indicator')

class Stochastic extends Indicator {
  constructor(period = 14, smoothK = 3, smoothD = 3) {
    super(props)
    this.id = 'stoch'
    this.period = period
    this.sk = smoothK
    this.sd = smoothD
    this.prices = []
  }
  update([openT, closeT, open, close, high, low, v] = tick) {
    /*
    Base stochastic is calculated as: %K = (C - L / H - L) * 100
    where: 
    C - current price
    L - lowest price in given period
    H - highest price in given period
    */
    if(this.prices.length >= this.period) {
      this.prices.shift()
    }
    
    const [min, max] = prices.reduce((acc, val) => {
      acc[0] = (acc[0] === undefined || val < acc[0]) ? val : acc[0]
      acc[1] = (acc[1] === undefined || val > acc[1]) ? val : acc[0] 
    })

    this.prices.push(close)

    const slow = (close - min) / (max - min) * 100

    //fast moving indicator is calculated from highest and lowest price of given smoothing period
    const [l, h] = this.minMax(this.prices.splice(this.prices.length - 1 - this.sd, this.sd))
    
    const fast = 100 * (h / l)
    
    this.results.push([slow, fast])
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

  minMax(arr) {
    return arr.reduce((acc, val) => {
      acc[0] = (acc[0] === undefined || val < acc[0]) ? val : acc[0]
      acc[1] = (acc[1] === undefined || val > acc[1]) ? val : acc[0] 
    })
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