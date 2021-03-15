const { SMA } = require("./ma")

const STOCH = (data, period = 14, sd = 3, sk = 3) => {
  const spread = data.map(d => (d.c - d.l)/(d.h - d.l))
  const fastK = SMA(spread, period)
  const slowK = SMA(fastK, sk)
  const slowD = SMA(slowK, sd)

  return slowD.map((d,i) => [fastK[i-(sk-1)], slowK[i-(sd-1)], d])
}

exports.STOCH = STOCH