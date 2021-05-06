/* 
  CryptoBot Copyright (c) 2021 Jacek Walasik
*/

class CryptoBot {
  constructor() {
    this.endpoints = {
      http: 'https://api.binance.com/api/v3',
      ws: 'wss://stream.binance.com:9443'
    }
    this.symbols = []
  }

  _init() {
    console.log('Initializing new bot instance')
  }

  addSymbol(pair, ) {
    const price = new Price(pair, interval='1h')
    const 

    const newSymbol = {
      pair: 'BTCUSDT',
    }
  }
}

const client = new CryptoBot()