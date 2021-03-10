const {EMA, WMA, SMA} = require('../indicators/ma')
const {MACD} = require('../indicators/macd')
const data = require('./data/sample')

const prices = data.close.map(d => ({c: d}))

test('Should properly compute 9 period EMA for mock data', () => {
  const period = 9
  const expectedOutput = [
    138.3422222222222,
    140.53377777777777,
    144.91702222222222,
    151.72361777777778,
    161.4488942222222,
    173.53911537777776,
    187.4772923022222,
    198.68583384177776,
    216.23266707342222,
    229.04013365873777,
  ]
  const ema = EMA(prices, period)
  expect(ema).toEqual(expectedOutput)
})

test('Should properly compute WMA from mock data', () => {
  var expectedResult = [
    130.67333333333335,
    138.45333333333332,
    145.08166666666665,
    142.65333333333334,
    144.36,
    141.57166666666666,
    139.5283333333333,
    143.56833333333333,
    153.86333333333334,
    168.50833333333333,
    186.89999999999998,
    207.55833333333334,
    228.97333333333333,
    239.82,
    264.9216666666667,
    276.195,
  ];
  const wma = WMA(prices, 3)
  expect(wma).toEqual(expectedResult)
})

test('Should properly compute 9 period SMA for mock data', () => {
  var expectedResult =  [
    138.3422222222222,
    140.73666666666665,
    144.45111111111112,
    149.58444444444444,
    155.68999999999997,
    163.79222222222222,
    175.53777777777776,
    186.22,
    202.59444444444446,
    218.48777777777778,
  ]
  const sma = SMA(prices, 9)
  expect(sma).toEqual(expectedResult)
})

// test('Should properly compute MACD ', () => {
//   var expectedResult =  [
//     139.438,
//     142.908,
//     147.901,
//     154.661,
//     162.31099999999998,
//     171.736,
//     182.33599999999998,
//     196.24,
//     210.362,
//   ]
//   const sma = MACD(prices, 10)
//   expect(sma).toEqual(expectedResult)
// })