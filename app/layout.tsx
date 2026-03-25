import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL('https://ntvbox.com.br'),
  title: 'NTVBox — Aparelho Android TV 4K | Canais, Filmes e Streaming',
  description: 'NTVBox é o aparelho Android TV com mais de 20.000 canais ao vivo, filmes e séries em Full HD e 4K. Processador Allwinner H318, 2GB RAM, Android TV 12. Frete grátis para todo o Brasil. Compre por R$399.',
  keywords: 'NTVBox, android tv box, aparelho tv box, canais ao vivo, iptv box, streaming tv, 4k android tv',
  openGraph: {
    title: 'NTVBox — Aparelho Android TV 4K | R$399',
    description: 'Android TV Box com canais ao vivo, filmes e séries. Envio em 24h para todo o Brasil. Garantia de 12 meses.',
    url: 'https://ntvbox.com.br',
    siteName: 'NTVBox',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NTVBox Android TV Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NTVBox — Aparelho Android TV 4K | R$399',
    description: 'Android TV Box com canais ao vivo, filmes e séries. Envio em 24h para todo o Brasil.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "NTVBox Android TV Box",
              "description": "Aparelho Android TV Box com processador Allwinner H318, 2GB RAM, 16GB armazenamento expansível, Android TV 12.0, WiFi dual band 2.4/5.0GHz e 4K.",
              "brand": { "@type": "Brand", "name": "NTVBox" },
              "offers": {
                "@type": "Offer",
                "price": "399.00",
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock",
                "seller": { "@type": "Organization", "name": "NTVBox" }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "847"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NTVBox",
              "url": "https://ntvbox.com.br",
              "logo": "https://ntvbox.com.br/images/logo.png"
            })
          }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}