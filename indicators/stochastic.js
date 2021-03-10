const { sma } = require("./ma")

const stoch = (data, period = 14, sd = 3, sk = 3) => {
  let stoch = [], high = [], low = [], ka = []
  for(let i=0; i<data.length; i++) {
    high.push(data[i].h)
    low.push(data[i].low)
    if(high.length >= period){
      const max = Math.max.apply(null, high)
      const min = Math.min.apply(null, low)
      const k = 100 * (data[i].c - min) / (max - min)
      ka.push(k)
    }
    if(sk > 0 && ka.length > sk) {
      let d = sma(ka, 3)
      stoch.push(k,d)

    }
    return stoch
  }
}

exports.stoch = stoch