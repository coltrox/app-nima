# Nima Mobile App 🐾

O **Nima** é um ecossistema multiplataforma focado em qualificar, monitorar e apoiar os processos de adoção, manutenção pós-adoção e segurança antiperda de cães e gatos. O grande diferencial do projeto reside na integração de Inteligência Artificial para realizar o match comportamental preventivo entre tutores e pets, além do uso de Internet das Coisas (IoT) por meio de Smart Tags físicas para localização passiva.

Este repositório contém o código-fonte do **Aplicativo Mobile**, desenvolvido em React Native com Expo, voltado para os perfis de **Adotante, Tutor e ONGs**.

---

## 📱 Telas e Funcionalidades do App

Conforme o escopo do projeto, o aplicativo centraliza as seguintes funcionalidades distribuídas em seus respectivos fluxos de navegação:

### 1. Autenticação e Perfil (`src/screens/Auth`)
* **Cadastro e Validação:** Criação de conta para adotantes com upload seguro de documentos de identificação (RG/CPF) e comprovante de residência em estrita conformidade com a LGPD.
* **Segurança:** Login seguro com autenticação via token JWT e criptografia.

### 2. Fluxo do Adotante (`src/screens/App`)
* **Quiz Comportamental:** Questionário dinâmico de no mínimo 10 perguntas focado no estilo de vida e rotina do usuário.
* **Feed Inteligente:** Listagem de animais disponíveis ordenados de forma decrescente pela pontuação de afinidade gerada pela IA.
* **Solicitação de Adoção:** Envio do dossiê de candidatura diretamente para a ONG responsável pelo pet.

### 3. Pós-Adoção e Cuidados (`src/screens/App`)
* **Área "Meu Pet":** Central de guias automatizados com especificações técnicas da raça, cronograma de cuidados, suporte nutricional de rações por idade e tutoriais de adestramento básico.
* **Histórico da Smart Tag:** Painel para o tutor consultar os logs e o mapa com o histórico de coordenadas de onde e quando a tag do animal foi escaneada.
* **Mural de Desaparecidos:** Registro colaborativo integrado para sinalizar animais perdidos na comunidade.

### 4. Integração com ONGs (`src/screens/Ong`)
* **Mapa Interativo:** Visualização geográfica de ONGs terceiras mais próximas utilizando a geolocalização do dispositivo.
* **Engajamento e Suporte:** Links dinâmicos externos para contato via WhatsApp/Redes Sociais, aba de inscrição para voluntariado e gerador de chave/QR Code PIX para doações financeiras diretas.
* **Configuração de Smart Tags:** Interface dedicada para vincular e gravar o ID de uma Smart Tag física (NFC/QR Code) a um animal específico.

---

## 📁 Estrutura de Diretórios

A arquitetura de arquivos do projeto está organizada da seguinte forma dentro do diretório principal:

```text
APP-NIMA/
├── .expo/                  # Configurações e cache internos do Expo
├── assets/                 # Imagens, ícones, fontes e mídias estáticas
├── node_modules/           # Dependências e pacotes Node.js instalados
├── src/                    # Código-fonte principal da aplicação
│   ├── screens/            # Módulos e telas divididos por contextos
│   │   ├── App/            # Telas principais (Feed, Quiz, Meu Pet, Desaparecidos)
│   │   ├── Auth/           # Fluxo de Login, Cadastro e recuperação de senha 
│   │   ├── components/     # Componentes reaproveitáveis globais ou locais
│   │   └── Ong/            # Mapa de ONGs, Doações (PIX), Voluntariado e Smart Tags
│   └── theme/              # Configurações de cores, tipografia e estilos globais
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── App.js                  # Ponto de entrada e inicialização do aplicativo Expo
├── app.json                # Arquivo de configuração de manifesto do Expo
├── babel.config.js         # Configurações de transpilação do Babel
├── index.js                # Arquivo de registro do componente raiz
├── package-lock.json       # Histórico de versões exatas das dependências
└── package.json            # Manifesto do projeto e scripts de execução
```

## 📡 Hardware & Recursos Nativos — Reportar Avistamento

Fluxo criado para a atividade **The Code Challenge (Nível Júnior)**. No **Mural de Desaparecidos**, o tutor que viu um animal toca em **Reportar avistamento**, descreve o animal, tira uma foto, marca a localização e envia. Tudo fica salvo no aparelho.

| Requisito | Onde está | Como funciona |
| :--- | :--- | :--- |
| **Júnior: permissão da câmera negada** | `src/screens/App/Avistamento/index.jsx` | `requestCameraPermissionsAsync()`: se `canAskAgain` for `false` ("Não perguntar novamente"), em vez de um alerta genérico a tela mostra o passo a passo e o botão **Abrir configurações** (`Linking.openSettings()`); ao voltar ao app, a permissão é conferida de novo. |
| **RF01** Histórico local | `src/services/avistamentos.js`, `src/screens/App/MeusAvistamentos` | AsyncStorage (chave `@nima_avistamentos`). A tela *Meus avistamentos* funciona sem internet. |
| **RF02** Precisão do GPS | `src/screens/components/PrecisaoGps` | `coords.accuracy`: 🟢 < 10 m · 🟡 10–30 m · 🔴 > 30 m. |
| **RNF01** Degradação graciosa | Avistamento | GPS desligado (`hasServicesEnabledAsync`), permissão negada, sem câmera ou GPS sem sinal (timeout de 15 s e depois a última posição conhecida): cada caso mostra uma mensagem, e nada derruba o app. |
| **RNF02** Responsividade | Avistamento, MeusAvistamentos, Desaparecidos | `orientation: default`; `useWindowDimensions` troca para 2 colunas em paisagem e a grade do mural se ajusta de 2 a 4 colunas. |

### Como rodar

```bash
npm install
npx expo start
```

1. Instale o **Expo Go** no celular (Android ou iOS), na mesma rede Wi-Fi do computador.
2. Leia o QR Code do terminal.
3. Faça login como tutor → **Mural de desaparecidos** → **Reportar avistamento**.

**Roteiro de teste**
* **Não perguntar novamente:** negue a câmera duas vezes (Android) ou desative em Ajustes (iOS) → aparecem as instruções e o botão das configurações. No Expo Go as configurações abertas são as do próprio Expo Go.
* **GPS:** desligue a localização → aparece a mensagem de GPS desligado; ligue e toque em *Atualizar* → o selo colorido aparece.
* **Offline:** ative o modo avião e abra *Meus avistamentos*.
* **Paisagem:** gire o aparelho (a rotação automática precisa estar ligada).

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas para garantir alta performance, modularidade e facilidade de manutenção:

| Componente | Tecnologia | Descrição / Papel no Projeto |
| :--- | :--- | :--- |
| **Framework Principal** | `React Native` | Desenvolvimento de interface nativa multiplataforma. |
| **Ambiente** | `Expo` | Workflow gerenciado para acelerar o desenvolvimento e testes. |
| **Estilização** | `StyleSheet` | Linguagem de estilos padrão (CSS-in-JS) para layouts flexíveis e customizados. |
| **Comunicação** | `Axios` / `Fetch API` | Consumo de dados e integração com os serviços do back-end. |
