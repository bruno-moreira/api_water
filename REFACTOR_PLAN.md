Roteiro de Refatoração: API Monitoramento de Água
1. Contexto Atual do Projeto
O sistema é uma API em Node.js com Express e PostgreSQL para monitoramento de sensores.

Estrutura: MVC simplificado com rotas em src/routes/waterRoutes.js e lógica de decodificação de bits em src/services/waterService.js.

Banco de Dados: PostgreSQL com uma tabela water contendo colunas para wlevel, pump1, pump2, e um campo state que armazena flags binárias.

Documentação: Swagger integrado diretamente no arquivo principal index.js.

Dependências principais: express, pg, dotenv, moment-timezone, swagger-ui-express.

2. Instruções de Refatoração (Prompt para a IA)
Instrução: "Atue como um Desenvolvedor Sênior e refatore o código fornecido seguindo os pontos abaixo, priorizando segurança, escalabilidade e performance."

Fase 1: Arquitetura e Configuração

Validação de Ambiente: Crie um arquivo src/config/env.js usando uma biblioteca como Zod ou envalid para validar se as variáveis do .env_example (como DB_PASSWORD, PORT) estão presentes e com o tipo correto antes de iniciar o servidor.

Isolamento do Swagger: Mova toda a configuração de swaggerDefinition do index.js para src/config/swagger.js.

Middlewares de Segurança: Instale e configure o helmet para proteção de headers e o express-rate-limit para evitar abusos nos endpoints de inserção.

Fase 2: Banco de Dados e Confiabilidade
Gerenciamento de Conexões: Certifique-se de que a conexão com o PostgreSQL utilize um Pool de conexões para otimizar o reaproveitamento de recursos.

Queries Parametrizadas: Garanta que todas as consultas SQL no waterModel.js utilizem parâmetros ($1, $2) para prevenir ataques de SQL Injection.

Scripts de Migração: Recomende a substituição do bd.sql manual por uma ferramenta de migração como Knex.js ou Prisma.

Fase 3: Lógica de Negócio e Validação
Validação de Input: Crie um middleware de validação para a rota POST /api/nivel/ que garanta que wlevel seja um número entre 0 e 100 e state seja um inteiro válido.

Tratamento de Erros Global: Remova blocos try/catch repetitivos e implemente um errorHandler centralizado no index.js para capturar exceções e retornar respostas padronizadas em JSON.


Logger Estruturado: Substitua os console.log do index.js e dos controllers por uma biblioteca de log profissional como Pino ou Winston, permitindo salvar logs em arquivos como definido no .gitignore.

Fase 4: Performance (Opcional, mas Recomendada)
Avaliação de Framework: Analise a substituição do Express pelo Fastify para ganhar performance na serialização de JSON e validação nativa com JSON Schema.

Otimização de Query: Adicione um índice (INDEX) na coluna hour da tabela water para acelerar a consulta last4h em grandes volumes de dados.

3. Lista de Verificação (Checklist Sênior)
Ao final da refatoração, o projeto deve conter:

[ ] Dockerfile para a aplicação e não apenas para o banco.

[ ] Unit Tests para a função de decodificação de bits no waterService.

[ ] Graceful Shutdown implementado (fechar conexões do banco ao receber SIGTERM).

[ ] ESLint e Prettier configurados no package.json.

[ ] Separação clara entre as camadas de Route, Controller, Service e Model.