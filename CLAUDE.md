# ntvbox-landing

Landing page de vendas do **NTVBox** — Android TV Box 4K para o mercado brasileiro.

---

## Instruções para o Claude

- Este projeto está **em produção** — não altere estrutura de pastas sem perguntar
- Não remova seções, componentes ou comentários de `page.tsx` sem confirmar primeiro
- Ao editar copy, mantenha o tom: **direto, sem jargão técnico, voltado ao consumidor brasileiro**
- Sempre responder em **português**
- Ao modificar `page.tsx`, preserve os comentários de seção (`// === NomeSection ===`)
- Não altere o objeto `CONFIG` sem instrução explícita
- Antes de refatorar, perguntar se deve criar componentes separados ou manter tudo em `page.tsx`
- Para dúvidas de identidade visual, consultar a seção **Identidade visual** abaixo

---

## O que é o projeto

Site de uma única página (SPA com Next.js) voltado à conversão de visitantes em compradores. O produto é um aparelho Android TV Box que transforma qualquer televisão com HDMI em central de entretenimento: canais ao vivo, filmes, séries, streaming e acesso completo à Google Play Store. Preço: **R$ 399,00** (ou 12x R$ 40,60 sem juros).

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14.2.5 (App Router) |
| UI | React 18 + TypeScript 5 |
| Estilo | Tailwind CSS 3 + globals.css + inline styles |
| Font | Plus Jakarta Sans + Inter (Google Fonts) |
| Pagamento | Shopify Storefront API (GraphQL `cartCreate`) |
| Analytics | Vercel Speed Insights |
| Contato | WhatsApp Business |

## Identidade visual

- **Fundo principal:** `#0d0d0d` (hero e seções principais), `#111111`, `#1a1a1a`, `#2a2a2a`
- **Cor de destaque:** Laranja — `#E8780C` (inline styles, seções novas), `#f97316` / `#ea580c` / `#fb923c` (Tailwind, seções antigas)
- **Texto principal:** branco `#ffffff`; secundário `#777`, `#555`, `text-gray-400`
- **Gradiente de texto:** `linear-gradient(135deg, #f97316, #fb923c)` — classe `.gradient-text`
- **Botão CTA:** `.btn-shimmer` — gradiente laranja animado com efeito shimmer infinito
- **Glow laranja:** `.orange-glow` — `box-shadow: 0 0 40px rgba(249,115,22,0.15)`
- **Cards antigos:** `.card-dark` — `bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl`
- **Cards novos:** `background: linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))`, `border: 1px solid #1c1c1c`, `border-radius: 14px`
- **Scrollbar customizada:** trilha `#111111`, thumb laranja `#f97316`
- **Tag pill padrão (seções novas):** `background: rgba(232,120,12,0.08)`, `border: 1px solid rgba(232,120,12,0.2)`, `color: #E8780C`, `fontSize: 10px`, `fontWeight: 700`, `letterSpacing: 0.8px`, uppercase

## Estrutura de arquivos

```
ntvbox-landing/
├── app/
│   ├── layout.tsx        # Root layout: metadata SEO, Open Graph, Schema.org JSON-LD
│   ├── page.tsx          # Página inteira — todos os componentes inline
│   └── globals.css       # Tailwind + Plus Jakarta Sans + Inter + classes customizadas
├── components/           # Vazio — tudo está em page.tsx
├── public/
│   ├── favicon.png       # Favicon atual
│   └── images/
│       ├── banner-1.jpg  # Slide 1 do carrossel hero
│       ├── banner-2.jpg  # Slide 2 do carrossel hero
│       ├── banner-3.jpg  # Slide 3 do carrossel hero
│       ├── logo.png      # Logo do site
│       └── ntvbox-1.jpg  # Foto do produto (uso a definir)
├── CLAUDE.md
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

> `og-image.jpg` ainda não existe — Open Graph usa fallback.

## Configuração central (`CONFIG`)

No topo de `page.tsx`. Valores atuais em produção:

```ts
const CONFIG = {
  shopify: {
    domain: 'ntv-box.myshopify.com',
    storefrontToken: '18f4bae386da39dd418b4942e697bfaf',
    productHandle: 'ntvbox',
    // ProductVariant ID hardcoded na mutation: gid://shopify/ProductVariant/47960844927224
  },
  whatsapp: {
    number: '558798130541', // DDI+DDD+número, sem espaços
    message: 'Olá! Quero comprar o NTVBox. Pode me ajudar?',
  },
  price: 'R$ 399,00',
  priceInstallment: '12x R$ 40,60',
  delivery: 'Envio em até 24h',
}
```

### Fluxo de compra (`BuyButton`)

O botão "Comprar agora" **não** abre um link direto. Ele chama `createShopifyCheckout()` que faz uma mutation GraphQL `cartCreate` na Storefront API e redireciona para a `checkoutUrl` retornada. Fallback: `https://ntv-box.myshopify.com/products/ntvbox`. A aba é aberta no gesto do usuário (antes do `await`) para evitar bloqueio de popup.

## Componentes (em `page.tsx`)

> Removidos anteriormente: `TopBanner`, `ProductCarousel`, `FeaturesSection`, `InTheBoxSection`, `SpecsSection`.

### `NavBar`
Navbar fixa. Logo "NTV" branco + "Box" laranja. Links `#666`, hover branco. Botão "Comprar agora" laranja sólido. Menu hambúrguer mobile. Backdrop-blur ao scroll.

### `HeroCarousel`
3 slides (`banner-1/2/3.jpg`). `<Image fill object-contain>`. Autoplay 4s. Transição `translateX cubic-bezier(0.4,0,0.2,1)`. Setas 34px. Dots pill laranja / círculo cinza.

### `HeroSection`
Fundo `#0d0d0d`. Grid 42% / 1fr.
- Esquerda: tag pill → H1 → subtítulo → bloco de preço (R$399 / riscado R$549 / parcelas laranja) → botões CTA + WhatsApp
- Direita: card com `HeroCarousel`
- Barra inferior: avatares sobrepostos + "+2.400 clientes" | ícone cartão + texto de pagamento

### `TrustBar`
4 cards laranja gradiente: Envio Rápido, Suporte Técnico, Garantia, Qualidade Garantida.

### `ContentSection`
6 cards com badge de categoria: Canais Abertos, Canais Fechados, Filmes e Séries, Streaming, Esportes ao Vivo, Conteúdo Infantil.

### `HardwareAndBoxSection`
Header centralizado + CSS Grid 3 colunas (1.1fr | divisor | 1fr), 2 rows.
- **Hardware** (esq.): 6 cards 2×3 com hover `translateY(-2px)` + borda laranja. Specs: Allwinner H318, 2GB RAM, WiFi Dual Band, Android TV 12.0, 4K+HDR, Dolby Atmos.
- **Divisor vertical**: gradiente transparent → `#2a2a2a` → transparent, `gridRow: 1/3`.
- **Na caixa** (dir.): 6 itens flex, hover `translateX(4px)` + borda laranja. Itens: aparelho, controle por voz, HDMI, fonte, manual, 12 meses garantia.

### `HowItWorksSection`
3 passos numerados (laranja): Faça seu pedido → Receba em casa → Conecte e assista.

### `TestimonialsSection`
Grid 3 colunas, 6 depoimentos. Estrelas, avatar (inicial), nome, cidade, badge "✓ Verificado".

### `CheckoutSection`
Resumo do produto, 3 formas de pagamento (Pix 5% off, Cartão 12x, Boleto), 4 trust signals.

### `FaqSection`
Accordion 8 perguntas. `useState` com rotação do ícone +.

### `FinalCtaSection`
H2 + 2 botões: comprar + WhatsApp.

### `Footer`
3 colunas: branding + WhatsApp, links de produto, links legais. CNPJ placeholder.

### `WhatsAppFloat`
Botão flutuante `#25D366`. `animate-bounce-slow`.

## Ordem das seções

```
NavBar (fixed)
HeroSection
TrustBar
ContentSection
HardwareAndBoxSection
HowItWorksSection
TestimonialsSection
CheckoutSection
FaqSection
FinalCtaSection
Footer
WhatsAppFloat
```

## SEO — estado atual (`layout.tsx`)

- Domínio: `https://ntvbox.com.br` ✅
- Title: `"NTVBox — Aparelho Android TV 4K | Canais, Filmes e Streaming"` ← desatualizado, ver seção SEO abaixo
- Open Graph: completo (falta `og-image.jpg`)
- Schema.org JSON-LD: `Product` + `Organization` ✅ — faltam `FAQPage` e `priceValidUntil`
- `lang="pt-BR"` ✅ | `robots: index + follow` ✅

## Pendente

- [ ] Criar `/public/images/og-image.jpg` (1200×630) para Open Graph
- [ ] Adicionar CNPJ real no Footer
- [ ] Aplicar mudanças de copy (seção abaixo)
- [ ] Aplicar mudanças de SEO no `layout.tsx` (seção abaixo)
- [ ] Adicionar `FAQPage` schema + `priceValidUntil` no JSON-LD
- [ ] Definir uso de `ntvbox-1.jpg` (foto do produto)

---

## Marketing Audit — Resultados (2026-03-25)

**Score geral: 58/100 (Grau C)**
URL auditada: `https://ntvbox-landing-174w.vercel.app/`

| Categoria | Score | Peso |
|-----------|-------|------|
| Content & Messaging | 71/100 | 25% |
| Conversion Optimization | 72/100 | 20% |
| SEO & Discoverabilidade | 38/100 | 20% |
| Posicionamento Competitivo | 58/100 | 15% |
| Brand & Trust | 62/100 | 10% |
| Growth & Strategy | 38/100 | 10% |

Relatório completo: `C:\Users\ADM\MARKETING-AUDIT.md`

---

## Copy — Mudanças Prioritárias (pendentes)

> Referência detalhada: `C:\Users\ADM\COPY-SUGGESTIONS.md`

- [ ] **H1 hero:** "Canais, Filmes e Séries. Sem Mensalidade. Para Sempre." — tag pill: "Android TV Box 4K"
- [ ] **Subtítulo hero:** comparativo de custo — "A TV a cabo te cobra R$ 180/mês (R$ 2.160/ano). O NTVBox custa R$ 399 uma vez. O aparelho se paga em 2 meses."
- [ ] **CTAs em primeira pessoa:**
  - Hero → "Quero parar de pagar mensalidade →"
  - Meio da página → "Pedir meu NTVBox agora"
  - FinalCta → "Quero meu NTVBox com frete grátis →"
  - WhatsApp → "Tirar dúvidas no WhatsApp antes de comprar"
- [ ] **Urgência perto do preço (CheckoutSection):** "Restam apenas 23 unidades neste preço"
- [ ] **Trust line sob CTA hero:** "⭐ 4,9/5 · 847 avaliações · 12 meses de garantia · Frete grátis"
- [ ] **Sticky bar mobile** (novo componente, `position: fixed; bottom: 0`): "Comprar agora — R$ 379,05 no Pix"
- [ ] **Headline TestimonialsSection:** "2.400+ famílias brasileiras já trocaram a TV a cabo pelo NTVBox"
- [ ] **Reordenar depoimentos:** Patrícia (ROI explícito) → Juliana (pai 68 anos) → demais
- [ ] **FinalCtaSection H2:** "Sua TV merece ser muito mais — e você merece parar de pagar por isso todo mês." | Sub: "R$ 399 uma vez. R$ 0 por mês. Para sempre." | Micro-copy: "Garantia de 12 meses · Troca em 7 dias · Enviado em 24h"
- [ ] **Âncora de ROI** (HeroSection ou ContentSection): box visual "TV a cabo R$ 2.160/ano vs NTVBox R$ 399 único"
- [ ] **FAQ — renomear perguntas** para linguagem do consumidor (ver arquivo de referência)
- [ ] **Spec Android TV 12.0:** "Android TV 12.0 oficial (não clone) — Google Play Store completa, Google Assistant por voz, certificação para Netflix em 4K."

---

## SEO — Mudanças em `layout.tsx` (pendentes)

> Referência detalhada: `C:\Users\ADM\MARKETING-AUDIT.md` (score atual: 58/100)

- [ ] **Meta title:** "NTVBox — Android TV Box 4K Sem Mensalidade | Canais ao Vivo, Filmes e Streaming"
- [ ] **Meta description:** "NTVBox Android TV Box 4K — R$ 399 pagamento único, zero mensalidade. Acesse canais ao vivo, Netflix, YouTube e mais. 2.400+ clientes, 4,9/5. Frete grátis para todo o Brasil."
- [ ] **Schema.org FAQPage** com as 8 perguntas do `FaqSection`
- [ ] **Schema.org** `Organization.contactPoint` (WhatsApp) + `offers.priceValidUntil`

### Keywords alvo
`"melhor tv box 4k 2026"`, `"android tv box barato"`, `"tv box sem mensalidade"`, `"tv box com iptv brasil"`

---

## Estratégia de Crescimento

### Alta prioridade
- **Captura de e-mail**: pop-up com lead magnet "10 apps gratuitos para o NTVBox" → Klaviyo/Mailchimp via Shopify
- **Upsell no checkout**: Kit Família (2 unidades), cabo HDMI premium, suporte premium
- **Programa de referral**: "Indique um amigo e ganhe R$ 50 de desconto" via WhatsApp

### Média prioridade
- **Tabela comparativa**: NTVBox vs Xiaomi Mi Box S vs Amazon Fire TV Stick
- **Badge Reclame Aqui**: após criar perfil no RA

Relatório de copy completo: `C:\Users\ADM\COPY-SUGGESTIONS.md`
