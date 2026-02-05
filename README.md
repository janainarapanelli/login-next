# 🔒 Sistema de Autenticação Next.js – API Interna (Server-Side)

**Versão**: 2.0.0
**Data**: 2026-02-05
**Classificação de Segurança**: 🟢 **PRONTO PARA PRODUÇÃO**

---

## 📊 Resumo Executivo

Sistema de autenticação **server-side** para Next.js 14+ utilizando **API Routes internas**, cookies **HttpOnly** e validação de **JWT** via middleware.

Não há uso de Server Actions para login. Toda autenticação é feita via **`/api/auth/login`**, permitindo reutilização por outros clientes (mobile, apps, etc.) sem expor tokens ao JavaScript.

---

## 🛡️ Status de Segurança

| Categoria        | Status         | Detalhes                |
| ---------------- | -------------- | ----------------------- |
| Tokens no Client | ✅ Nenhum       | Apenas cookies HttpOnly |
| XSS              | ✅ Protegido    | HttpOnly cookies        |
| CSRF             | ✅ Forte        | sameSite: 'strict'      |
| JWT Validation   | ✅ Implementada | Middleware              |
| Arquitetura      | ✅ Server-Side  | API + Middleware        |
| Produção         | ✅ Ready        | Testado                 |

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────┐
│                Client Layer                 │
│  ┌───────────────────────────────────────┐ │
│  │ LoginForm.tsx (Client Component)       │ │
│  └───────────────┬───────────────────────┘ │
└──────────────────┼─────────────────────────┘
                   │ fetch POST
                   ▼
┌─────────────────────────────────────────────┐
│                API Layer                    │
│  ┌───────────────────────────────────────┐ │
│  │ /api/auth/login (POST)                │ │
│  │ - valida input                        │ │
│  │ - chama authService                  │ │
│  │ - seta cookie HttpOnly               │ │
│  └───────────────┬───────────────────────┘ │
└──────────────────┼─────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              Service Layer                  │
│        authService.authenticateUser         │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│            API Externa / Provider           │
│              (dummyjson / real)             │
└─────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                 Middleware                  │
│        Validação JWT + Proteção de Rotas    │
└─────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts      🔐 Login API
│   │       └── logout/
│   │           └── route.ts      🚪 Logout API
│   │
│   ├── (auth)/login/
│   │   ├── page.tsx              📄 Página de login
│   │   └── LoginForm.tsx         🎨 Form client-side
│   │
│   └── dashboard/page.tsx        🛡️ Página protegida
│
├── services/
│   └── authService.ts            🌐 Integração com API externa
│
└── middleware.ts                 🛡️ Guard de autenticação
```

---

## 🔄 Fluxo de Autenticação

### 1️⃣ Login

```
User
  │
  ▼
LoginForm (Client)
  │
  ├─ fetch('/api/auth/login', POST)
  │
  ▼
/api/auth/login
  │
  ├─ Valida username/password
  ├─ authService.authenticateUser()
  ├─ Recebe refreshToken
  ├─ Seta cookie HttpOnly
  │
  ▼
Response 200
  │
  ▼
Client → router.push('/dashboard')
```

---

### 2️⃣ Proteção de Rotas

```
Request /dashboard
  │
  ▼
Middleware
  │
  ├─ Cookie refreshToken existe?
  ├─ JWT válido?
  ├─ exp não expirado?
  │
  ├─ NÃO → redirect('/login')
  └─ SIM → allow
```

---

### 3️⃣ Logout

```
Client
  │
  ├─ fetch('/api/auth/logout', POST)
  │
  ▼
/api/auth/logout
  │
  ├─ Remove cookie refreshToken
  └─ 200 OK
```

---

## 🔐 API – Login

**Endpoint**: `POST /api/auth/login`

### Request

```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

### Response

```json
{ "success": true }
```

### Comportamento

* Validação forte de input
* Cookie `refreshToken`:

  * HttpOnly
  * sameSite: strict
  * secure (produção)
  * 7 dias

---

## 🛡️ Middleware (JWT)

Responsável por:

* Validar existência do token
* Decodificar payload JWT
* Verificar expiração
* Bloquear acesso não autorizado

---

## 🔒 Análise de Segurança

### Implementado

* ✅ Tokens fora do JavaScript
* ✅ Proteção contra XSS
* ✅ Proteção CSRF
* ✅ Validação de expiração
* ✅ Defense in depth

---

## 🚀 Configuração

### `.env.local`

```bash
NEXT_PUBLIC_AUTH_API_URL=https://dummyjson.com/auth
NODE_ENV=development
```

---

## 🧪 Testes

* Login válido → `/dashboard`
* Cookie presente → acesso permitido
* Cookie removido → redirect `/login`
* Token corrompido → redirect `/login`

---

## 📈 Evolução da Arquitetura

### Antes

* Server Actions para login
* Fluxo acoplado ao React

### Agora

* API interna desacoplada
* Reutilizável (web / mobile)
* Melhor separação de responsabilidades

---

## 🏁 Conclusão

### 🟢 Arquitetura segura, escalável e pronta para produção

* API-first
* Server-side
* Zero exposição de tokens
* Fácil manutenção

**Recomendado para aplicações reais em produção** 🚀
