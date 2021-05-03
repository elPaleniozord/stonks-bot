class Indicator {
  constructor(input) {
    this.results = []
    this.sentiment = 'Consolidation'
    this.strength = 0
    this.value = 0
  }

  update(tick) {
  }

  getResults() {
    return this.results
  }
}

exports.Indicator = Indicator