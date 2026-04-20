# Estratégia de Migrações

O projeto agora usa **Knex.js** para versionar mudanças de schema no PostgreSQL.

## Estado atual

- Arquivo de configuração do Knex: `knexfile.cjs`.
- Migrações versionadas em `db/migrations/knex/`.
- Migração inicial de criação da tabela `water`.
- Migração de índice em `hour` (`idx_water_hour`) para melhorar consultas temporais.

## Comandos

```bash
# Aplicar todas as migrações pendentes
npm run migrate:latest

# Ver histórico de migrações (aplicadas e pendentes)
npm run migrate:status

# Desfazer o último batch de migração
npm run migrate:rollback
```

## Observações

- `db/init.sql` pode ser mantido como referência local, mas o fluxo recomendado é via migrações do Knex.
- Para deploy, rode `npm run migrate:latest` antes de subir a aplicação.
