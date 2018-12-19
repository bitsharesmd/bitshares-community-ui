// util functions should go here

// convert sum to currency format, exapmle: 1 000 000 (use in markets)
export const getVolumeFormat = sum => sum < 1 ? sum : sum.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')

export const removePrefix = (string, prefix = 'OPEN.') => {
  let trimmed = string
  if (string.substring(0, prefix.length) === prefix) trimmed = string.slice(prefix.length)
  return trimmed
}

// converts amount to shortened format
export const amountValueShortener = amount => {
  let valuesToSymbols = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'm' }
  ]
  let regex = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = valuesToSymbols.length - 1; i > 0; i--) {
    if (amount >= valuesToSymbols[i].value) {
      break
    }
  }
  return (amount / valuesToSymbols[i].value).toFixed(1).replace(regex, '$1') + valuesToSymbols[i].symbol
}

// get max value from array[{}, {}, {}]
export const getMaxSum = (items, field) => {
  return Math.max.apply(null, items.map(item => item[field]))
}

// short float currency
export const getFloatCurrency = (n, opts) => {
  if (!opts) {
    opts = {
      formatSpaces: true
    }
  }
  // check format to calculate. if format has xxxx or xxxx.xxxx then need in calculate
  // when foramt x/xx/xx or x.x / xx.x / xxx.xxx then not needed
  const isValidPretty = (val) => (val.indexOf('.') === -1 && val.length > 3) || val.indexOf('.') > 3
  const convertToPretty = (val) => {
    // str after point does not needed in calculate
    const str = val.toString()
    const startPoint = str.indexOf('.')

    if (startPoint > -1) {
      const prettyStr = str.slice(0, startPoint).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
      const endStr = str.slice(startPoint)
      // concat start str with spaces + after point str
      return `${prettyStr}${endStr}`
    }

    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
  }

  const inputValue = n.toString()
  const hasPoint = () => !!~inputValue.indexOf('.')
  const value = hasPoint() ? inputValue.replace(/0+$/, '') : inputValue

  if (value[0] === '0' && value.length > 9) {
    const val = value.slice(1, 10)
    return isValidPretty(val) && opts.formatSpaces ? convertToPretty(val) : val
  }
  const val = value.slice(0, 9)
  return isValidPretty(val) && opts.formatSpaces ? convertToPretty(val) : val || '0'
}

// shortens fiat (USD) value
export const shortenFiatValue = (value, precision = 1) => {
  if (!value) return 0
  if (value > 10) return Math.floor(value)
  if (value > 0.1) return value.toFixed(precision)
  return +value.toFixed(2)
}
