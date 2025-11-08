import './globals.css'

// Root layout must export metadataBase for Next.js to resolve relative OG image URLs correctly
export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tcg-shop-iota.vercel.app')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
