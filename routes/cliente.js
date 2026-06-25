const express = require('express');

const routes = express.Router();
const db = require('../dp/connect');

routes.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM cliente ORDER BY id_cliente');

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar clientes.', erro: error.message });
    }
});

routes.post('/', async (req, res) => {
    const {nome, email, cpf, telefone} = req.body;

    if (!nome || !email || !cpf || !telefone) {
        return res.status(400).json({mensagem: 'Todos os campos sao obrigatorios.'});
    }

    const sql = `
    INSERT INTO cliente(nome, email, cpf, telefone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;

    try {
        const result = await db.query(sql, [nome, email, cpf, telefone]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar cliente.', erro: error.message });
    }
});

routes.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {nome, email, cpf, telefone} = req.body;

    if (!nome || !email || !cpf || !telefone) {
        return res.status(400).json({mensagem: 'Todos os campos sao obrigatorios.'});
    }

    const sql = `
    UPDATE cliente
    SET nome = $1, email = $2, cpf = $3, telefone = $4
    WHERE id_cliente = $5
    RETURNING *
    `;

    try {
        const result = await db.query(sql, [nome, email, cpf, telefone, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({mensagem: 'Cliente nao encontrado.'});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar cliente.', erro: error.message });
    }
});

routes.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await db.query('DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({mensagem: 'Cliente nao encontrado.'});
        }

        res.status(200).json({mensagem: `Cliente com id ${id} apagado.`});
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao apagar cliente.', erro: error.message });
    }
});

module.exports = routes;
