const Price = require('./price')
const Indicator = require('../../indicators/Indicator')

describe('Should properly initialize price object', () => {
  const BTC = new Price('BTC', '15min')

  it('Price should have a correct symbol', () => {
    const symbol = BTC.symbol.split('-')
    expect(symbol[0]).toEqual('BTC')
  })
  it('Price should have a correct interval', () => {
    const symbol = BTC.symbol.split('-')
    expect(symbol[1]).toEqual('15min')
  })
})

describe('Should handle price update', () => {
  const BTC = new Price('BTC', '15min')
  const priceArray = [{"oT":1614639600000,"cT":1614641399999,"o":49137.73,"c":49666.67,"h":49790,"l":49064.62,"v":1909.524656,"q":94441516.47604556},
  {"oT":1614641400000,"cT":1614643199999,"o":49662.18,"c":49587.03,"h":49755,"l":49413.94,"v":998.485464,"q":49530645.50509395},
  {"oT":1614643200000,"cT":1614644999999,"o":49595.76,"c":50180,"h":50200,"l":49515.15,"v":2433.010495,"q":121451595.55181377},
  {"oT":1614645000000,"cT":1614646799999,"o":50179.99,"c":49354.62,"h":50179.99,"l":49278.94,"v":1913.803529,"q":95036492.04807031},
  {"oT":1614646800000,"cT":1614648599999,"o":49354.63,"c":48903.79,"h":49355.59,"l":48710,"v":1466.5827,"q":71937439.0421011},
  {"oT":1614648600000,"cT":1614650399999,"o":48907.88,"c":49368.6,"h":49699.93,"l":48800,"v":1184.57989,"q":58252804.81253259},
  {"oT":1614650400000,"cT":1614652199999,"o":49368.6,"c":49403.41,"h":49640,"l":49045.45,"v":1723.202594,"q":85074707.95099577}]
  
  it('Should handle new tick', () => {
    BTC.newTick(priceArray[0])
    expect(BTC.ticks[0]).toEqual(priceArray[0])
    BTC.ticks = []
  })

  it('Should handle new multiple updates', () => {
    priceArray.forEach((tick) => {
      BTC.newTick(tick)
    })
    expect(BTC.ticks.length).toEqual(7)
    expect(BTC.ticks).toEqual(priceArray)
  })
})

describe('Should handle indicator subscription', () => {
  const BTC = new Price('BTC', '15min')
  const indicator = new Indicator()

  it('Should properly add indicator', () => {
    BTC.addIndicator(indicator)
    expect(BTC.observers[0]).toEqual(indicator)
  })
  it('Should call indicator on price change', () => {
    const spy = jest.spyOn(indicator, 'update')
    BTC.newTick(100)

    expect(spy).toHaveBeenCalled()
  })
  it('Should properly remove indicator', () => {
    BTC.removeIndicator(indicator)
    expect(BTC.observers).toEqual([])
  })
})