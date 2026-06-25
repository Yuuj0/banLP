const express = require('express');

const routes = express.Router();
const db = require('../dp/connect');

routes.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM eventos ORDER BY data_evento, id_eventos');

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar eventos.', erro: error.message });
    }
});

routes.post('/', async (req, res) => {
    const {nome, categoria, descricao, data_evento, local, vagas} = req.body;

    if (!nome || !categoria || !descricao || !data_evento || !local || vagas === undefined) {
        return res.status(400).json({ mensagem: 'Todos os campos sao obrigatorios.' });
    }

    const sql = `
    INSERT INTO eventos(nome, categoria, descricao, data_evento, local, vagas)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `;
    const valores = [nome, categoria, descricao, data_evento, local, vagas];

    try {
        const result = await db.query(sql, valores);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar evento.', erro: error.message });
    }
});

routes.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {nome, categoria, descricao, data_evento, local, vagas} = req.body;

    if (!nome || !categoria || !descricao || !data_evento || !local || vagas === undefined) {
        return res.status(400).json({ mensagem: 'Todos os campos sao obrigatorios.' });
    }

    const sql = `
    UPDATE eventos
    SET nome = $1, categoria = $2, descricao = $3, data_evento = $4, local = $5, vagas = $6
    WHERE id_eventos = $7
    RETURNING *
    `;
    const valores = [nome, categoria, descricao, data_evento, local, vagas, id];

    try {
        const result = await db.query(sql, valores);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Evento nao encontrado.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar evento.', erro: error.message });
    }
});

routes.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await db.query('DELETE FROM eventos WHERE id_eventos = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Evento nao encontrado.' });
        }

        res.status(200).json({ mensagem: `Evento com id ${id} apagado.` });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao apagar evento.', erro: error.message });
    }
});

module.exports = routes;
