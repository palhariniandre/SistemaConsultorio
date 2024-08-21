const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Andre2404!',
    database: 'SistemaConsultorio'
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados.');
});

// Rota para lidar com login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;

    const query = 'SELECT * FROM Usuarios WHERE login = ? AND senha = ?';
    db.query(query, [login, senha], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Erro no servidor' });
            return;
        }

        if (results.length > 0) {
            // Login bem-sucedido
            res.json({ success: true, message: 'Login bem-sucedido' });
        } else {
            // Credenciais incorretas
            res.json({ success: false, message: 'Login ou senha incorretos' });
        }
    });
});

// Endpoint para buscar pacientes
app.get('/api/pacientes', (req, res) => {
    let sql = 'SELECT * FROM pacientes';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Servir os arquivos estáticos da pasta 'public'
app.use(express.static('pacientes'));
// Endpoint para cadastrar novo paciente
app.post('/api/pacientes', (req, res) => {
    const { nome, dataNascimento, telefone, convenio } = req.body;
    let sql = `INSERT INTO pacientes (nome, dataNascimento, telefone, convenio) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nome, dataNascimento, telefone, convenio], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ id: result.insertId, nome, dataNascimento, telefone, convenio });
    });
});


// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
