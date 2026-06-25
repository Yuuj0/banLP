const express = require('express');

const routes = express.Router();
const db = require('../dp/connect');

routes.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM produto ORDER BY id');

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar produtos.', erro: error.message });
    }
});

routes.post('/', async (req, res) => {
    const {nome, marca, preco, peso} = req.body;

    if (!nome || !marca || preco === undefined || peso === undefined) {
        return res.status(400).json({mensagem: 'Todos os campos sao obrigatorios.'});
    }

    const sql = `
    INSERT INTO produto(nome, marca, preco, peso)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    const valores = [nome, marca, preco, peso];

    try {
        const result = await db.query(sql, valores);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar produto.', erro: error.message });
    }
});

routes.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {nome, marca, preco, peso} = req.body;

    if (!id) {
        return res.status(400).json({mensagem: 'Id do produto e obrigatorio.'});
    }

    if (!nome || !marca || preco === undefined || peso === undefined) {
        return res.status(400).json({mensagem: 'Todos os campos sao obrigatorios.'});
    }

    const sql = `
    UPDATE produto
    SET nome = $1, marca = $2, preco = $3, peso = $4
    WHERE id = $5
    RETURNING *
    `;
    const valores = [nome, marca, preco, peso, id];

    try {
        const result = await db.query(sql, valores);

        if (result.rows.length === 0) {
            return res.status(404).json({mensagem: 'Produto nao encontrado.'});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar produto.', erro: error.message });
    }
});

routes.delete('/:id', async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({mensagem: 'Id do produto e obrigatorio.'});
    }

    const sql = `
    DELETE FROM produto
    WHERE id = $1
    RETURNING *
    `;

    try {
        const result = await db.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({mensagem: 'Produto nao encontrado.'});
        }

        res.status(200).json({mensagem: `Produto com id ${id} apagado.`});
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao apagar produto.', erro: error.message });
    }
});

module.exports = routes;
