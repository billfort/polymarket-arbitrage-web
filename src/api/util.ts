export const convertUTCToLocal = (utcString: string) => {
  if (!utcString) return ''
  try {
    const date = new Date(utcString)
    return date.toLocaleString('zh-CN', {
      // year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    })
  } catch (error) {
    console.error('Error converting UTC to local:', error)
    return utcString
  }
}
