require('dotenv').config()
const chalk = require('chalk')
const ccxt = require('ccxt')
const axios = require('axios')
const { logToFile } = require('./utils/logger')

const symbols = {
  tether: 'USDT',
  bitcoin: 'BTC',
  ethereum: 'ETH',
  //cardano: 'ADA',
  binancecoin: 'BNB',
  litecoin: 'LTC',
  polkadot: 'DOT'
}
const fetchPrices = async () => {
  const cryptos = Object.keys(symbols)
  return axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd`)
    .then(res => res.data)
    .catch(err=> console.log('Failed to fetch prices: ',chalk.red(err)))
}

const cancelOpenOrders = async (client) => {
  Promise.all([Object.values(symbols).forEach(coin => {
    if(coin === 'USDT') return
    const market = coin+'/USDT'
    return client.fetchOpenOrders(market)
      .then(orders => orders.forEach(order => client.cancelOrder(order.id,order.symbol)))
  })]).catch(err => console.log('FAILED TO CANCEL ORDER'))
}

const calculatePrices = async (cryptos) => {
  const usdRatio = (coin) => coin.usd / cryptos.tether.usd
  const limits = {}

  Object.entries(cryptos).forEach(([key, value]) => {
    const spread = 0.1
    const marketValue = usdRatio(value)
    const sellLimit = marketValue * (1 + spread)
    const buyLimit = marketValue * (1 - spread)

    limits[key] = {
      marketValue: marketValue,
      sellLimit: sellLimit,
      buyLimit: buyLimit
    }
  })
  return limits
}

const tick = async (config, binanceClient) => {
 logToFile( await binanceClient.fetchMarkets())
  const { asset, base, spread, allocation } = config
  const prices = await fetchPrices().then(prices => calculatePrices(prices))
  const market = `${asset}/${base}`

  cancelOpenOrders(binanceClient)

  //PROCESS ORDERS
  await binanceClient.fetchBalance().then(balances => {
    Object.entries(prices).forEach(([key, {marketValue, sellLimit, buyLimit}]) => {
      const symbol = symbols[key]
      const available = balances.free[symbol]
      const base = balances.free['USDT']
      if(available === base || available === 0) return
      
      const market = `${symbol}/USDT`
      const sellVolume = available * allocation
      const buyVolume = (base * allocation) / marketValue

      //low value portfolios will get a lot of errors related to bincance rejecting orders below certain value catch null in catch block suppresses errors
      const sell = binanceClient.createLimitSellOrder(market, sellVolume, sellLimit)
        .then(()=>console.log(`Created limit sell order for ${chalk.blue(symbol)} => ${chalk.cyan(buyVolume)}@${chalk.green(buyLimit)}`))
        // .catch((err)=>console.log(`Failed to create sell order for ${chalk(symbol)} => ${chalk.red(err)}`))
        .catch((err)=> null)
      const buy = binanceClient.createLimitBuyOrder(market, buyVolume, buyLimit)
        .then(()=>console.log(`Created limit buy order for ${chalk.blue(symbol)} => ${chalk.cyan(buyVolume)}@${chalk.green(buyLimit)}`))
        // .catch((err)=>console.log(`Failed to create buy order for ${chalk(symbol)} => ${chalk.red(err)}`))
        .catch((err)=> null)
      return Promise.all([sell,buy])
    })
  })
  .catch(err=>console.log(err))
}

const init = () => {
  const config = {
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.5,
    spread: 0.2, //smaller spread => shorter bet
    tickInterval: 3000
  }

  const binanceClient = new ccxt.binance({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET
  })

  tick(config, binanceClient)
  setInterval(tick, config.tickInterval, config, binanceClient)
}

init()