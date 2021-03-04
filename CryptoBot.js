/* 
  CryptoBot Copyright (c) 2021 Jacek Walasik
*/

class CryptoBot {
  constructor() {
    this.apiEndpoint = 'https://api.binance.com/api/v3'
    this.websocket = 'wss://stream.binance.com:9443'
    this.graphs = {}
    this.symbols = []
  }

  _init() {
    console.log()
  }
}