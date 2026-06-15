# Configuração de Segurança em Produção

Não grave chaves reais no Git. Configure os valores abaixo no `.env` do servidor ou no painel da hospedagem.

## Variáveis necessárias

```env
SITE_URL=https://larfranciscofranco.com.br
VITE_SITE_URL=https://larfranciscofranco.com.br

SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Supabase

No dashboard do Supabase:

1. Vá em **Authentication > URL Configuration**.
2. Em **Site URL**, use `https://larfranciscofranco.com.br`.
3. Em **Redirect URLs**, adicione:
   - `https://larfranciscofranco.com.br/auth`
   - `https://larfranciscofranco.com.br/reset-password`
   - `https://larfranciscofranco.com.br/**`
4. Para CAPTCHA, vá em **Project Settings > Authentication > Bot and Abuse Protection**.
5. Ative **Enable CAPTCHA protection**, escolha **Cloudflare Turnstile** e informe a secret key.

## Hostinger

Depois de gerar o build, publique o conteúdo de `dist/` em `public_html`.

Garanta permissão de escrita para:

- `public_html/news`
- `public_html/docs`
- `public_html/uploads`
- `public_html/sitemap.xml`
- `public_html/.rate-limit` (a API cria esta pasta automaticamente)

## Observações

- `SUPABASE_SERVICE_ROLE_KEY` fica somente no servidor. Nunca use essa chave em código frontend.
- O painel de usuários depende de `SUPABASE_SERVICE_ROLE_KEY`.
- Login e recuperação de senha usam `VITE_TURNSTILE_SITE_KEY` no frontend e a validação do Supabase precisa estar ativa no dashboard.
- O formulário de contato valida `TURNSTILE_SECRET_KEY` diretamente no PHP.
