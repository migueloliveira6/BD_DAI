const express = require('express');
const mysql2 = require('mysql2');
const app = express();
const port = 3000;

// Configuração da conectividade com a base de dados MySQL
const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'DAI'
});

conn.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log('MySQL connected.');
});

// Middleware para parsing de JSON (usar o express)
app.use(express.json());

// Rota para registar um novo user
app.post('/register', (req, res) => {
    const { numeroT , numeroCC } = req.body;
    const sql = 'INSERT INTO users (numeroT, numeroCC) VALUES (?, ?)';
    conn.query(sql, [numeroT, numeroCC], (err, results) => {
        if (err) {
            console.error('Erro ao inserir usuário: ', err);
            res.status(500).send('Erro ao registar o usuário');
            return;
        }
        res.status(200).send('Usuário registado com sucesso');
    });
});

// Rota para login de um user
app.post('/login', (req, res) => {
    const { numeroT, numeroCC } = req.body;
    const sql = 'SELECT * FROM users WHERE numeroT = ? AND numeroCC = ?';
    conn.query(sql, [numeroT, numeroCC], (err, results) => {
        if (err) {
            console.error('Erro ao verificar usuário: ', err);
            res.status(500).send('Erro ao fazer login');
            return;
        }
        if (results.length > 0) {
            res.status(200).send('Login bem-sucedido');
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    });
});

// Rota para o utilizador adicionar um bus e guardar informações na BD
app.post('/add-bus', (req, res) => {
    const { matricula, marca, modelo, ano_fabrico, lugares, linhas } = req.body;
    const sql = 'INSERT INTO Autocarro (matricula, marca, modelo, ano_fabrico, lugares, linhas) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [matricula, marca, modelo, ano_fabrico, lugares, linhas], (err, results) => {
        if (err) {
            console.error('Erro ao inserir autocarro: ', err);
            res.status(500).send('Erro ao adicionar o autocarro');
            return;
        }
        res.status(200).send('Autocarro adicionado com sucesso');
    });
});

// Rota para buscar todos os autocarros
app.get('/bus', (req, res) => {
    const sql = 'SELECT * FROM Autocarro';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar autocarros: ', err);
            res.status(500).send('Erro ao buscar autocarros');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para remover um autocarro
app.delete('/bus/:matricula', (req, res) => {
    const { matricula } = req.params;
    const sql = 'DELETE FROM Autocarro WHERE matricula = ?';
    conn.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Erro ao remover autocarro: ', err);
            res.status(500).send('Erro ao remover autocarro');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Autocarro não encontrado');
            return;
        }
        res.status(200).send('Autocarro removido com sucesso');
    });
});

// Rota para adicionar estatisticas
app.post('/add-statistics', (req, res) => {
    const { ocupacao_media_do_autocarro, numero_bilhetes_vendidos, dia, matricula } = req.body;
    const sql = 'INSERT INTO estatisticas (ocupacao_media_do_autocarro, numero_bilhetes_vendidos, dia, matricula) VALUES (?, ?, ?)';
    conn.query(sql, [ocupacao_media_do_autocarro, numero_bilhetes_vendidos, dia, matricula], (err, results) => {
        if (err) {
            console.error('Erro ao inserir estatísticas: ', err);
            res.status(500).send('Erro ao adicionar as estatísticas');
            return;
        }
        res.status(200).send('Estatísticas adicionadas com sucesso');
    });
});

// Rota para buscar todas as estatísticas
app.get('/statistics', (req, res) => {
    const sql = 'SELECT * FROM estatisticas';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar estatísticas: ', err);
            res.status(500).send('Erro ao buscar estatísticas');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para adicionar estação
app.post('/add-estacao', (req, res) => {
    const { nome_estacao, CoordenadasN, CoordenadasS, numero_linha } = req.body;
    const sql = 'INSERT INTO estacoes (nome_estacao, CoordenadasN, CoordenadasS, numero_linha) VALUES (?, ?, ?, ?)';
    conn.query(sql, [nome_estacao, CoordenadasN, CoordenadasS, numero_linha], (err, results) => {
        if (err) {
            console.error('Erro ao inserir estação: ', err);
            res.status(500).send('Erro ao adicionar a estação');
            return;
        }
        res.status(200).send('Estação adicionada com sucesso');
    });
});

// Rota para remover estação
app.delete('/estacoes/:nome_estacao', (req, res) => {
    const { nome_estacao } = req.params;
    const sql = 'DELETE FROM estacoes WHERE nome_estacao = ?';
    conn.query(sql, [nome_estacao], (err, results) => {
        if (err) {
            console.error('Erro ao remover estação: ', err);
            res.status(500).send('Erro ao remover estação');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Estação não encontrada');
            return;
        }
        res.status(200).send('Estação removida com sucesso');
    });
});

// Rota para buscar todas as estações
app.get('/estacoes', (req, res) => {
    const sql = 'SELECT * FROM estacoes';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar estações: ', err);
            res.status(500).send('Erro ao buscar estações');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para adicionar uma linha
app.post('/add-linha', (req, res) => {
    const { numero_linha, ocupantes, origem, destino, chegada } = req.body;
    const sql = 'INSERT INTO linhas (numero_linha, ocupantes, origem, destino, chegada) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [numero_linha, ocupantes, origem, destino, chegada], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar linha: ', err);
            res.status(500).send('Erro ao adicionar linha');
            return;
        }
        res.status(200).send('Linha adicionada com sucesso');
    });
});

// Rota para obter todas as linhas
app.get('/lines', (req, res) => {
    const sql = 'SELECT * FROM linhas';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar linhas: ', err);
            res.status(500).send('Erro ao buscar linhas');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para remover uma linha
app.delete('/linhas/:numero_linha', (req, res) => {
    const { numero_linha } = req.params;
    const sql = 'DELETE FROM linhas WHERE numero_linha = ?';
    conn.query(sql, [numero_linha], (err, results) => {
        if (err) {
            console.error('Erro ao remover linha: ', err);
            res.status(500).send('Erro ao remover linha');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Linha não encontrada');
            return;
        }
        res.status(200).send('Linha removida com sucesso');
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// Fecha a conexão quando a aplicação é encerrada
process.on('SIGINT', () => {
    conn.end(err => {
        if (err) {
            console.error('Erro ao desconectar do MySQL: ', err);
            process.exit(1);
        }
        console.log('Mysql disconnected.');
        process.exit(0);
    });
});