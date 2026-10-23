# VinxUp — código base

Base do aplicativo VinxUp (React Native + Expo Router + TypeScript + Firebase/Firestore).

## O que já vem pronto

- Rotas (`app/`): login (`index`), `cadastro` e `inicio`
- Telas (`src/telas/`): `TelaLogin`, `TelaCadastro`, `TelaInicio` (placeholder com botão Sair)
- Services (`src/services/`): `firebase.ts`, `UsuarioService.ts` (cadastro e busca por credenciais), `SessaoService.ts` (usuário logado em memória)
- `src/componentes/Cabecalho.tsx`, `src/types/Usuario.ts`, `src/utils/alerta.ts` (alerta que funciona na web e no celular)

## Como rodar

1. `npm install`
2. Copie `.env.example` para `.env` e preencha com as credenciais do **seu** projeto Firebase
3. Ative o Firestore no console do Firebase
4. `npm start` (ou `npm run web` / `npm run android` / `npm run ios`)

## Como adicionar uma nova funcionalidade

1. Crie o tipo em `src/types/`
2. Crie o service em `src/services/` (use `db` de `firebase.ts`)
3. Crie a tela em `src/telas/`
4. Crie o arquivo de rota em `app/` exportando a tela e registre em `app/_layout.tsx`

## Atenção

- A senha é salva em texto puro no Firestore (herança do projeto de aula). Antes de lidar com dados reais, migre para o Firebase Authentication.
