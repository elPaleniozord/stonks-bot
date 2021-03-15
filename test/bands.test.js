const { BOLL } = require('../indicators/bands')
const data = require('./data/klines-15m_2-3-march-2021')

const ticks = data.map(d => d.c)
test('Should properly compute Bollinger Bands for sample data with default values', () => {
  const boll = BOLL(ticks)
  const expectedResult = [
    [50736.84889994532, 49352.81, 47968.77110005468],
    [50712.11223327865, 49328.07333333333, 47944.034433388006],
    [50680.12175708817, 49296.08285714285, 47912.04395719753],
    [50657.77366185008, 49273.73476190476, 47889.69586195944],
    [50644.642709469124, 49260.603809523804, 47876.56490957848],
    [50598.94461423103, 49214.90571428571, 47830.86681434039],
    [50542.66080470723, 49158.62190476191, 47774.58300481659],
    [50495.134614231036, 49111.095714285715, 47727.056814340394],
    [50457.303661850085, 49073.264761904764, 47689.22586195944],
    [50441.40413804056, 49057.36523809524, 47673.32633814992],
    [50438.624614231034, 49054.58571428571, 47670.54681434039],
    [50416.234138040556, 49032.195238095235, 47648.156338149915],
    [50369.02794756437, 48984.98904761905, 47600.95014767373],
    [50331.88032851675, 48947.84142857143, 47563.80252862611],
    [50296.97604280247, 48912.93714285715, 47528.898242911826],
    [50234.396042802466, 48850.357142857145, 47466.318242911824],
    [50200.693661850084, 48816.65476190476, 47432.61586195944],
    [50182.385090421514, 48798.34619047619, 47414.30729053087],
    [50183.49318565961, 48799.45428571429, 47415.41538576897],
    [50181.97985232627, 48797.94095238095, 47413.90205243563],
    [50180.23889994532, 48796.2, 47412.161100054676],
    [50185.890804707225, 48801.851904761905, 47417.813004816584],
    [50209.0012808977, 48824.96238095238, 47440.923481007056],
    [50216.11366185008, 48832.07476190476, 47448.03586195944],
    [50209.69937613579, 48825.66047619047, 47441.62157624515],
    [50194.56223327865, 48810.52333333333, 47426.48443338801],
    [50201.41318565961, 48817.374285714286, 47433.335385768965],
    [50188.22509042151, 48804.18619047619, 47420.14729053087],
    [50195.08889994532, 48811.049999999996, 47427.011100054675],
    [50208.706042802456, 48824.667142857135, 47440.628242911815],
    [50224.27889994532, 48840.24, 47456.20110005468],
    [50224.217471373886, 48840.178571428565, 47456.139671483244],
    [50231.04556661198, 48847.00666666666, 47462.96776672134],
    [50240.17509042151, 48856.13619047619, 47472.097290530866],
    [50242.980804707215, 48858.941904761894, 47474.90300481657],
    [50249.67651899293, 48865.63761904761, 47481.59871910229],
    [50274.08080470721, 48890.04190476189, 47506.00300481657],
    [50296.99937613579, 48912.96047619047, 47528.92157624515],
    [50290.70651899293, 48906.66761904761, 47522.628719102286],
    [50292.701280897694, 48908.66238095237, 47524.62348100705],
    [50313.50747137389, 48929.468571428566, 47545.429671483245],
    [50343.06509042151, 48959.02619047619, 47574.987290530866],
    [50357.44366185008, 48973.404761904756, 47589.365861959435],
    [50341.240328516746, 48957.201428571425, 47573.162528626104],
    [50323.077947564365, 48939.039047619044, 47555.00014767372],
    [50302.646042802466, 48918.607142857145, 47534.568242911824],
    [50279.926995183414, 48895.88809523809, 47511.84919529277],
    [50261.31509042151, 48877.27619047619, 47493.237290530866],
    [50249.681280897705, 48865.642380952384, 47481.60348100706],
    [50242.23175708818, 48858.19285714286, 47474.15395719754],
    [50185.71318565961, 48801.67428571429, 47417.63538576897],
    [50115.23699518342, 48731.1980952381, 47347.15919529278],
    [50047.97985232627, 48663.94095238095, 47279.90205243563],
    [50004.989376135796, 48620.950476190475, 47236.911576245155],
    [49964.87651899294, 48580.83761904762, 47196.7987191023],
    [49924.11794756437, 48540.07904761905, 47156.04014767373],
    [49882.391280897704, 48498.35238095238, 47114.31348100706],
    [49833.27842375485, 48449.23952380953, 47065.200623864206],
    [49766.101757088174, 48382.06285714285, 46998.02395719753],
    [49711.63794756437, 48327.59904761905, 46943.56014767373],
    [49631.222709469126, 48247.183809523805, 46863.144909578485],
    [49551.14937613579, 48167.11047619047, 46783.07157624515],
    [49465.48747137389, 48081.44857142857, 46697.40967148325],
    [49377.81318565961, 47993.77428571429, 46609.73538576897],
    [49306.41747137389, 47922.37857142857, 46538.33967148325],
    [49247.03556661199, 47862.996666666666, 46478.957766721345],
    [49183.91604280246, 47799.87714285714, 46415.83824291182],
    [49136.92889994532, 47752.89, 46368.85110005468],
    [49093.57270946913, 47709.53380952381, 46325.49490957849],
    [49056.93223327865, 47672.893333333326, 46288.854433388005],
    [48996.171280897695, 47612.132380952375, 46228.093481007054],
    [48984.1612808977, 47600.12238095238, 46216.08348100706],
    [48993.042709469126, 47609.003809523805, 46224.964909578484],
    [49002.1612808977, 47618.12238095238, 46234.08348100706],
    [49000.08032851675, 47616.04142857143, 46232.00252862611],
    [49003.09223327865, 47619.05333333333, 46235.01443338801],
    [49019.2593761358, 47635.22047619048, 46251.18157624516]
  ]
  expect(boll).toEqual(expectedResult)
})