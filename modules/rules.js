const openPosition = () => {

}

const closePosition = (id) => {

}

const takeProfit = () => {

}

const trailingStopLoss = (entryPrice) => {
  const risk = 0.02 
  const stopPrice = entryPrice - (entryPrice * risk)

  if(bar.close <= stopPrice) {
    return closePosition(id)
  } else {
    if(currentPrice > entryPrice) {

    }
  }

}