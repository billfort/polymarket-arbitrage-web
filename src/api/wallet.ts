// chainId: '0x89' for Polygon
export async function connectWallet(ethereum: any) {
  if (!ethereum) {
    alert('MetaMask is not installed. Please install it to use this app.')
  }

  let walletAddress = ''
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    console.log('accounts: ', accounts)
    walletAddress = accounts[0]

    const chId = await ethereum.request({ method: 'eth_chainId' })
    console.log('walletchainId: ', chId)
  } catch (error) {
    alert('Failed to connect to MetaMask.')
    console.error(error)
  }

  return walletAddress
}
