class Indicator {
  constructor(input) {
    this.results = []
    this.id = `${input.symbol}-${input.interval}`
  }

  newTick(tick){
    
  }
  getResults() {
    return this.results
  }
}

exports.Indicator = Indicator