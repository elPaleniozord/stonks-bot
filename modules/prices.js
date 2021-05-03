class Price {
  constructor(symbol) {
    this.symbol = symbol
    this.observers = []
    this.ticks = []
  }

  addIndicator(indicator) {
    this.observers.push(indicator)
  }

  removeIndicator(indicator) {
    const idx = this.observers.findIndex(obs => indicator === obs)
    if(idx !== -1) {
      this.observers = this.observers.slice(idx, 1)
    }
  }

  notify(data) {
    if(this.observers.length > 0) {
      this.observers.forEach(obs => obs.update(data))
    }
  }

  newTick(tick) {
    this.ticks.push(tick)
    this.notify(tick)
  }
}

exports.Price = Price