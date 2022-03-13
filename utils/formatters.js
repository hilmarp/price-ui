export const capitalize = (str) => {
  const lower = str.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export const getPrettyPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const getPrettyDate = (
  date,
  includeYear = true,
  includeTime = false
) => {
  let dates = date.split('T')[0]
  dates = dates.split('-')

  if (dates.length < 3) {
    return date
  }

  const months = getMonths()
  const year = dates[0]
  let month = dates[1]
  let day = dates[2]

  if (month.charAt(0) === '0') {
    month = month.substring(1)
  }

  if (day.charAt(0) === '0') {
    day = day.substring(1)
  }

  month = parseInt(month, 10)

  let dateStr = `${day}. ${months[month - 1]}`

  if (includeYear) {
    dateStr += ` ${year}`
  }

  if (includeTime) {
    const fullDate = new Date(date)
    let hours = fullDate.getHours()
    let minutes = fullDate.getMinutes()

    if (hours < 10) {
      hours = `0${hours}`
    }

    if (minutes < 10) {
      minutes = `0${minutes}`
    }

    dateStr += ` ${hours}:${minutes}`
  }

  return dateStr
}

export const formatDateYMD = (date) => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getMonths() {
  return [
    'janúar',
    'febrúar',
    'mars',
    'apríl',
    'maí',
    'júní',
    'júlí',
    'ágúst',
    'september',
    'október',
    'nóvember',
    'desember',
  ]
}
