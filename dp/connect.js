/**
 * Configuração de conexão com o banco dados.
 */

//Importação dos módulos
//módulo Pool
const {Pool} = require('pg');
//módulo dotenv
require('dotenv').config();

//criar uma instância para as conexões do Pool
const pool = new Pool({
    //Nome do usuário do banco
    user: process.env.DB_USER,
    //Endereço do servidor do banco
    host: process.env.DB_HOST,
    //Nome do banco de dados
    database: process.env.DB_NAME,
    //Senha do usuário do banco
    password: process.env.DB_PASSWORD,
    //Porta usada pelo banco
    port: process.env.DB_PORT,
});

module.exports = pool;