const WebSocket = require('ws')
//<symbol>@kline_<interval>
//wss://stream.binance.com:9443/ws/btcusdt@kline_15m
class SocketClient {
  constructor(path, baseUrl) {
    this.baseUrl = baseUrl || 'wss://stream.binance.com:9443/'
    this._path = path
    this._createSocket()
    this._handlers = new Map()
  }

  _createSocket() {
    console.log(`creating socket for ${this.baseUrl}${this._path}`)
    this._ws = new WebSocket(`${this.baseUrl}${this._path}`)

    this._ws.onopen = () => {
      console.log(`Websocket connection opened`)
    }

    this._ws.onclose = () => {
      console.log(`Websocket connection closed`)
    }

    this._ws.onerror = (err) => {
      console.log(`Websocket error: ${err}`)
    }

    this._ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      console.log(data)
    }
  }
}

exports.SocketClient = SocketClient