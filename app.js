const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const db = require('./dp/connect');

const hostname = process.env.APP_HOST || '127.0.0.1';
const port = Number(process.env.APP_PORT) || 3000;

const clienteRotas = require('./routes/cliente');
const eventoRotas = require('./routes/evento');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/cliente', clienteRotas);
app.use('/evento', eventoRotas);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

const server = app.listen(port, hostname, async () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);

  try {
    await db.query('SELECT 1');
    console.log('Conexao estabelecida com sucesso com o banco de dados.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
  }
});

server.on('error', (error) => {
  console.error('Erro ao iniciar o servidor:', error.message);
});
