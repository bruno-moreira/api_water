-- Cria o banco de dados
CREATE DATABASE water_level;

-- Conecta ao banco (no psql use: \c watermon)
-- \c watermon  (se estiver usando o terminal psql)

-- Cria a tabela
CREATE TABLE water (
    id SERIAL PRIMARY KEY,
    hour TIMESTAMP NOT NULL,
    wlevel INTEGER NOT NULL,
    pump1 BOOLEAN NOT NULL,
    pump2 BOOLEAN NOT NULL,
    protect_pump1 BOOLEAN,
    protect_pump2 BOOLEAN,
    a1_contact_pump1 BOOLEAN,
    a1_contact_pump2 BOOLEAN,
    state INTEGER
);


<!-- http://localhost:3000/api/nivel/insert?wlevel=50&state=32