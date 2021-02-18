require('dotenv').config()
const chalk = require('chalk')
const ccxt = require('ccxt')
const axios = require('axios')

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

const logToFile = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

let stonks

const cryptos = ['tether','bitcoin', 'ethereum', 'cardano', 'binancecoin', 'litecoin', 'polkadot']
const symbols = {
  tether: 'USDT',
  bitcoin: 'BTC',
  ethereum: 'ETH',
  cardano: 'ADA',
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

const calculatePrices = async (cryptos) => {
  const usdRatio = (coin) => coin.usd / cryptos.tether.usd
  const limits = {}

  Object.entries(cryptos).forEach(([key, value]) => {
    const marketValue = usdRatio(value)
    const sellLimit = marketValue * (1 + spread)
    const buyLimit = marketValue * (1 - spread)

    limits[key] = {
      marketValue: marketValue,
      sellLimit: sellLimit,
      buyLimit: buyLimit
    }
  })
  console.log(limits)
  return limits
}

const tick = async (config, binanceClient) => {
  const { asset, base, spread, allocation } = config
  const market = `${asset}/${base}`
  const orders = await binanceClient.fetchOpenOrders(market).catch(err=>console.log(err))
  
  orders.forEach(async order => {
    await binanceClient.cancelOrder(order.id,order.symbol).catch(err=>{
      console.log(chalk.red(err))
    })
  })

  const prices = fetchPrices().then(prices => calculatePrices(prices))
  
  let total
  binanceClient.fetchBalance().then(balances => {
    Object.entries(prices).forEach(([key, {marketValue, sellLimit, buyLimit}]) => {
      const symbol = symbols[key]
      const available = balances.free[symbol]
      const base = balances.free[USDT]

      const sellVolume = available * allocation
      const buyVolume = (base * allocation) / marketPrice
      await binanceClient.createLimitSellOrder(market, sellVolume, sellLimit).catch(err => console.log('SELL ORDER: ',chalk.red(err)))
      await binanceClient.createLimitBuyOrder(market, buyVolume, buyLimit).catch(err => console.log('BUY ORDER: ',chalk.red(err)))
    })
  })
  .catch(err=>console.log(err))

  const results = await Promise.all([
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
  ]).catch(err=>console.log(err))

  const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd
  const sellPrice = marketPrice * (1 + spread)
  const buyPrice = marketPrice * (1 - spread)

  const balances = await binanceClient.fetchBalance()
  const total = balances.BTC.total*marketPrice + balances.USDT.total
  stonks = stonks ? stonks : total
  const assetBalance = balances.free[asset]
  const baseBalance = balances.free[base]

  const sellVolume = assetBalance * allocation
  const buyVolume = (baseBalance * allocation) / marketPrice
  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice).catch(err => console.log('SELL ORDER: ',chalk.red(err)))
  await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice).catch(err => console.log('BUY ORDER: ',chalk.red(err)))

  const diff = total - stonks >= 0 ? chalk.green(total-stonks) : chalk.red(total-stonks)
  console.log(`
    NEW TICK FOR ${chalk.blue(market+': '+marketPrice)}
    Current ballance: ${total} => ${diff}
    Created limit sell order for ${chalk.yellow(sellVolume)} @ ${chalk.green(sellPrice)}
    Created limit buy order for ${chalk.yellow(buyVolume)} @ ${chalk.green(buyPrice)}
  `)
}

const init = () => {
  const config = {
    asset: 'BTC',
    base: 'USDT',
    allocation: 1.0,
    spread: 0.1, //smaller spread => shorter bet
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