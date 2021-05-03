/*
Simple Moving Average 
*/
class SimpleMovingAverage {
  constructor(period, ticks) {
    this.period = period
    this.sma = undefined
    this.values = [1,2]
    this.prices = ticks
  }

  update(tick) {
    this.values.push(tick)
    if(this.values.length < this.period){
      console.log(`Not enough data to calculate SMA(${this.period})`)
    }
    else if(this.sma) {
      const idx = this.values.length - 1 - this.period
      this.sma = this.sma + (tick - this.values[idx])/ this.period
    } else {
      this.sma = this.values.reduce((a,b) => a + b) / this.period
    }
  }

  value() {
    return [this.sma, this.prices]
  }
}
const data = []
const sma = new SimpleMovingAverage(4, data)

console.log('should return undefined', sma.value())
sma.update(3)
data.push(1)
sma.update(4)
data.push(2)
console.log('should return 2.5', sma.value())
sma.update(5)
data.push(3)
console.log('should return 3.5', sma.value())
