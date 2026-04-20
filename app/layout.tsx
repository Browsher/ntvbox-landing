import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL('https://ntvbox.com.br'),
  title: 'NTVBox — Android TV Box 4K Sem Mensalidade | Canais ao Vivo, Filmes e Streaming',
  description: 'NTVBox Android TV Box 4K — R$ 399 pagamento único, zero mensalidade. Acesse canais ao vivo, Netflix, YouTube e mais. Garantia 12 meses. Frete grátis para todo o Brasil.',
  keywords: 'NTVBox, android tv box, tv box sem mensalidade, melhor tv box 4k 2026, android tv box barato, tv box com iptv brasil, canais ao vivo, aparelho tv box',
  openGraph: {
    title: 'NTVBox — Android TV Box 4K Sem Mensalidade | R$ 399',
    description: 'R$ 399 pagamento único, zero mensalidade. Canais ao vivo, Netflix, YouTube e mais. Frete grátis. Garantia 12 meses.',
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
    title: 'NTVBox — Android TV Box 4K Sem Mensalidade | R$ 399',
    description: 'R$ 399 pagamento único, zero mensalidade. Canais ao vivo, Netflix, YouTube e mais. Frete grátis.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.png',
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
              "logo": "https://ntvbox.com.br/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-87-9813-0541",
                "contactType": "customer support",
                "availableLanguage": "Portuguese"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Funciona na minha TV atual?", "acceptedAnswer": { "@type": "Answer", "text": "Sim! Qualquer TV com entrada HDMI funciona: Smart TV, TV comum, monitor ou projetor." } },
                { "@type": "Question", "name": "Preciso de técnico para instalar?", "acceptedAnswer": { "@type": "Answer", "text": "Não. É plug and play: HDMI na TV, fonte na tomada, liga e conecta ao WiFi. Em menos de 5 minutos está funcionando." } },
                { "@type": "Question", "name": "Netflix e YouTube funcionam normalmente?", "acceptedAnswer": { "@type": "Answer", "text": "Sim! O NTVBox roda Android TV 12 oficial com Google Play Store completa. Netflix, YouTube, Prime Video, Disney+ e qualquer app Android TV funcionam normalmente." } },
                { "@type": "Question", "name": "Tem frete grátis?", "acceptedAnswer": { "@type": "Answer", "text": "Sim! O frete é gratuito para todo o Brasil." } },
                { "@type": "Question", "name": "Qual a garantia do produto?", "acceptedAnswer": { "@type": "Answer", "text": "O NTVBox tem 12 meses de garantia contra defeitos de fabricação." } },
                { "@type": "Question", "name": "Posso parcelar no cartão?", "acceptedAnswer": { "@type": "Answer", "text": "Sim! Parcelamos em até 12x no cartão de crédito. Também aceitamos Pix (com 5% de desconto) e boleto bancário." } },
                { "@type": "Question", "name": "E se eu não gostar ou vier com defeito?", "acceptedAnswer": { "@type": "Answer", "text": "Você tem 7 dias a partir do recebimento para devolver sem precisar justificar. Se vier com defeito, fazemos a troca sem burocracia." } },
                { "@type": "Question", "name": "Tem canais ao vivo?", "acceptedAnswer": { "@type": "Answer", "text": "Sim. Você acessa canais abertos como Globo, SBT, Record e Band, além de canais fechados como ESPN, Fox Sports, Discovery e TNT." } }
              ]
            })
          }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1581152782978470');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1581152782978470&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  )
}