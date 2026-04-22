'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

function Svg({ size = 20, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

// ============================================================
// CONFIGURAÇÃO — Edite aqui suas informações
// ============================================================
const CONFIG = {
  shopify: {
    domain: 'ntv-box.myshopify.com',
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? '',
    productHandle: 'ntvbox',
  },
  whatsapp: {
    number: '558798130541', // ← substitua pelo seu número (com DDI e DDD, sem espaços)
    message: 'Olá! Quero comprar o NTVBox. Pode me ajudar?',
  },
  price: 'R$ 399,00',
  priceInstallment: '12x R$ 40,60',
  delivery: 'Envio em até 24h',
}

// ============================================================
// SHOPIFY CHECKOUT
// ============================================================

async function createShopifyCheckout(quantity: number = 1) {
  const response = await fetch('https://ntv-box.myshopify.com/api/2026-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '18f4bae386da39dd418b4942e697bfaf',
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate {
          cartCreate(input: {
            lines: [{ quantity: ${quantity}, merchandiseId: "gid://shopify/ProductVariant/47960844927224" }]
          }) {
            cart {
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
    }),
  })

  const data = await response.json()
  console.log('[Shopify] cartCreate response:', JSON.stringify(data, null, 2))

const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl
const fixedUrl = checkoutUrl
  ?.replace('ntv-box.com', 'ntv-box.myshopify.com')
  ?.replace('channel=online_store', 'channel=headless')
console.log('[Shopify] checkoutUrl:', fixedUrl)
return fixedUrl
}

function BuyButton({
  children,
  className,
  style,
  extraOnClick,
  onMouseOver,
  onMouseOut,
  quantity = 1,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  extraOnClick?: () => void
  onMouseOver?: React.MouseEventHandler<HTMLButtonElement>
  onMouseOut?: React.MouseEventHandler<HTMLButtonElement>
  quantity?: number
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    extraOnClick?.()
    if (loading) return
    setLoading(true)

    // Abre a aba em branco dentro do gesto do usuário (antes do await),
    // evitando que o browser bloqueie o popup após a Promise resolver.
    const tab = window.open('', '_blank')

    try {
      const url = await createShopifyCheckout(quantity)
      if (tab) {
        tab.location.href = url
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      const fallback = `https://${CONFIG.shopify.domain}/products/${CONFIG.shopify.productHandle}`
      if (tab) {
        tab.location.href = fallback
      } else {
        window.open(fallback, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ cursor: loading ? 'wait' : 'pointer', ...style }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Aguarde...
        </span>
      ) : children}
    </button>
  )
}

// ============================================================
// COMPONENTES
// ============================================================

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Recursos', href: '#recursos' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas', href: '#faq' },
  ]

  return (
    <nav
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.5)]' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Image src="/images/logo.png" alt="NTVBox" width={120} height={36} priority />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} style={{ color: '#666', fontSize: '14px', fontWeight: 500 }} className="hover:text-white transition-colors duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#checkout"
            style={{ background: '#E8780C', borderRadius: '8px', fontWeight: 700 }}
            className="text-white hover:opacity-90 transition-opacity text-xs px-3 py-2 md:text-sm md:px-5 md:py-2.5"
          >
            Comprar agora
          </a>

          {/* Hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }} className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ color: '#888', fontSize: '15px', fontWeight: 500 }} className="block py-2.5 hover:text-white transition-colors">
              {label}
            </a>
          ))}

        </div>
      )}
    </nav>
  )
}


function HeroCarousel() {
  const slides = [
    { src: '/images/banner-1.jpg', alt: 'NTVBox — Banner 1' },
    { src: '/images/banner-2.jpg', alt: 'NTVBox — Banner 2' },
    { src: '/images/banner-3.jpg', alt: 'NTVBox — Banner 3' },
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [slides.length])

  const prev = () => setActive(a => (a - 1 + slides.length) % slides.length)
  const next = () => setActive(a => (a + 1) % slides.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
      {/* Slide area */}
      <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: '260px' }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${(i - active) * 100}%)`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 560px"
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
            />
          </div>
        ))}

        {/* Arrow left */}
        <button
          onClick={prev}
          aria-label="Anterior"
          style={{
            position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: '1px solid #333',
            color: '#fff', fontSize: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}
        >‹</button>

        {/* Arrow right */}
        <button
          onClick={next}
          aria-label="Próximo"
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: '1px solid #333',
            color: '#fff', fontSize: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}
        >›</button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              height: '6px',
              width: i === active ? '24px' : '6px',
              borderRadius: '100px',
              background: i === active ? '#E8780C' : '#333',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function HeroSection() {
  const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.message)}`

  return (
    <section style={{ background: '#0d0d0d', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="hero-inner">

        {/* Tag pill — full width, above grid */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(232,120,12,0.08)', border: '1px solid rgba(232,120,12,0.25)',
            borderRadius: '100px', padding: '6px 16px',
            fontSize: '13px', fontWeight: 600, color: '#bbb',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E8780C', flexShrink: 0 }} />
            Android TV Box 4K
          </span>
        </div>

        {/* Grid — 42% / 1fr, align-items stretch so banner height matches left column */}
        <div className="hero-grid">

          {/* Left column — space-between so title is at top and buttons at bottom */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>

            {/* Top group: title + subtitle + price */}
            <div>
              <h1 className="hero-h1" style={{
                fontWeight: 800, lineHeight: 1.06,
                letterSpacing: '-1.5px', color: '#fff', marginBottom: '1rem',
              }}>
                Canais, Filmes e Séries.<br /><span style={{ color: '#E8780C' }}>Sem Mensalidade. Para Sempre.</span>
              </h1>

              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Mais de 20.000 canais ao vivo, filmes e séries — funcionando em 3 minutos, sem técnico, sem contrato, sem surpresa no cartão.
              </p>

              <div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  Preço único, sem mensalidade
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                  <span className="hero-price" style={{ fontWeight: 800, color: '#fff' }}>R$ 399,00</span>
                  <span style={{ fontSize: '16px', color: '#888', textDecoration: 'line-through' }}>R$ 549,00</span>
                </div>
                <div style={{ fontSize: '11px', color: '#E8780C', fontWeight: 600 }}>
                  ou 12x R$ 40,60 no cartão
                </div>
              </div>
            </div>

            {/* Bottom group: CTA buttons */}
            <div style={{ display: 'flex', gap: '12px' }} id="comprar">
              <a
                href="#checkout"
                style={{
                  flex: 1, background: '#E8780C', color: '#fff',
                  borderRadius: '10px', padding: '15px 24px',
                  fontWeight: 700, fontSize: '15px', textAlign: 'center',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                Quero parar de pagar mensalidade →
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, border: '1.5px solid #25D366', color: '#25D366',
                  borderRadius: '10px', padding: '15px 24px',
                  fontWeight: 700, fontSize: '15px', textAlign: 'center',
                  textDecoration: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'transparent', transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.08)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.522 5.843L.057 23.535a.75.75 0 00.916.916l5.692-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.793-.524-5.371-1.438l-.385-.228-3.985 1.025 1.025-3.985-.228-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Dúvidas?
              </a>
            </div>
          </div>

          {/* Right column — banner card */}
          <div style={{
            background: 'linear-gradient(180deg, #1a1a1a 0%, #131313 100%)',
            border: '1px solid #222', borderRadius: '20px',
            padding: '1.25rem', display: 'flex', flexDirection: 'column',
          }}>
            <HeroCarousel />
          </div>
        </div>

        {/* Bottom bar — full width, below grid */}
        <div style={{
          borderTop: '1px solid #1a1a1a',
          paddingTop: '1.25rem', marginTop: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex' }}>
              {[
                { initials: 'CM', bg: '#1e3a5f' },
                { initials: 'FL', bg: '#3b1f5e' },
                { initials: 'RS', bg: '#1a4731' },
                { initials: 'PO', bg: '#5c2d0a' },
                { initials: 'AT', bg: '#4a1c1c' },
              ].map((avatar, i) => (
                <div key={i} style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: avatar.bg, border: '2px solid #0d0d0d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '7px', fontWeight: 700, color: '#fff', letterSpacing: '0.2px',
                  marginLeft: i === 0 ? 0 : '-7px',
                  position: 'relative', zIndex: 5 - i,
                }}>
                  {avatar.initials}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#666' }}>
              Seja um dos <strong style={{ color: '#fff' }}>primeiros</strong> a transformar sua TV
            </span>
          </div>

          {/* Payment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'rgba(232,120,12,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>💳</div>
            <span style={{ fontSize: '12px', color: '#888' }}>
              Aceitamos Pix, cartão ou boleto. Parcele em até 12x
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}

function TrustBar() {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: 'Envio Rápido',
      desc: 'Enviado em até 24 horas',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: 'Suporte Técnico',
      desc: 'Atendimento via WhatsApp',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Garantia',
      desc: '12 meses de cobertura',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: 'Qualidade Garantida',
      desc: 'Produto 100% testado',
    },
  ]

  return (
    <div className="bg-[#0d0d0d] border-y border-[#1e1e1e] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 group">
              {/* Ícone com fundo laranja gradiente */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/50 group-hover:scale-110 transition-all duration-300">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HardwareAndBoxSection() {
  const [hoveredLeft, setHoveredLeft] = useState<number | null>(null)
  const [hoveredRight, setHoveredRight] = useState<number | null>(null)

  const features = [
    { icon: <Svg size={18}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></Svg>, title: 'Não trava, nem com 4K', spec: 'Allwinner H318 Quad-core', desc: 'Processador que abre apps em segundos e roda tudo sem engasgar.' },
    { icon: <Svg size={18}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Svg>, title: 'Troca de app na hora', spec: '2GB RAM', desc: 'Memória suficiente para rodar streaming, canais e jogos sem precisar reiniciar.' },
    { icon: <Svg size={18}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></Svg>, title: 'Sinal estável em qualquer canto', spec: 'WiFi Dual Band 2.4/5GHz', desc: 'Conexão 5GHz para streaming 4K sem travar, mesmo longe do roteador.' },
    { icon: <Svg size={18}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Svg>, title: 'Android TV 12 Oficial', spec: 'Android TV 12.0', desc: 'Sistema original do Google com Play Store completa, Netflix e Google Assistant por voz.' },
    { icon: <Svg size={18}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></Svg>, title: 'Imagem de cinema em casa', spec: '4K Ultra HD + HDR', desc: 'Cores reais e detalhes que a TV convencional não mostra.' },
    { icon: <Svg size={18}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></Svg>, title: 'Som de cinema na sua sala', spec: 'Dolby Atmos', desc: 'Som envolvente em toda a sala. Compatível com soundbar e home theater.' },
  ]

  const boxItems = [
    { icon: <Svg size={18}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Svg>, name: 'Aparelho NTVBox' },
    { icon: <Svg size={18}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></Svg>, name: 'Controle Remoto por Voz' },
    { icon: <Svg size={18}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"/></Svg>, name: 'Cabo HDMI' },
    { icon: <Svg size={18}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>, name: 'Fonte de Alimentação' },
    { icon: <Svg size={18}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Svg>, name: 'Manual de Instruções' },
    { icon: <Svg size={18}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Svg>, name: '12 Meses de Garantia' },
  ]

  const pillStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(232,120,12,0.08)', border: '1px solid rgba(232,120,12,0.2)',
    color: '#E8780C', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.8px', padding: '5px 12px', borderRadius: '100px',
    marginBottom: '16px', textTransform: 'uppercase',
  }

  const iconBox: React.CSSProperties = {
    width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
    background: 'linear-gradient(135deg, rgba(232,120,12,0.18), rgba(232,120,12,0.06))',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8780C',
  }

  const cardBase: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)',
    border: '1px solid #1c1c1c',
    borderRadius: '14px', padding: '16px',
    position: 'relative', overflow: 'hidden',
    transition: 'all 0.2s ease', cursor: 'default',
  }

  return (
    <section id="recursos" style={{ background: '#0d0d0d', padding: '5rem 0', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '300px', background: 'radial-gradient(ellipse at top, rgba(232,120,12,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* ── Header centralizado ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(232,120,12,0.08)', border: '1px solid rgba(232,120,12,0.2)',
            color: '#E8780C', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.8px', padding: '5px 12px', borderRadius: '100px',
            marginBottom: '14px', textTransform: 'uppercase',
          }}>
            Especificações
          </span>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '10px', letterSpacing: '-0.5px' }}>
            Conheça o NTVBox{' '}
            <span style={{ color: '#E8780C' }}>por dentro</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.6 }}>
            Hardware de ponta e tudo que você precisa para começar a assistir hoje.
          </p>
        </div>

        {/*
          Grid 3-col × 2-row:
            Col 1 (1.1fr): left header (row 1) + left cards (row 2)
            Col 2 (auto):  divider spanning both rows
            Col 3 (1fr):   right header (row 1) + right items (row 2)
          Row 1 height = max of both headers → garantia de alinhamento
          Row 2 = 1fr → cards e itens ocupam exatamente o mesmo espaço
        */}
        <div className="hardware-outer-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr auto 1fr', gridTemplateRows: 'auto 1fr' }}>

          {/* ── LEFT header (row 1, col 1) ── */}
          <div className="hardware-left-header" style={{ gridRow: 1, gridColumn: 1, paddingBottom: '1.5rem', alignSelf: 'end' }}>
            <span style={pillStyle}>Tecnologia de Ponta</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '8px' }}>
              Poder real para{' '}
              <span style={{ color: '#E8780C' }}>assistir sem travar</span>
            </h2>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.7 }}>
              Componentes de alta performance para rodar tudo sem travar.
            </p>
          </div>

          {/* ── DIVIDER (rows 1–2, col 2) ── */}
          <div className="hardware-divider" style={{ gridRow: '1 / 3', gridColumn: 2, margin: '0 2.5rem', display: 'flex' }}>
            <div style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, #2a2a2a, transparent)', flex: 1 }} />
          </div>

          {/* ── RIGHT header (row 1, col 3) ── */}
          <div className="hardware-right-header" style={{ gridRow: 1, gridColumn: 3, paddingBottom: '1.5rem', alignSelf: 'end' }}>
            <span style={pillStyle}>O que vem na caixa</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '8px' }}>
              Tudo que você precisa,{' '}
              <span style={{ color: '#E8780C' }}>pronto pra usar</span>
            </h2>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.7 }}>
              Desembale, conecte e comece a assistir. Sem complicação.
            </p>
          </div>

          {/* ── LEFT cards (row 2, col 1) ── */}
          <div className="hardware-left-cards hardware-cards-grid" style={{ gridRow: 2, gridColumn: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', gap: '10px' }}>
            {features.map((f, i) => {
              const hov = hoveredLeft === i
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredLeft(i)}
                  onMouseLeave={() => setHoveredLeft(null)}
                  style={{ ...cardBase, border: `1px solid ${hov ? 'rgba(232,120,12,0.2)' : '#1c1c1c'}`, transform: hov ? 'translateY(-2px)' : 'translateY(0)' }}
                >
                  {hov && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(232,120,12,0.4)' }} />}
                  <div style={{ ...iconBox, marginBottom: '10px' }}>{f.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ddd', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#E8780C', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.spec}</div>
                  <div style={{ fontSize: '10.5px', color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              )
            })}
          </div>

          {/* ── RIGHT items (row 2, col 3) ── */}
          <div className="hardware-right-items" style={{ gridRow: 2, gridColumn: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
            {boxItems.map((item, i) => {
              const hov = hoveredRight === i
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredRight(i)}
                  onMouseLeave={() => setHoveredRight(null)}
                  style={{ ...cardBase, display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: `1px solid ${hov ? 'rgba(232,120,12,0.2)' : '#1c1c1c'}`, transform: hov ? 'translateX(4px)' : 'translateX(0)' }}
                >
                  {hov && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: 'rgba(232,120,12,0.5)' }} />}
                  <div style={iconBox}>{item.icon}</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ddd' }}>{item.name}</span>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}

function ContentSection() {
  const contents = [
    {
      icon: <Svg size={24}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></Svg>,
      title: 'Canais Abertos',
      desc: 'Globo, SBT, Record, Band, RedeTV e todos os canais abertos brasileiros em transmissão ao vivo.',
      badge: 'Ao vivo'
    },
    {
      icon: <Svg size={24}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Svg>,
      title: 'Canais Fechados',
      desc: 'ESPN, Fox Sports, Discovery, TNT, HBO, Cartoon Network, National Geographic e muito mais.',
      badge: 'Premium'
    },
    {
      icon: <Svg size={24}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></Svg>,
      title: 'Filmes e Séries',
      desc: 'Biblioteca completa com lançamentos e clássicos. Assista quando e onde quiser, em 4K.',
      badge: '4K'
    },
    {
      icon: <Svg size={24}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></Svg>,
      title: 'Streaming',
      desc: 'Acesse Netflix, YouTube, Prime Video, Globoplay, Disney+ e qualquer app Android TV.',
      badge: 'Todos os apps'
    },
    {
      icon: <Svg size={24}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></Svg>,
      title: 'Esportes ao Vivo',
      desc: 'Futebol brasileiro, Copa do Mundo, Fórmula 1, UFC e os maiores eventos esportivos.',
      badge: 'Futebol'
    },
    {
      icon: <Svg size={24}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>,
      title: 'Conteúdo Infantil',
      desc: 'Cartoons, séries educativas e filmes para crianças. Diversão garantida para toda a família.',
      badge: 'Família'
    },
  ]

  return (
    <section id="conteudo" className="py-20 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Conteúdo ilimitado
          </div>
          <h2 className="section-title mb-4">
            Um aparelho,{' '}
            <span className="gradient-text">infinitas possibilidades</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Tudo que sua família quer assistir, em um único lugar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item, i) => (
            <div key={i} className="card-dark p-6 hover:border-orange-500/30 transition-all hover:orange-glow group">
              <div className="flex items-start gap-4">
                <div className="group-hover:scale-110 transition-transform flex-shrink-0 text-orange-400">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: <Svg size={36}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Svg>,
      title: 'Faça seu pedido',
      desc: 'Clique em Comprar Agora, escolha a forma de pagamento (Pix, cartão ou boleto) e confirme.',
    },
    {
      number: '02',
      icon: <Svg size={36}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></Svg>,
      title: 'Receba em casa',
      desc: 'Enviamos em até 24h após a confirmação do pagamento. Entrega para todo o Brasil.',
    },
    {
      number: '03',
      icon: <Svg size={36}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Svg>,
      title: 'Conecte e assista',
      desc: 'Ligue o cabo HDMI na sua TV, conecte ao WiFi e pronto. Em 5 minutos está funcionando.',
    },
  ]

  return (
    <section id="como-funciona" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            É muito simples
          </div>
          <h2 className="section-title mb-4">
            Da compra ao primeiro episódio{' '}
            <span className="gradient-text">em 3 passos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0" />

          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30 text-orange-400 mb-6 relative">
                {step.icon}
                <span className="absolute -top-3 -right-3 w-7 h-7 bg-orange-500 rounded-lg text-white text-xs font-black flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Patrícia O.',
      city: 'São Paulo, SP',
      rating: 5,
      text: 'Cancelei a TV por assinatura depois de comprar o NTVBox. Economizei mais de R$200 por mês. O atendimento no WhatsApp foi excelente, responderam na hora.',
      product: 'NTVBox',
    },
    {
      name: 'Juliana R.',
      city: 'Recife, PE',
      rating: 5,
      text: 'Presente de Natal para meu pai de 68 anos. Ele achou que seria difícil, mas com o controle por voz está usando sozinho. Ficou encantado! Obrigada NTVBox!',
      product: 'NTVBox',
    },
    {
      name: 'Carlos M.',
      city: 'São Paulo, SP',
      rating: 5,
      text: 'Chegou rapidinho, em 2 dias já estava na minha porta. Conectei na TV e em 5 minutos estava assistindo tudo. Qualidade de imagem impecável, recomendo demais!',
      product: 'NTVBox',
    },
    {
      name: 'Fernanda L.',
      city: 'São Paulo, SP',
      rating: 5,
      text: 'Meu marido é louco por futebol. Agora assiste todos os jogos ao vivo sem pagar caro por cabos. O controle por voz é demais, minha filha usa para buscar desenhos sozinha.',
      product: 'NTVBox',
    },
    {
      name: 'Roberto S.',
      city: 'Belo Horizonte, MG',
      rating: 5,
      text: 'Comprei desconfiado, mas fui surpreendido. Aparelho de qualidade, veio bem embalado com tudo que prometia. Netflix, YouTube e canais ao vivo rodando perfeito.',
      product: 'NTVBox',
    },
    {
      name: 'André T.',
      city: 'São Paulo, SP',
      rating: 5,
      text: 'Android TV 12 é muito estável, nunca travou. Já uso há 6 meses. Vale muito o investimento, muito melhor que os concorrentes que já experimentei antes.',
      product: 'NTVBox',
    },
  ]

  return (
    <section id="depoimentos" className="py-20 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Clientes satisfeitos
          </div>
          <h2 className="section-title mb-4">
            O que dizem quem já tem{' '}
            <span className="gradient-text">NTVBox</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-500 text-xl">★</span>
              ))}
            </div>
            <span className="font-bold text-white">4.9/5</span>
            <span>·</span>
            <span>Avaliações de clientes</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className={`card-dark p-6 hover:border-orange-500/20 transition-colors${i >= 4 ? ' hidden sm:block' : ''}`}>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-orange-500">★</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#2a2a2a]">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.city}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">✓ Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CheckoutSection() {
  const [qty, setQty] = useState(1)
  const unitPrice = 399
  const total = (unitPrice * qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })


  return (
    <section id="checkout" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title mb-4">
            Garanta o seu{' '}
            <span className="gradient-text">NTVBox agora</span>
          </h2>
        </div>

        <div className="card-dark p-4 sm:p-8 orange-glow">
          {/* Product summary */}
          <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b border-[#2a2a2a] text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/images/ntvbox-1.jpg" alt="NTVBox" width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg mb-1">NTVBox · Android TV Box 4K</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">Inclui: aparelho, controle por voz, HDMI, fonte e manual</p>
              <div className="flex items-center justify-center flex-wrap gap-2 mb-2">
                <span className="text-xl sm:text-2xl font-black text-white">R$ {total}</span>
                {qty === 1 && <span className="text-gray-500 line-through text-sm">R$ 549,00</span>}
                <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">-27%</span>
              </div>
              <div className="text-orange-400 text-sm mb-4">ou 12x R$ 40,60 no cartão</div>
              {/* Seletor de quantidade */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-gray-400 text-sm">Quantidade:</span>
                <div className="flex items-center gap-0 border border-[#333] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors text-lg font-bold"
                  >−</button>
                  <span className="w-10 text-center text-white font-bold text-sm border-x border-[#333]">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(10, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors text-lg font-bold"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mb-6 sm:mb-8">
            <div className="text-sm text-gray-400 mb-3 font-medium">Formas de pagamento aceitas:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: <Svg size={20}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>, label: 'Pix', desc: 'Pagamento instantâneo' },
                { icon: <Svg size={20}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>, label: 'Cartão de Crédito', desc: 'até 12x' },
                { icon: <Svg size={20}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>, label: 'Boleto', desc: 'venc. 3 dias úteis' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#222222] border border-[#333333] rounded-xl px-4 py-3">
                  <span className="text-orange-400">{p.icon}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{p.label}</div>
                    <div className="text-orange-400 text-xs">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopify Buy Button — Cole seu código aqui */}
          <div id="shopify-buy-button-container" className="mb-6">
            {/*
            ================================================
            COMO INTEGRAR O SHOPIFY BUY BUTTON:

            1. Acesse: Shopify Admin > Canais de Vendas > Buy Button
            2. Crie um botão para seu produto NTVBox
            3. Copie o código gerado e cole aqui dentro
            4. Remova o botão de fallback abaixo

            O código gerado pelo Shopify se parece com:
            <div id='product-component-XXXXXX'></div>
            <script>...</script>
            ================================================
            */}
            <BuyButton
              className="block w-full btn-shimmer text-white font-black py-5 rounded-xl text-lg text-center transition-all duration-200 transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-orange-500/30 hover:shadow-[0_0_40px_rgba(232,120,12,0.55)]"
              quantity={qty}
            >
              <span className="inline-flex items-center justify-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Pedir meu NTVBox agora
              </span>
            </BuyButton>
            <p className="text-center text-gray-500 text-xs mt-2">
              Processado com segurança pelo Mercado Pago via Shopify
            </p>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Svg size={24}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>, text: 'Compra 100% segura' },
              { icon: <Svg size={24}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Svg>, text: 'Garantia 12 meses' },
              { icon: <Svg size={24}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></Svg>, text: 'Troca em 7 dias' },
              { icon: <Svg size={24}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>, text: 'Envio em 24h' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center py-4 bg-[#222222] rounded-xl">
                <span className="text-orange-400">{item.icon}</span>
                <span className="text-gray-300 text-xs font-semibold leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pix discount highlight */}
      </div>
    </section>
  )
}

function FaqSection() {
  const categories = ['Instalação', 'Conteúdo', 'Pagamento', 'Garantia']

  const faqs = [
    // Instalação
    { cat: 'Instalação', q: 'Funciona na minha TV atual?', a: 'Sim! Qualquer TV com entrada HDMI funciona: Smart TV, TV comum, monitor ou projetor. Se sua TV tem HDMI, o NTVBox funciona nela.' },
    { cat: 'Instalação', q: 'Preciso de técnico para instalar?', a: 'Não. É plug and play: HDMI na TV, fonte na tomada, liga e conecta ao WiFi. Em menos de 5 minutos está funcionando. Se tiver dúvida, nosso suporte no WhatsApp te acompanha em tempo real.' },
    { cat: 'Instalação', q: 'Minha internet é suficiente para 4K?', a: 'Para HD você precisa de no mínimo 10 Mbps. Para Full HD, 20 Mbps. Para 4K, 25 Mbps ou mais. O NTVBox tem WiFi Dual Band 5GHz, o que garante uma conexão muito mais estável do que aparelhos comuns.' },
    { cat: 'Instalação', q: 'Funciona sem internet?', a: 'O NTVBox funciona sem internet para arquivos locais (pen drive, HD externo). Para canais ao vivo, filmes e apps como Netflix, é necessária conexão com a internet.' },
    { cat: 'Instalação', q: 'Consigo usar o controle remoto da minha TV?', a: 'O NTVBox vem com controle remoto por voz próprio. Em algumas TVs com HDMI-CEC ativo, o controle da TV também consegue navegar no aparelho. O controle incluído, porém, é o mais completo e recomendado.' },

    // Conteúdo
    { cat: 'Conteúdo', q: 'Netflix e YouTube funcionam normalmente?', a: 'Sim! O NTVBox roda Android TV 12 oficial com Google Play Store completa. Netflix, YouTube, Prime Video, Disney+, Globoplay e qualquer app Android TV funcionam normalmente, inclusive com controle por voz.' },
    { cat: 'Conteúdo', q: 'Tem canais ao vivo?', a: 'Sim. Você acessa canais abertos como Globo, SBT, Record e Band, além de canais fechados como ESPN, Fox Sports, Discovery, TNT e muitos outros. Tudo ao vivo e sem mensalidade.' },
    { cat: 'Conteúdo', q: 'O conteúdo é legal e seguro?', a: 'O NTVBox é um aparelho Android TV oficial. Todo o conteúdo acessado via Google Play Store é legal. Aplicativos de terceiros instalados pelo usuário são de responsabilidade do próprio usuário.' },
    { cat: 'Conteúdo', q: 'Posso instalar qualquer app?', a: 'Sim! Com acesso completo à Google Play Store, você instala qualquer app disponível para Android TV. Também é possível instalar apps via APK pelo navegador.' },
    { cat: 'Conteúdo', q: 'Os streamings funcionam no NTVBox?', a: 'O catálogo do NTVBox já inclui conteúdo de Netflix, Globoplay, Amazon Prime Video, Disney+, Apple TV+ e Paramount+. E se quiser, ainda pode baixar esses e outros apps direto pela Google Play Store.' },

    // Pagamento
    { cat: 'Pagamento', q: 'Posso parcelar no cartão?', a: 'Sim! Parcelamos em até 12x no cartão de crédito via Mercado Pago. Também aceitamos Pix e boleto bancário.' },
    { cat: 'Pagamento', q: 'O pagamento é seguro?', a: 'Sim. Todo o processo de pagamento é processado pelo Mercado Pago via Shopify, duas das plataformas mais seguras do Brasil. Seus dados financeiros nunca passam pelo nosso servidor.' },
    { cat: 'Pagamento', q: 'Quanto tempo demora para chegar?', a: 'Enviamos em até 24 horas após a confirmação do pagamento. O prazo de entrega varia de 2 a 10 dias úteis dependendo da sua localização.' },
    { cat: 'Pagamento', q: 'Tem frete grátis?', a: 'Sim! O frete é gratuito para todo o Brasil.' },
    { cat: 'Pagamento', q: 'Como rastrear meu pedido?', a: 'Após o envio, você recebe o código de rastreio por e-mail. Também pode entrar em contato com nosso suporte no WhatsApp para acompanhar sua entrega em tempo real.' },

    // Garantia
    { cat: 'Garantia', q: 'E se eu não gostar ou vier com defeito?', a: 'Você tem 7 dias a partir do recebimento para devolver sem precisar justificar, conforme o Código de Defesa do Consumidor. Se vier com defeito, fazemos a troca sem burocracia.' },
    { cat: 'Garantia', q: 'Qual a garantia do produto?', a: 'O NTVBox tem 12 meses de garantia contra defeitos de fabricação. Qualquer problema dentro desse período, substituímos o aparelho.' },
    { cat: 'Garantia', q: 'Como acionar a garantia?', a: 'Basta entrar em contato pelo nosso WhatsApp descrevendo o problema. Nossa equipe avalia e, se confirmado o defeito, organizamos a troca sem custo para você.' },
    { cat: 'Garantia', q: 'Tem suporte técnico após a compra?', a: 'Sim! Nosso suporte via WhatsApp está disponível para ajudar com instalação, configuração e qualquer dúvida após a compra. Você não fica sozinho.' },
    { cat: 'Garantia', q: 'E se parar de funcionar após a garantia?', a: 'Após o período de garantia, continuamos oferecendo suporte técnico pelo WhatsApp. Na maioria dos casos, problemas podem ser resolvidos remotamente sem custo.' },
  ]

  const [activeCategory, setActiveCategory] = useState('Instalação')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = activeCategory === 'Todos' ? faqs : faqs.filter(f => f.cat === activeCategory)

  return (
    <section id="faq" className="py-20 bg-[#111111]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Dúvidas Frequentes
          </div>
          <h2 className="section-title mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-400 text-sm">
            Encontre respostas para as principais dúvidas sobre o NTVBox.
          </p>
        </div>

        {/* Category pills */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null) }}
              style={{
                background: activeCategory === cat ? '#E8780C' : 'transparent',
                border: `1px solid ${activeCategory === cat ? '#E8780C' : '#2a2a2a'}`,
                color: activeCategory === cat ? '#fff' : '#888',
                borderRadius: '100px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <div key={i} className="card-dark overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#222222] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <span className={`text-orange-500 text-xl flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: openIndex === i ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-[#2a2a2a] pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Não encontrou sua resposta?{' '}
          <a href={`https://wa.me/${CONFIG.whatsapp.number}`} className="text-orange-400 hover:text-orange-300 font-semibold">
            Fale conosco no WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-500/10 to-orange-500/5" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <div className="mb-6 text-orange-400 flex justify-center">
          <Svg size={56}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></Svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Sua TV merece ser{' '}
          <span className="gradient-text">muito mais</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Milhares de brasileiros já transformaram a experiência na TV com o NTVBox.
          Chegou a sua vez.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="#checkout" className="btn-shimmer text-white font-black py-5 px-12 rounded-xl text-xl text-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/30">
            Quero meu NTVBox com frete grátis →
          </a>
          <a
            href={`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 font-bold py-5 px-8 rounded-xl text-lg transition-all"
            style={{ border: '1.5px solid #25D366', color: '#25D366', background: 'transparent' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.08)')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.522 5.843L.057 23.535a.75.75 0 00.916.916l5.692-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.793-.524-5.371-1.438l-.385-.228-3.985 1.025 1.025-3.985-.228-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Tirar dúvidas no WhatsApp antes de comprar
          </a>
        </div>

        <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-500">
          {['Frete grátis para todo o Brasil', 'Garantia de 12 meses', '7 dias para devolver', 'Pagamento seguro'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8780C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2a2a2a] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Image src="/images/logo.png" alt="NTVBox" width={100} height={30} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tecnologia de entretenimento acessível para toda a família brasileira.
            </p>
            <a
              href={`https://wa.me/${CONFIG.whatsapp.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[#25D366] text-sm font-semibold hover:text-green-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.522 5.843L.057 23.535a.75.75 0 00.916.916l5.692-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.793-.524-5.371-1.438l-.385-.228-3.985 1.025 1.025-3.985-.228-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Suporte via WhatsApp
            </a>
            <a
              href="https://www.instagram.com/ntvboxoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-pink-400 text-sm font-semibold hover:text-pink-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @ntvboxoficial
            </a>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><a href="#conteudo" className="hover:text-orange-400 transition-colors">Conteúdo</a></li>
              <li><a href="#recursos" className="hover:text-orange-400 transition-colors">Recursos</a></li>
              <li><a href="#como-funciona" className="hover:text-orange-400 transition-colors">Como Funciona</a></li>
              <li><a href="#depoimentos" className="hover:text-orange-400 transition-colors">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-orange-400 transition-colors">Dúvidas</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Informações</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><a href="https://ntv-box.myshopify.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="https://ntv-box.myshopify.com/policies/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Termos de Uso</a></li>
              <li><a href="https://ntv-box.myshopify.com/policies/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Política de Troca</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-xs text-center sm:text-left">
            © 2026 NTVBox. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <span>Pagamentos processados por</span>
            <span className="font-bold text-gray-400">Mercado Pago</span>
            <span>via</span>
            <span className="font-bold text-gray-400">Shopify</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// WhatsApp floating button
function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform duration-200 animate-bounce-slow"
      aria-label="Fale conosco no WhatsApp"
    >
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.522 5.843L.057 23.535a.75.75 0 00.916.916l5.692-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.793-.524-5.371-1.438l-.385-.228-3.985 1.025 1.025-3.985-.228-.385A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
  )
}

// === StickyBarMobile ===
function StickyBarMobile() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden" style={{ background: '#0d0d0d', borderTop: '1px solid #1c1c1c', padding: '10px 16px 14px' }}>
      <a
        href="#checkout"
        style={{ background: '#E8780C', borderRadius: '10px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', color: '#fff' }}
        className="hover:opacity-90 transition-opacity w-full text-center"
      >
        Comprar agora
        <span style={{ fontSize: '13px', opacity: 0.85 }}>· R$ 379,05 no Pix</span>
      </a>
    </div>
  )
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================
export default function Home() {
  return (
    <main style={{ paddingBottom: '80px' }} className="md:pb-0">
      <NavBar />
      <HeroSection />
      <TrustBar />
      <ContentSection />
      <HardwareAndBoxSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CheckoutSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
      <WhatsAppFloat />
      <StickyBarMobile />
    </main>
  )
}
