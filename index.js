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

const tick = async (config, binanceClient) => {
  const { asset, base, spread, allocation } = config
  const market = `${asset}/${base}`
  const orders = await binanceClient.fetchOpenOrders(market).catch(err=>console.log(err))
  
  orders.forEach(async order => {
    await binanceClient.cancelOrder(order.id,order.symbol).catch(err=>{
      console.log(chalk.red(err))
    })
  })

  const results = await Promise.all([
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
  ]).catch(err=>console.log(err))

  const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd

  const sellPrice = marketPrice * (1 + spread)
  const buyPrice = marketPrice * (1 - spread)

  const balances = await binanceClient.fetchBalance()
  const assetBalance = balances.free[asset]
  const baseBalance = balances.free[base]

  const sellVolume = assetBalance * allocation
  const buyVolume = (baseBalance * allocation) / marketPrice
  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice).catch(err => console.log('SELL ORDER: ',chalk.red(err)))
  await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice).catch(err => console.log('BUY ORDER: ',chalk.red(err)))
  
  console.log(`
    NEW TICK FOR ${chalk.blue(market)}
    Created limit sell order for ${chalk.yellow(sellVolume)} @ ${chalk.green(sellPrice)}
    Created limit buy order for ${chalk.yellow(buyVolume)} @ ${chalk.green(buyPrice)}
  `)

  // Promise.all([
  //   binanceClient.createLimitSellOrder(market, sellVolume, sellPrice),
  //   binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice)
  // ])
  // .then(res => {
  //   console.log(`
  //   NEW TICK FOR ${chalk.market}
  //   Created limit sell order for ${chalk.yellow(sellVolume)} @ ${chalk.green(sellPrice)}
  //   Created limit buy order for ${chalk.yellow(buyVolume)} @ ${chalk.green(buyPrice)}
  // `)
  // })
  // .catch(err=> console.log(chalk.red(err)))  
}

const init = () => {
  const config = {
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.2,
    spread: 0.005,
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