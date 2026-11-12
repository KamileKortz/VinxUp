# VinxUp (aplicativo)

React Native + Expo Router + TypeScript + Firebase (Auth e Firestore), seguindo a estrutura das aulas (SDK 54, `app/` só com rotas, telas em `src/telas/`, acesso a dados em `src/services/`).

## Como rodar

1. `npm install`
2. Copie `.env.example` para `.env` e preencha com as credenciais do **seu** projeto Firebase (Console do Firebase > Configurações do projeto > Seus apps > Web). Se você já tinha um `.env`, é só copiá-lo para esta pasta.
3. No console do Firebase:
   - **Authentication > Sign-in method:** ative **Email/Password**.
   - **Firestore Database:** crie o banco, se ainda não existir.
   - **Firestore > Regras:** cole o conteúdo de `firestore.rules` e publique. **Esse passo é o que garante que o responsável não consegue ler o conteúdo privado da criança.**
4. `npx expo start --clear` (use `--clear` sempre que mexer no `.env`).

## Roteiro de teste

1. Em "Sou responsável", clique em **Cadastre-se** e crie a conta (cai no Painel).
2. No Painel, **Cadastrar criança** (email e senha da criança).
3. **Sair** e entrar em "Sou usuário" com o email e a senha da criança.
4. Faça a atividade 1 da trilha (responda as perguntas, escolha o sentimento). Para testar o aviso, responda "Nervosismo enorme" em tudo.
5. **Sair**, entre como responsável e abra a criança no Painel: aparecem atividades concluídas, nível de ansiedade e último acesso, mas **não** as respostas, anotações nem o Amigo.
6. Para testar o vínculo de um segundo responsável: crie outro responsável e use **Vincular com código** (o código aparece no Perfil da criança e na tela de acompanhamento).

## Estrutura

```text
app/                       # rotas (só pontes para as telas)
src/
├── componentes/           # BalaoLontra, BarraNavegacao, AlertaAnsiedade, ...
├── telas/                 # uma tela por arquivo
├── services/              # firebase, sessão, usuário, vínculo, progresso, diário, amigo, acesso, trilha
├── types/                 # Usuario, Vinculo, Progresso, Diario, Amigo, Atividade, ...
└── utils/                 # alerta, ansiedade (pontuação), datas, tema
firestore.rules            # regras de segurança (publicar no console)
```

## Pontos de atenção

- **Pontuação e limite de alerta:** estão em `src/utils/ansiedade.ts` (0 a 3 pontos por pergunta; alerta a partir de 50% da pontuação máxima, espelhando o corte do mini-SPIN). São valores iniciais: valide o ponto de corte com a orientadora/psicóloga. O app não faz diagnóstico.
- **Conteúdo das atividades** (`src/services/TrilhaService.ts`) é de exemplo, para revisão.
- **Contas antigas:** documentos de `usuarios` criados na versão anterior (com senha gravada no Firestore) não têm conta no Firebase Auth. Apague-os no console e cadastre de novo.
- **Cadastro de criança:** se a criança for criada mas o vínculo falhar (ex.: queda de internet), o email dela fica "em uso". Nesse caso, apague a conta em Authentication no console e tente de novo.
- O código de vínculo é gerado com `Math.random` (suficiente para protótipo; use geração segura antes de produção).
