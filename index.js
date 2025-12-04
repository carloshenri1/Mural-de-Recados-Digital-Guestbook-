const express = require('express');

const mysql = require('mysql2/promise');

const cors = require('cors');

 

const app = express();

const port = 3000;

 

// Middlewares

app.use(cors());

app.use(express.json()); // Essencial para o Express entender o JSON do req.body

app.use(express.static('public')); // Servir nosso frontend estático

 

// Configuração do Banco de Dados

// (Lembre os alunos de alterarem para suas credenciais)

const dbConfig = {

    host: 'localhost',

    user: 'root',

    password: 'flamingo', // <-- MUDAR AQUI

    database: 'mural_db'           // <-- MUDAR AQUI

};

 

// --- NOSSAS ROTAS DE API ---

 

// [GET] /api/mensagens

// Rota para BUSCAR todas as mensagens

app.get('/api/mensagens', async (req, res) => {

    try {

        const connection = await mysql.createConnection(dbConfig);

       

        // Buscamos as mensagens ordenando pela data_criacao DESC (mais nova primeiro)

        const query = 'SELECT * FROM tbl_mensagens ORDER BY data_criacao DESC';

        const [rows] = await connection.execute(query);

       

        await connection.end();

        res.json(rows);

 

    } catch (error) {

        console.error('Erro ao buscar mensagens:', error);

        res.status(500).json({ message: 'Erro ao buscar mensagens.' });

    }

});

 

// [POST] /api/mensagens

// Rota para CRIAR uma nova mensagem

app.post('/api/mensagens', async (req, res) => {

    // Pegamos 'autor' e 'mensagem' do corpo (body) da requisição

    const { autor, mensagem } = req.body;

 

    // Validação simples

    if (!autor || !mensagem) {

        return res.status(400).json({ message: 'Autor e mensagem são obrigatórios.' });

    }

 

    try {

        const connection = await mysql.createConnection(dbConfig);

       

        const query = 'INSERT INTO tbl_mensagens (autor, mensagem) VALUES (?, ?)';

        const [result] = await connection.execute(query, [autor, mensagem]);

       

        await connection.end();

 

        // Retornamos o novo recado criado (incluindo o ID)

        res.status(201).json({ id: result.insertId, autor, mensagem });

 

    } catch (error) {

        console.error('Erro ao salvar mensagem:', error);

        res.status(500).json({ message: 'Erro ao salvar mensagem.' });

    }

});

 

// Iniciar o Servidor

app.listen(port, () => {

    console.log(`Servidor rodando em http://localhost:${port}`);

});