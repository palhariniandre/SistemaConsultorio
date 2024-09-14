const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: '192.168.0.16', // Endereço IP do servidor do banco de dados
    port: 3306, // Porta do banco de dados MySQL
    user: 'dede',
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

// Endpoint para buscar as consultas
app.get('/api/consultas', (req, res) => {
    const data = req.query.data; // Recebe a data no formato AAAA-MM-DD

    if (!data) {
        return res.status(400).send('Data não fornecida');
    }

    // Query para buscar as consultas na data especificada
    let sql = `SELECT c.idconsulta, p.nome, c.dataHora, c.tipoConsulta, c.convenio FROM consultas c JOIN pacientes p ON c.idPaciente = p.idPaciente where DATE(c.dataHora) = ?;`;

    // Executa a query, passando a data como parâmetro
    db.query(sql, [data], (err, results) => {
        if (err) {
            console.error('Erro ao buscar consultas:', err);
            return res.status(500).send('Erro ao buscar consultas');
        }


        res.json(results);
    });
});

app.get('/api/agenda', (req, res) => {
    const sql = `
        SELECT CONCAT(c.tipoConsulta, ' ', p.nome) AS title, c.dataHora as start
        FROM consultas c
        JOIN pacientes p ON c.idPaciente = p.idPaciente
    `;

    // Executar a consulta
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return res.status(500).send('Erro ao buscar dados da agenda');
        }

        // Retornar os resultados no formato JSON
        res.json(results);
    });
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
app.use(express.static('agenda'));
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

app.post('/api/consultas', (req, res) => {
    const { idPaciente, dataHora, tipoConsulta, convenio } = req.body;
    let sql = `INSERT INTO consultas (idPaciente, dataHora, tipoConsulta, convenio) VALUES (?, ?, ?, ?)`;
    db.query(sql, [idPaciente, dataHora, tipoConsulta, convenio], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ id: result.insertId, idPaciente, dataHora, tipoConsulta, convenio });
    });
});


app.post('/api/consultas', (req, res) => {
    const { idPaciente, dataHora, tipoConsulta, convenio } = req.body;
    let sql = `INSERT INTO consultas (idPaciente, dataHora, tipoConsulta, convenio) VALUES (?, ?, ?, ?)`;
    db.query(sql, [idPaciente, dataHora, tipoConsulta, convenio], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ id: result.insertId, idPaciente, dataHora, tipoConsulta, convenio });
    });
});



// Iniciar o servidor
app.listen(3000, '0.0.0.0',() => {
    console.log('Servidor rodando na porta 3000');
});
