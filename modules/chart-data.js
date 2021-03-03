// https://api.binance.com
// GET /api/v3/klines
// symbol
// interval
// startTime
// endTime
// limit

//Data format = [openTimestamp, open, high, low, close, volume, closeTimestamp, quote, numberOfTrades, takerBuyBaseAssetVol, takerBuyQuoteAssetVol, ignore]

const { default: axios } = require("axios")
const { logToFile } = require('../utils/logger')

const fetchChartData = async (symbol, interval, start = Date.now() - (24*60*60*1000)  ,end = Date.now(), limit) => {
  const baseUrl = 'https://api.binance.com/api/v3/klines'
  
  return axios.get(`${baseUrl}?symbol=${symbol.toUpperCase()}&interval=${interval}&startTime=${start}&endTime=${end}${limit ? `&limit=${limit}` : ''}`)
  .then(res => res.data)
  .catch(err => {
    console.log(err)
  })
}

exports.fetchChartData = fetchChartData