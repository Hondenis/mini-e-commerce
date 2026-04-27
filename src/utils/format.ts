const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** FakeStore prices are USD; we display as BRL with a fixed friendly rate for the demo. */
const FX_RATE = 5.1

export function formatPrice(usdValue: number): string {
  return formatter.format(usdValue * FX_RATE)
}

export function formatPriceUSD(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
