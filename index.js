require('dotenv').config()
const chalk = require('chalk')
const ccxt = require('ccxt')
const axios = require('axios')
const { logToFile } = require('./utils/logger')
const { SocketClient } = require('./modules/socket')
const { fetchChartData } = require('./modules/chart-data')
const { rsi } = require('./indicators/rsi')
const { sma, wma, ema, ema2 } = require('./indicators/ma')
const { macd } = require('./indicators/macd')
const { stoch } = require('./indicators/stochastic')

const symbols = {
  tether: 'USDT',
  bitcoin: 'BTC',
  ethereum: 'ETH',
  //cardano: 'ADA',
  //binancecoin: 'BNB',
  //litecoin: 'LTC',
  //polkadot: 'DOT'
}
const fetchPrices = async () => {
  const cryptos = Object.keys(symbols)
  return axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd`)
    .then(res => res.data)
    .catch(err=> console.log('Failed to fetch prices: ',chalk.red(err)))
}

const cancelOpenOrders = async (client) => {
  Object.values(symbols).forEach(coin => {
    if(coin === 'USDT') return
      return client.fetchOpenOrders(coin+'/USDT').then(orders=> {
        orders.forEach(order => {
          return client.cancelOrder(order.id, order.symbol)
        })
      })
  })
}

const calculatePrices = async (cryptos) => {
  const usdRatio = (coin) => coin.usd / cryptos.tether.usd
  const limits = {}

  Object.entries(cryptos).forEach(([key, value]) => {
    const spread = 0.03
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

const processGraph = async ({symbol, interval, limit}, binanceClient) => {
  //const data = await binanceClient.fetchOHLCV(symbol, interval, limit)
  const data = await fetchChartData('btcusdt', '15m')
  console.log('RSI: ', rsi(data))
//   console.log('SMA-7: ', sma(data, 7))
//   console.log('SMA-25: ', sma(data, 25))
//   console.log('SMA-99: ', sma(data, 99))
//  // console.log('WMA-7: ', wma(data, 7))
//   //console.log('WMA-25: ', wma(data, 25))
//   //console.log('WMA-99: ', wma(data, 99))
  //console.log('EMA-7: ', ema(data.slice(data.length - 7), 7))
  // console.log('EMA-25: ', ema(data, 25))
  // console.log('EMA-99: ', ema(data, 99))
  //console.log('EMA-7: ', ema2(data, 7))
  // console.log('EMA-25: ', ema2(data, 25))
  //console.log('EMA-99: ', ema2(data, 99))
  console.log('MACD: ', macd(data, 5, 21, 8))
  console.log('stochastic: ', stoch(data))
  
}

const tick = async (config, binanceClient) => {
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
    allocation: 0.2,
    spread: 0.01,
    tickInterval: 3000
  }

  const binanceClient = new ccxt.binance({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET
  })

  //tick(config, binanceClient)
  //setInterval(tick, config.tickInterval, config, binanceClient)

  //const socketClient = new SocketClient('ws/btcusdt@kline_15m')
  const kline = {
    symbol: 'BTC/USDT',
    interval: '15m'
  }
  processGraph(kline, binanceClient)
  //fetchChartData('btcusdt', '1h', 1614639600000, 1614726000000 ).then(res => logToFile(JSON.stringify(res)))
  // console.log('binance')
  //binanceClient.fetchOHLCV('BTC/USDT', '15m').then(res => logToFile(res))
}

init()