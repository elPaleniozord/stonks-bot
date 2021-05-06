// https://api.binance.com
// GET /api/v3/klines
// symbol
// interval
// startTime
// endTime
// limit

//Data format = [openTimestamp, open, high, low, close, volume, closeTimestamp, quote, numberOfTrades, takerBuyBaseAssetVol, takerBuyQuoteAssetVol, ignore]

const { default: axios } = require("axios")
const { logToFile } = require('../../utils/logger')

const fetchChartData = async (symbol, interval, start , end, limit) => {
  console.log('fetch candles')
  const baseUrl = 'https://api.binance.com/api/v3/klines'
  const uri = `${baseUrl}
        ?symbol=${symbol.toUpperCase()}
        &interval=${interval}
        ${start ? `&startTime=${start}` : ''}
        ${end ? `&endTime=${end}` : ''}
        ${limit ? `&limit=${limit}` : ''}`
  console.log(uri)
        
  return axios.get(uri.replace(/\s/g, ''))
    .then(res => {
      return res.data.map(([openTimestamp, open, high, low, close, volume, closeTimestamp, quote, numberOfTrades, takerBuyBaseAssetVol, takerBuyQuoteAssetVol, ]) => {
        return {
          oT: openTimestamp,
          cT: closeTimestamp,
          o: +open,
          c: +close,
          h: +high,
          l: +low,
          v: +volume,
          q: +quote
        }
      })
      
    })
    .catch(err => {
      console.log(err)
    })
}

exports.fetchChartData = fetchChartData