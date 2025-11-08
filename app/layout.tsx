import type { Metadata } from "next"

// Root layout must export metadataBase for Next.js to resolve relative OG image URLs correctly
export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tcg-shop-iota.vercel.app')

export const metadata: Metadata = {
  title: {
    default: "TCG Store",
    template: "%s | TCG Store"
  },
  description: "Online trading card game shop",
  openGraph: {
    title: "TCG Store",
    description: "Online trading card game shop",
    siteName: "TCG Store",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "TCG Store — trading card game shop",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCG Store",
    description: "Online trading card game shop",
    images: ["/opengraph.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
