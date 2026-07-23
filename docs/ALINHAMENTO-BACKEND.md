# Alinhamento App × Backend

O que o app mobile pede, o que o backend entrega, e onde os dois ainda não se
encontram. Atualizado em 2026-07-22.

Backend: `https://nima-backend-ofc.onrender.com/api` (fonte única em
`src/config/api.js`). Schema em `nima-backend/sql/*.sql`.

---

## 1. Resolvido nesta rodada

| Item | Como estava | Como ficou |
|---|---|---|
| `perfilCompleto` no login | O Login gravava `@nima_profile_completed` a partir de `data.user.perfilCompleto`, campo que **o backend nunca devolveu** — o convite ao questionário reaparecia para quem já tinha respondido | A Home pergunta a `GET /auth/relatorio` (404 = não respondeu). O login limpa a chave |
| Cargo `admin` | Login e `App.js` roteavam por `role === 'admin'`; o banco só tem `usuario`, `ong`, `desenvolvedor` | Removido. O app recusa `ong`/`desenvolvedor` no login |
| Pet do tutor | `animais.ong_id` era `NOT NULL` — impossível ter pet particular | Migração `015`: `animais.tutor_id` + `ong_id` nullable + CHECK de dono único. Rotas `/animais/meus` |
| Histórico da Patinha | `GET /animais/:id/leituras` exigia cargo `ong`/`desenvolvedor`; o tutor levava 403 no próprio pet | Liberado também para `animais.tutor_id = req.userId` |
| Guias | Texto fixo no app | Tabela `guias` + `GET /guias` (app) e CRUD `/dev/guias` (painel) |
| Patinhas por ONG | `tags.codigo` era único **global**, forçando numeração corrida entre todas as ONGs | `unique (ong_id, codigo)` + `tags.numero` (1..N por ONG) + `PUT /dev/ongs/:id/tags` define a quantidade total |
| URL da Patinha | `/tag/NIMA-0001` | `/tag/<slug-da-ong>/NIMA-0001` (`profiles.slug`). A rota antiga continua e devolve 409 se o código existir em mais de uma ONG |
| Escrita cruzada entre ONGs | `PUT /animais/:id/status\|vacinas\|smart-tag` não filtravam por `ong_id` | Corrigido com `.eq('ong_id', req.ongId)` |

---

## 2. Ainda desencontrado

### 2.1 Não existe no backend — o app contorna

**Progresso da vaquinha.** `vaquinhas` tem `meta`, mas **não tem `arrecadado`**.
Não há integração de pagamento: o PIX é da própria ONG e a doação acontece no
banco do doador, fora do app. Sem isso não existe "68% da meta", "R$ 3.850
arrecadados", "142 apoiadores" nem "12 dias restantes" — tudo isso era mock. A
tela hoje mostra só meta e o PIX copia-e-cola.
*Para existir de verdade:* coluna `arrecadado` + alguém confirmando o repasse
(a ONG declarando, ou um PSP com webhook).

**Categoria de campanha.** Os chips "Ração / Tratamento / Abrigos" não têm coluna.
Substituídos por busca textual.
*Para existir:* `vaquinhas.categoria`.

**Foto da campanha e da ONG.** `vaquinhas` e `profiles` não guardam imagem.
Os cards usam bloco de marca com ícone.
*Para existir:* `vaquinhas.foto_url` e `profiles.foto_url` + upload no Storage.

**Cidade da ONG.** Existe `endereco` (texto livre), não `cidade`. O "Campinas, SP"
do design não é filtrável.
*Para existir:* `profiles.cidade` e `profiles.uf`.

**Favoritos.** Não há tabela. Implementado em AsyncStorage
(`src/services/favoritos.js`) — some ao trocar de aparelho.
*Para existir:* tabela `favoritos (tutor_id, animal_id)`.

**Cuidados de hoje / rotina / documentos do pet.** Nada disso tem tabela.
Removido da tela Meu Pet.

**Notificações.** O sininho aparece em três telas e não faz nada — não há
tabela nem push configurado.

### 2.2 Existe no backend, o app ainda não usa

- `GET /ongs?lat=&lng=` calcula `distancia_km` e ordena por proximidade. O app
  **não pede localização** (não há lib de geolocalização instalada), então a
  lista vem sem distância e sem ordenação.
- `POST /tag/:codigo/leitura` registra a leitura **com coordenadas**. A tela
  SmartTag usa só o GET (sem geo), pelo mesmo motivo.
- `POST /animais/:id/fotos` (upload via multer para o Storage) existe, mas é
  rota de ONG. O tutor cadastra pet **sem foto** — falta um equivalente para
  `tutor_id`, e falta uma lib de seleção de imagem no app.
- `GET /animais/desaparecidos` já é consumido, mas o tutor **não consegue
  marcar o próprio pet como desaparecido** pelo app: `PUT /animais/:id/status`
  é rota de ONG. Deveria haver equivalente em `/animais/meus/:id`.

### 2.3 Limitações de plataforma

**Leitura NFC nativa.** A Patinha é NFC, mas o app não tem lib de NFC — o
código é **digitado** na tela SmartTag. O fluxo real (encostar o celular na
tag) hoje acontece pelo navegador, que abre a URL gravada na tag.

**Mapa das ONGs.** Sem `react-native-maps`. Endereço e coordenadas abrem no
app de mapas do aparelho via `Linking`.

**Login social.** Os botões Google/Facebook são "em breve" — não há OAuth
configurado no Supabase Auth nem rota no backend.

### 2.4 Divergências de regra

**"Meus pets" tem duas fontes.** Pet adotado vem de
`GET /solicitacoes/minhas` (status `aprovada` → `animal`); pet registrado vem de
`GET /animais/meus`. A tela junta as duas listas. Não há uma consulta única.

**Aprovar adoção não transfere a posse.** Quando a ONG aprova, o backend só
marca `animais.status_posse = 'Adotado'` — **não preenche `tutor_id`**. O pet
continua pertencendo à ONG no banco. É por isso que "meus pets" depende da
solicitação em vez do vínculo direto.
*Sugestão:* em `SolicitacaoController.decidir`, ao aprovar, setar
`tutor_id = sol.tutor_id` e `ong_id = null`.

**Espécie tem check apertado.** `animais.especie` só aceita `'Cão'` ou `'Gato'`
(migração 001). O app oferece "Cachorro" no questionário (campo livre, ok) mas
o cadastro de pet do tutor precisa mandar exatamente `Cão`/`Gato`.

**Questionário é tudo-ou-nada.** As 20 colunas de `questionarios` são
`NOT NULL`. O app divide em 5 essenciais + 15 opcionais, então as não
respondidas vão como `"Não informado"`. Isso **polui o texto que vai para a
IA** — o parecer vai citar "Não informado" várias vezes.
*Sugestão:* tornar as 15 opcionais nullable e o `questionarioController`
omitir do payload do n8n o que for nulo.

**`smart_tag_id` duplicado.** A migração 015 removeu a unicidade global de
`animais.smart_tag_id` (duas ONGs podem ter `NIMA-0001`). A fonte da verdade
do vínculo é a tabela `tags`, que tem `unique (ong_id, codigo)`. Código que
buscar animal por `smart_tag_id` sem filtrar ONG pode achar o pet errado —
hoje só o fallback legado do `lerTag` faz isso.

---

## 3. Pendências operacionais

- **A migração `015` ainda não foi aplicada.** Nada que dependa de
  `tutor_id`, `guias`, `tags.numero` ou `profiles.slug` funciona até rodar.
- **Senha do Postgres** continua pendente de rotação (foi usada em runtime nas
  migrações 012–014).
- **`VITE_API_URL` na Hostinger** ainda precisa apontar para
  `nima-backend-ofc.onrender.com`.
