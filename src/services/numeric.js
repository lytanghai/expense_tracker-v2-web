export const formatPrice = (amount, currency) => {
  if (currency === 'USD') {
    return `${parseFloat(amount).toFixed(2)} ${currency}`
  } else if (currency === 'KHR') {
    return `${parseFloat(amount).toFixed(1)} ${currency}`
  }
  return `${amount} ${currency}`
}

export const truncate = (note, length = 20) => {
  if (!note) return "-"
  return note.length > length ? note.substring(0, length) + "..." : note
}
