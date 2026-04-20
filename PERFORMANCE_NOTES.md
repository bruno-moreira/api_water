# Fase 4 - Performance

## Status

- [x] Índice na coluna `hour` aplicado via migração (`idx_water_hour`).
- [x] Consulta de histórico ajustada para janela de 2 horas com buckets de 30 minutos (`last2h`).
- [x] Avaliação técnica de Fastify concluída.

## Avaliação: Express vs Fastify

### Cenário atual

- API com baixo número de rotas.
- Regra de negócio simples e I/O bound (PostgreSQL).
- Middlewares de segurança e documentação já estabilizados no Express.

### Ganhos esperados com Fastify

- Melhor throughput e menor overhead por requisição em cenários CPU-bound.
- Validação e serialização nativas com JSON Schema.

### Custos de migração agora

- Reescrita de bootstrap, plugins e parte da integração com Swagger/middlewares.
- Ajustes em testes e padronização de schemas.
- Benefício limitado no curto prazo, já que o principal gargalo tende a ser o banco.

## Decisão recomendada

Manter Express neste ciclo e priorizar:

1. Observabilidade (latência de queries e p95/p99 por endpoint).
2. Otimização de consultas e índices.
3. Caching seletivo se houver endpoints de leitura muito acessados.

Reavaliar migração para Fastify quando houver evidência de gargalo no layer HTTP (benchmark + métricas de produção).
