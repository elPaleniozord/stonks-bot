module.exports = class Indicator {
  constructor(input) {
    this.results = []
    this.sentiment = 'Consolidation'
    this.strength = 0
    this.value = 0
    this.signal = {}
  }

  update(tick) {
  }

  getResults() {
    return this.results
  }

  getSignal() {
    return this.signal
  }
}