## api_water — API de Monitoramento do Nível de Água

API em Node.js/Express com PostgreSQL para armazenar e expor dados de nível de água e estados de bombas/proteções.

### Requisitos
- Node.js 18+ e npm
- PostgreSQL 13+ (ou Docker)

### Instalação
```bash
npm ci
```

### Variáveis de Ambiente (.env)
Crie um arquivo `.env` na raiz de `api_water` com as credenciais do banco e a porta da API:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=water_level
```

### Banco de Dados
- Com Docker (recomendado para desenvolvimento):
```bash
docker compose -f db/docker-compose.yaml up -d
```
- Sem Docker: crie apenas o banco no PostgreSQL e aplique as migrações.

Aplicar migrações:
```bash
npm run migrate:latest
```

Consultar status das migrações:
```bash
npm run migrate:status
```

Estrutura principal criada pelas migrações (`db/migrations/knex`):
```sql
CREATE TABLE water (
  id SERIAL PRIMARY KEY,
  hour TIMESTAMP NOT NULL,
  wlevel INTEGER NOT NULL,
  pump1 BOOLEAN NOT NULL,
  pump2 BOOLEAN NOT NULL,
  protect_pump1 BOOLEAN,
  protect_pump2 BOOLEAN,
  pump_aux BOOLEAN,
  wvol INTEGER,
  state INTEGER
);
```

### Executar a API
Desenvolvimento (com hot reload via nodemon):
```bash
npm run dev
```
Produção:
```bash
npm start
```
A API iniciará em `http://localhost:${PORT}` (padrão `3000`).

### Endpoints
Base: `/api/nivel`

- `GET /api/nivel/` — lista os últimos registros (limite 100)
- `GET /api/nivel/last2h` — retorna buckets de 30 minutos das últimas 2 horas para gráficos
  - retorna: `[{ hour: string, wlevel: number }]`
- `GET /api/nivel/:id` — obtém um registro pelo `id` (apenas dígitos)
- `POST /api/nivel/` — cria novo registro via JSON
  - body: `{ "wlevel": number, "state": number, "pump_aux"?: boolean, "wvol"?: number }`
- `GET /api/nivel/insert?wlevel=50&state=32&pump_aux=true&wvol=100` — cria novo registro via query string (útil para testes)

Exemplos:
```bash
# Criar via POST
curl -X POST http://localhost:3000/api/nivel/ \
  -H "Content-Type: application/json" \
  -d '{"wlevel": 55, "state": 32, "pump_aux": true, "wvol": 100}'

# Inserir via GET (apenas para teste)
curl "http://localhost:3000/api/nivel/insert?wlevel=50&state=32&pump_aux=true&wvol=100"

# Obter dados para gráfico (últimas 2h, buckets de 30min)
curl http://localhost:3000/api/nivel/last2h

# Listar
curl http://localhost:3000/api/nivel/
```

### Detalhes de Implementação
- Servidor: `index.js` (Express, CORS, JSON)
- Rotas: `src/routes/waterRoutes.js`
- Controller: `src/controllers/waterController.js`
- Serviço: `src/services/waterService.js` (decodifica bits de `state` e registra `hour` com `moment-timezone`)
- Modelo: `src/model/waterModel.js` (operações SQL via `pg` e `config/db.js`)

### Observações
- Certifique-se que `DB_*` no `.env` batem com seu PostgreSQL/Docker.
- O front-end (`front_water`) consome `GET /api/nivel/` para indicadores e `GET /api/nivel/last2h` para o gráfico de histórico.
- O endpoint `/api/nivel/last2h` usa `generate_series` para garantir buckets de 30 minutos mesmo sem dados em alguns períodos.

### Scripts
- `npm run dev`: inicia em modo desenvolvimento com nodemon
- `npm start`: inicia em modo produção (Node)
- `npm run migrate:latest`: aplica migrações pendentes (Knex)
- `npm run migrate:status`: lista migrações aplicadas/pendentes
- `npm run migrate:rollback`: desfaz o último batch de migrações

### Licença
Uso interno/educacional. Ajuste conforme necessário.
