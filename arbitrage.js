// TODO:
// -cross platform arbitrage

// -single platform currency arbitrage

const arbitrage = () => {
  const fee = 0.999

  const prices = {
    'BTC/USDT': 51714.61,
    'BTC/ETH': undefined,
    'ETH/USDT': 1930.48,
    'ETH/BTC': 0.036622,
    'USDT/BTC': undefined,
    'USDT/ETC': undefined
  }
  
  prices['BTC/ETH'] = 1/prices['ETH/BTC']
  prices['USDT/BTC'] = 1/prices['BTC/USDT']
  prices['USDT/ETH'] = 1/prices['ETH/USDT']

  const assets = {
    BTC: 1,
    ETH: 0.9,
    USDT: 1000
  }

  const transactionCost = (base, target, inter) => {
    const toTarget = (assets[base] * prices[`${base}/${target}`]) * fee
    const toInter = (toTarget * prices[`${target}/${inter}`]) * fee
    const toBase = (toInter * prices[`${inter}/${base}`]) * fee

    const cost = 100 - (toBase*100)/assets[base]
    return [`${base}/${target}`, -cost]
  }

  const opportunities = [
    transactionCost('BTC', 'USDT', 'ETH'),
    transactionCost('BTC', 'ETH', 'USDT'),
    transactionCost('ETH', 'BTC', 'USDT'),
    transactionCost('ETH', 'USDT', 'BTC'),
    transactionCost('USDT', 'ETH', 'BTC'),
    transactionCost('USDT', 'BTC', 'ETH'),
  ].sort()

  console.log(opportunities)
  const result = transactionCost('BTC','USDT','ETH')
  return result
}

arbitrage()

//PRICES
// 'BTC/USDT': 51714.61,
// 'ETH/USDT': 1930.48,
// 'ETH/BTC': 0.036622 

// 1BTC toUSD should return -2.1892767673744515%
// 1BTC toETH should return 

const runTests = () => {

}