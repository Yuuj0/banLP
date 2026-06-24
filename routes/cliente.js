//importar os módulos
//express
const express = require('express');
//Criar um roteador do express para definir as rotas separadamente
//do app principal
const routes = express.Router();
//importar a conexão com o banco de dados PostgreSQL
const db = require('../db/connect');

//--------------------------------------------------------------------
//ROTA GET
routes.get('/', async (req, res) => {
    //Realizar a consulta no banco de dados usando SQL.
    const result = await db.query('SELECT * FROM cliente');

    //Responde com os dados da consulta
    res.status(200).json(result.rows);
});

//------------------------------------------------------------------
//ROTA POST

routes.post('/', async (req, res)=> {
    
    const {nome, emaill, telefone, endereco, cidade, uf} = req.body;
    if(!nome || !emaill || !telefone || !endereco || !cidade || !uf){
        return res.status(400).json({mensage: 'todos os campos obrigatorios.'})
    }

    const sql = `
    INSERT INTO cliente(nome, emaill, telefone, endereco,  cidade, uf)
    VALUES ($1, $2, $3, $4, $6)
    RETURNING * 
    `;
    const valores = [nome, emaill, telefone, endereco, cidade, uf];
    const result = await db.query(sql, valores); 

    res.status(201).json(result.rows[0])
})

routes.put('/:id', async (req, res) => {
    const{id} = req.params

    if (!id) {
        return res.status(400).json({mansagem: 'id do cliente é obrigatorio'})
    };
    const {nome, emaill, telefone, endereco, cidade, uf} = req.body;

    const {nome, emaill, telefone, endereco, cidade, uf} = req.body;
    if(!nome || !emaill || !telefone || !endereco || !cidade || !uf){
        return res.status(400).json({mensage: 'todos os campos obrigatorios.'})
    };

    const sql = `
    UPDATE clienteRota
    SET nome = $1, emaill = $2, telefone = $3, endereco = $4, cidade = $5, uf = %6
    WHERE ID = $7
    RETURNING *
    `;
    const valores = [nome, emaill, telefone, endereco, cidade, uf];
    const result = await db.query(sql, valores); 

    if (result.rows.length === 0) {
        return res.status(404).json({menasgem: 'cliente não encontrado'})
    }


    res.status(201).json(result.rows[0])



})

routes.delete('/:id', async (req, res) =>{
    const {id} = req.params;

     if (!id) {
        return res.status(400).json({mansagem: 'id do cliente é obrigatorio'})
    };
    const sql = `
    DELETE FROM cliente
    WHERE id = $1
    RETURNING *
    `;
    
    const valores = [id];

    const result = await db.query(sql, valores)

    if (result.rows.length === 0) {
        return res.status(404).json({menasgem: 'cliente não encontrado'})
    }

    res.status(200).json({mensagem: `cliente com id ${id} apagado`})



}
)

module.exports = routes;