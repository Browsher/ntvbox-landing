# ntvbox-landing

Landing page de vendas do **NTVBox** — Android TV Box 4K para o mercado brasileiro.

## O que é o projeto

Site de uma única página (SPA com Next.js) voltado à conversão de visitantes em compradores. O produto é um aparelho Android TV Box que transforma qualquer televisão com HDMI em central de entretenimento: canais ao vivo, filmes, séries, streaming e acesso completo à Google Play Store. Preço: **R$399,00** (ou 12x R$38,21 sem juros).

## Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14.2.5 (App Router) |
| UI | React 18 + TypeScript 5 |
| Estilo | Tailwind CSS 3 + globals.css customizado + inline styles |
| Font | Plus Jakarta Sans + Inter (Google Fonts) |
| Pagamento | Shopify (link direto) + Mercado Pago |
| Contato | WhatsApp Business |

## Identidade visual

- **Fundo principal:** `#0d0d0d` (hero e seções principais), `#111111`, `#1a1a1a`, `#2a2a2a`
- **Cor de destaque:** Laranja — `#E8780C` (usado via inline style nas seções novas), `#f97316` / `#ea580c` / `#fb923c` (Tailwind, seções antigas)
- **Texto principal:** branco `#ffffff`; texto secundário `#777`, `#555`, `text-gray-400`
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
│   └── images/           # banner-1.jpg, banner-2.jpg, banner-3.jpg (carrossel hero)
├── CLAUDE.md             # Este arquivo
├── LEIAME.md             # README em português
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Imagens em `/public/images/`

| Arquivo | Uso |
|---------|-----|
| `banner-1.jpg` | Slide 1 do carrossel hero |
| `banner-2.jpg` | Slide 2 do carrossel hero |
| `banner-3.jpg` | Slide 3 do carrossel hero |
| `logo.png` | Logo do site (pendente) |
| `og-image.jpg` | Open Graph / Twitter Card (pendente) |

## Componentes implementados (em page.tsx)

> **Nota:** `TopBanner`, `ProductCarousel`, `FeaturesSection`, `InTheBoxSection` e `SpecsSection` foram removidos.

### `NavBar`
Navbar fixa (Plus Jakarta Sans). Logo "NTV" branco + "Box" laranja `#E8780C`. Links com cor `#666`, hover branco. Botão "Comprar agora" sólido laranja com `border-radius: 8px`. Menu hambúrguer no mobile. Scroll detectado para backdrop-blur.

### `HeroCarousel`
Carrossel interno da HeroSection. 3 slides com as imagens reais (`banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg`). Usa `<Image fill object-contain>`. Autoplay 4s. Transição lateral `translateX` com `cubic-bezier(0.4, 0, 0.2, 1)`. Setas circulares 34px. Dots pill laranja / círculo cinza.

### `HeroSection`
Fundo `#0d0d0d`. Font Plus Jakarta Sans. Estrutura de cima para baixo:
1. **Tag pill** full-width: "Android TV Box — Tecnologia Premium"
2. **Grid 42% / 1fr** (`align-items: stretch`):
   - Coluna esquerda (`justify-content: space-between`): título H1 "Seu **IPTV** Favorito." (44px/800, `#E8780C`), subtítulo, bloco de preço (R$399 / riscado R$549 / parcelamento laranja), botões "Comprar agora" + "Dúvidas?" WhatsApp
   - Coluna direita: card com `HeroCarousel`
3. **Barra inferior** full-width: avatares sobrepostos + "+2.400 clientes" | ícone 💳 + texto de pagamento

### `TrustBar`
4 cards com ícones SVG e fundo laranja gradiente: Envio Rápido, Suporte Técnico, Garantia, Qualidade Garantida.

### `ContentSection`
6 cards: Canais Abertos, Canais Fechados, Filmes e Séries, Streaming, Esportes ao Vivo, Conteúdo Infantil. Cada card com badge de categoria.

### `HardwareAndBoxSection` *(fusão de FeaturesSection + InTheBoxSection)*
Seção única com header centralizado + grid 3 colunas (1.1fr | divisor | 1fr).

**Header centralizado:**
- Tag pill "ESPECIFICAÇÕES"
- Título 34px/800: "Conheça o NTVBox **por dentro**" (laranja)
- Subtítulo 14px/#777

**Grid 3-col × 2-row** (CSS Grid com subgrid implícito):
- Row 1: headers das duas colunas (mesma altura via grid) com `alignSelf: end`
- Row 2: conteúdo (1fr)
- Divisor vertical `gridRow: 1/3`, gradiente transparent → `#2a2a2a` → transparent, margem `0 2.5rem`

**Coluna esquerda — Hardware** (`id="recursos"`):
- Tag pill "TECNOLOGIA DE PONTA"
- Título 22px/800: "Poder real para **assistir sem travar**" (laranja)
- Grid 2×3 (`gridTemplateRows: repeat(3, 1fr)`) — 6 cards iguais em altura
- Hover: `translateY(-2px)`, borda laranja, linha laranja no topo
- Cards: 🚀 Processador Allwinner H318 | 💾 2GB RAM | 📶 WiFi Dual Band | 🤖 Android TV 12.0 | 🎬 4K Ultra HD + HDR | 🔊 Áudio Dolby Atmos

**Coluna direita — O que vem na caixa:**
- Tag pill "O QUE VEM NA CAIXA"
- Título 22px/800: "Tudo que você precisa, **pronto pra usar**" (laranja)
- 6 itens flex column `justify-content: space-between` (sem gap fixo)
- Hover: `translateX(4px)`, borda laranja, linha laranja vertical à esquerda
- Itens: 📺 Aparelho NTVBox | 🎙 Controle Remoto por Voz | 🔌 Cabo HDMI | ⚡ Fonte de Alimentação | 📖 Manual de Instruções | 🛡 12 Meses de Garantia

### `HowItWorksSection`
3 passos: "Faça seu pedido" → "Receba em casa" → "Conecte e assista". Numeração laranja absoluta.

### `TestimonialsSection`
Grid 3 colunas, 6 depoimentos com estrelas, avatar inicial, nome, cidade e badge "✓ Verificado".

### `CheckoutSection`
Resumo do produto, 3 formas de pagamento (Pix 5% off, Cartão 12x, Boleto), 4 trust signals.

### `FaqSection`
Accordion com 8 perguntas. `useState` para abertura/fechamento com rotação do ícone +.

### `FinalCtaSection`
CTA de fechamento com dois botões: comprar + WhatsApp.

### `Footer`
3 colunas: branding + WhatsApp, links de produto, links legais. CNPJ placeholder.

### `WhatsAppFloat`
Botão flutuante verde `#25D366` com SVG do WhatsApp. `animate-bounce-slow`.

## Ordem das seções na página

```
NavBar (fixed)
HeroSection
TrustBar
ContentSection
HardwareAndBoxSection  ← Hardware + O que vem na caixa (fusão)
HowItWorksSection
TestimonialsSection
CheckoutSection
FaqSection
FinalCtaSection
Footer
WhatsAppFloat
```

## Configuração central (`CONFIG`)

No topo de `page.tsx`, objeto `CONFIG` com todos os valores editáveis:

```ts
const CONFIG = {
  shopify: {
    scriptUrl: '...',
    domain: 'ntv-box.myshopify.com',
    storefrontToken: 'SEU_STOREFRONT_TOKEN',
    productId: 'SEU_PRODUCT_ID',
  },
  whatsapp: {
    number: '5511999999999', // ← substituir (DDI+DDD+número, sem espaços)
    message: 'Olá! Quero comprar o NTVBox. Pode me ajudar?',
  },
  price: 'R$ 399,00',
  priceInstallment: '12x R$ 38,21',
  delivery: 'Envio em até 24h',
}
```

**URL de compra dos botões "Comprar agora":** `https://ntv-box.myshopify.com/products/ntvbox` (abre em nova aba).

## SEO e metadados

Configurados em `layout.tsx`:
- Title e description otimizados para busca orgânica
- Open Graph completo (título, descrição, URL, imagem 1200×630)
- Twitter Card `summary_large_image`
- `robots: index + follow`
- **Schema.org JSON-LD**: `Product` (preço BRL, disponibilidade, avaliação 4.9/847) + `Organization`
- `lang="pt-BR"` no `<html>`
- Fontes pré-conectadas: Plus Jakarta Sans + Inter (Google Fonts)

## Pendente / próximos passos

- [ ] Substituir número de WhatsApp em `CONFIG.whatsapp.number`
- [ ] Adicionar CNPJ real no Footer
- [ ] Criar `/public/images/og-image.jpg` para Open Graph
- [ ] Criar `/public/images/logo.png`
- [ ] Configurar domínio em `layout.tsx` (substituir `https://ntv-box.com`)

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

## Copy — Mudanças Prioritárias

### H1 (HeroSection — tag pill + título)
```
ANTES:  "Android TV Box — Tecnologia Premium"  ← tag pill
        "Seu IPTV Favorito."                    ← H1
DEPOIS: tag pill pode manter "Android TV Box 4K"
        H1: "Canais, Filmes e Séries. Sem Mensalidade. Para Sempre."
```

### Subtítulo hero
```
ANTES:  "Pare de pagar caro em assinaturas! Acesse milhares de canais,
         filmes e séries do mundo todo por uma fração do preço."
DEPOIS: "A TV a cabo te cobra em média R$ 180 por mês — R$ 2.160 por ano.
         O NTVBox custa R$ 399 uma vez. Sem fidelidade. Sem mensalidade.
         O aparelho se paga em 2 meses e o resto é economia pura."
```

### CTAs — trocar para primeira pessoa
```
ANTES:  "Comprar agora — R$399"  (aparece 3x idêntico)
DEPOIS: Hero principal  → "Quero parar de pagar mensalidade →"
        Meio da página  → "Pedir meu NTVBox agora"
        FinalCtaSection → "Quero meu NTVBox com frete grátis →"
        WhatsApp CTA    → "Tirar dúvidas no WhatsApp antes de comprar"
```

### Urgência/escassez (adicionar perto do preço)
```
Adicionar próximo ao bloco de preço no CheckoutSection:
"Restam apenas 23 unidades neste preço"
ou
"Promoção válida enquanto durar o estoque"
```

### Trust bar sob CTA hero (HeroSection)
```
Adicionar imediatamente abaixo do botão "Comprar agora" no hero:
"⭐ 4,9/5 · 847 avaliações · 12 meses de garantia · Frete grátis"
```

### Sticky bar mobile (novo componente)
```
Novo componente fixo no rodapé (mobile only, CSS position:fixed bottom):
"Comprar agora — R$ 379,05 no Pix"
Visível durante todo o scroll.
```

### Headline TestimonialsSection
```
ANTES:  "O que dizem quem já tem NTVBox"  ← erro gramatical
DEPOIS: "2.400+ famílias brasileiras já trocaram a TV a cabo pelo NTVBox"
```

### Reordenar depoimentos (TestimonialsSection)
```
Ordem atual:    Carlos → Fernanda → Roberto → Patrícia → André → Juliana
Ordem sugerida: Patrícia (economizei R$200/mês) → Juliana (pai 68 anos) → demais
Motivo: depoimento com ROI explícito deve vir primeiro.
```

### FinalCtaSection
```
ANTES:  H2: "Garanta o seu NTVBox agora"
DEPOIS: H2: "Sua TV merece ser muito mais — e você merece parar de pagar por isso todo mês."
        Sub: "R$ 399 uma vez. R$ 0 por mês. Para sempre."
Micro-copy sob CTA: "Garantia de 12 meses · Troca em 7 dias · Enviado em 24h"
```

### FAQ — títulos das perguntas
```
"O NTVBox funciona em qualquer televisão?"  → "Funciona na minha TV atual?"
"É difícil de instalar e configurar?"        → "Preciso de técnico para instalar?"
"Posso baixar apps da Play Store?"          → "Netflix e YouTube funcionam normalmente?"
"O cartão TF já vem incluso?"               → "16GB é suficiente para os meus apps?"
"Qual a velocidade mínima recomendada?"     → "Minha internet é suficiente para 4K?"
"Qual a política de garantia e trocas?"     → "E se eu não gostar ou vier com defeito?"
"Como funciona o envio?"                    → "Quanto tempo demora para chegar?"
"Posso parcelar no cartão?"                 → "Posso parcelar sem juros?"
```

### HardwareAndBoxSection — copy de specs
```
Android TV 12.0:
ANTES:  "Sistema oficial do Google. Acesse a Play Store e baixe qualquer app."
DEPOIS: "Android TV 12.0 oficial (não clone) — Google Play Store completa,
         Google Assistant por voz, certificação para Netflix em 4K."
```

---

## SEO — Mudanças em layout.tsx

### Meta title
```
ANTES:  "NTVBox — Aparelho Android TV 4K | Canais, Filmes e Streaming"
DEPOIS: "NTVBox — Android TV Box 4K Sem Mensalidade | Canais ao Vivo, Filmes e Streaming"
```

### Meta description (155 caracteres)
```
"NTVBox Android TV Box 4K — R$ 399 pagamento único, zero mensalidade.
Acesse canais ao vivo, Netflix, YouTube e mais. 2.400+ clientes, 4,9/5.
Frete grátis para todo o Brasil."
```

### Schema.org JSON-LD (verificar se está completo)
```
Deve conter:
- Product: name, brand, offers.price (399), offers.priceCurrency ("BRL"),
           offers.availability, offers.priceValidUntil
- AggregateRating: ratingValue (4.9), reviewCount (847)
- FAQPage: todas as 8 perguntas do FaqSection
- Organization: name, url, contactPoint (WhatsApp)
```

---

## Âncora de ROI (adicionar na HeroSection ou ContentSection)
```
Box visual comparativo:
┌─────────────────────────────────────────────┐
│  TV a cabo: R$ 180/mês = R$ 2.160/ano       │
│  vs                                          │
│  NTVBox: R$ 399 — pagamento único            │
│  ✓ Paga-se sozinho em 2 meses               │
└─────────────────────────────────────────────┘
```

---

## Estratégia de Crescimento — Funcionalidades Futuras

### Prioridade alta
- **Captura de e-mail**: pop-up ou seção com lead magnet "10 apps gratuitos para sua NTVBox" → integrar Klaviyo/Mailchimp via Shopify
- **Programa de referral WhatsApp**: "Indique um amigo e ganhe R$ 50 de desconto"
- **Upsell no checkout**: Kit Família (2 unidades), cabo HDMI premium, suporte premium

### Prioridade média
- **Seção "NTVBox vs Concorrentes"**: tabela comparando vs Xiaomi Mi Box S e Amazon Fire TV Stick (Android TV oficial, suporte PT-BR, WhatsApp, preço)
- **Badge Reclame Aqui**: após criar perfil no RA, adicionar badge na página

### Prioridade SEO (após domínio próprio)
- Keywords alvo: "melhor tv box 4k 2026", "android tv box barato", "tv box sem mensalidade", "tv box com iptv brasil"
- Domínio recomendado: `ntvbox.com.br`

Relatório de copy completo: `C:\Users\ADM\COPY-SUGGESTIONS.md`
