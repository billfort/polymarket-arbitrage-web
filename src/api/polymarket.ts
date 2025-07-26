const dataUrl = 'https://data-api.polymarket.com'

export async function getUserPosition(walletAddress: string) {
  if (!walletAddress) {
    throw new Error('Please connect wallet first')
  }

  try {
    const res = await fetch(`${dataUrl}/positions?user=${walletAddress}&sortBy=CURRENT`)
    const positions = await res.json()
    return positions
  } catch (error) {
    console.error('get user position: ', error)
  }
}
