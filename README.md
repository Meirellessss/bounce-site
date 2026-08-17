# Agência Bounce — Site + Admin

Site institucional da Agência Bounce com carrossel de projetos e painel administrativo para conectar sites (hospedados em qualquer lugar) que aparecem no portfólio.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (auth + Postgres) · Embla Carousel · Framer Motion
- **Produção:** https://bounceoficial.vercel.app

---

## Rodar localmente

**Pré-requisitos:** Node.js 18+ instalado.

```bash
# 1. instalar dependências
npm install

# 2. criar o arquivo de ambiente a partir do exemplo
cp .env.local.example .env.local
# depois preencha os valores (ver seção abaixo)

# 3. rodar em modo desenvolvimento
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

| Variável | Onde encontrar |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |

> As chaves reais **não** ficam no repositório (estão no `.gitignore`). Peça os valores para o Kaio.

## Painel administrativo

- Acesse `/admin` (ex.: https://bounceoficial.vercel.app/admin).
- Login por e-mail e senha (Supabase Auth).
- No painel dá pra **adicionar, editar, reordenar e remover** projetos do carrossel. Ao adicionar um site, o screenshot é gerado automaticamente.

## Estrutura

```
app/            rotas (home + /admin)
components/     Header, Showcase, Carrossel, Footer, FloatingWhatsApp, admin/
lib/            supabase (client/server), contato, screenshot, tipos
public/brand/   logos da Bounce
```

## Deploy

Deploy contínuo na Vercel. As mesmas variáveis de ambiente precisam estar cadastradas no projeto da Vercel (Settings → Environment Variables).
