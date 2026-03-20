# NTVBox Landing Page

## Como rodar localmente

```bash
cd ntvbox-landing
npm install
npm run dev
```
Acesse: http://localhost:3000

## Como fazer o deploy (recomendado: Vercel)

1. Crie uma conta em https://vercel.com
2. Instale a CLI: `npm i -g vercel`
3. Rode: `vercel` na pasta do projeto
4. Siga as instruções — deploy em menos de 2 minutos

## O que você precisa personalizar

### 1. Suas imagens (obrigatório)
Coloque suas imagens na pasta `/public/images/`:
- `ntvbox-product.png` — foto do produto (recomendado: fundo transparente)
- `logo.png` — logo da NTVBox
- `og-image.jpg` — imagem para redes sociais (1200×630px)

Depois descomente as linhas com `<Image>` no código e remova os blocos placeholder.

### 2. Integração Shopify (obrigatório para vender)
Em `app/page.tsx`, no topo do arquivo, preencha:
```js
const CONFIG = {
  shopify: {
    domain: 'SEU-DOMINIO.myshopify.com',
    storefrontToken: 'SEU_STOREFRONT_TOKEN',
    productId: 'SEU_PRODUCT_ID',
  },
  whatsapp: {
    number: '5511999999999', // seu número real
  }
}
```

Para pegar o código do Shopify Buy Button:
1. Shopify Admin > Canais de Vendas > Buy Button
2. Crie um botão para o produto NTVBox
3. Cole o código gerado dentro do `<div id="shopify-buy-button-container">`

### 3. CNPJ no rodapé
No componente `Footer`, substitua `XX.XXX.XXX/0001-XX` pelo seu CNPJ real.

### 4. Depoimentos reais
No componente `TestimonialsSection`, substitua os depoimentos de exemplo
pelos depoimentos reais dos seus clientes.

### 5. Número de assinantes
Na seção Hero e Depoimentos, atualize os números para refletir
a realidade do seu negócio.

## Estrutura do projeto

```
ntvbox-landing/
├── app/
│   ├── layout.tsx      ← SEO, meta tags, schema.org
│   ├── page.tsx        ← Landing page completa
│   └── globals.css     ← Estilos e animações
├── public/
│   └── images/         ← Coloque suas imagens aqui
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## Seções da landing page

1. **Banner topo** — frete grátis, envio 24h, garantia
2. **Navbar** — com menu mobile responsivo
3. **Hero** — headline, preço, CTAs, prova social
4. **Barra de confiança** — avaliações, garantia, entrega
5. **O que vem na caixa** — 5 itens visuais
6. **Conteúdo** — canais, filmes, streaming, esportes
7. **Recursos** — specs técnicas em cards
8. **Ficha técnica** — tabela completa de specs
9. **Como funciona** — 3 passos simples
10. **Depoimentos** — 6 avaliações com estrelas
11. **Checkout** — integração Shopify + métodos de pagamento
12. **FAQ** — 8 perguntas/respostas com accordion
13. **CTA final** — última chamada para compra
14. **Rodapé** — links, CNPJ, pagamentos
15. **WhatsApp flutuante** — botão fixo no canto
