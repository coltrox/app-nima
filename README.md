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
