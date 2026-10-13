

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Módulo para manipulação de arquivos

const app = express(); // Cria uma instância do Express
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');// Caminho para o arquivo JSON

//Middleware
app.use(cors()); //Permite que o servidor aceite requisições de diferentes origens (CORS)
app.use(express.json()); //Permite que o servidor entenda requisições com corpo em JSON
app.use(express.static(path.join(__dirname, 'public'))); //Serve os arquivos estáticos da pasta 'public'

function lerBancoDados() {
// Verifica se o arquivo JSON existe, caso não exista, cria um arquivo vazio
if (!fs.existsSync(DB_FILE)) {
fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
}

```
const data = fs.readFileSync(DB_FILE, 'utf8'); // Lê o conteúdo do arquivo JSON
return JSON.parse(data); 
```

}

// Função auxiliar para salvar os dados no arquivo JSON
function salvarBancoDados(data) {
fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); // null, 2 serve para deixar o JSON formatado e fácil de ler
}

// ----- ROTAS DA API (CRUD) -----

// CREATE (Cria - POST)
app.post('/api/alunos', (req, res) => {
const { nome, email, curso } = req.body;

```
// Validação simples 
if (!nome || !email || !curso) { 
    return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios.' 
    }); 
} 

const db = lerBancoDados(); 

// Calcula o próximo ID 
const nextId = db.alunos.length > 0 
    ? Math.max(...db.alunos.map(a => a.id)) + 1 
    : 1; 

const novoAluno = { 
    id: nextId, 
    nome, 
    email, 
    curso 
}; 

db.alunos.push(novoAluno); 
salvarBancoDados(db); // Salva a alteração no db.json

res.status(201).json(novoAluno); 
```

});

// READ (ler/lista - GET)
app.get('/api/alunos', (req, res) => {
const db = lerBancoDados();
res.json(db.alunos);
});

// UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (req, res) => {
const id = parseInt(req.params.id);
const { nome, email, curso } = req.body;

```
const db = lerBancoDados(); 
const index = db.alunos.findIndex(a => a.id === id); 

if (index === -1) { 
    return res.status(404).json({ 
        erro: 'Aluno não encontrado!' 
    }); 
} 

db.alunos[index] = { 
    ...db.alunos[index], 
    nome, 
    email, 
    curso 
}; 

salvarBancoDados(db); // Salva a alteração no arquivo 

res.json(db.alunos[index]); 
```

});

// DELETE
app.delete('/api/alunos/:id', (req, res) => {
const id = parseInt(req.params.id);
const db = lerBancoDados();
const index = db.alunos.findIndex(a => a.id === id);

```
if (index === -1) { 
    return res.status(404).json({ 
        erro: 'Aluno não encontrado!' 
    });   
} 

db.alunos.splice(index, 1); // Remove o aluno da lista  
salvarBancoDados(db); // Salva a alteração no arquivo  

res.status(204).send(); 
```

});

// Iniciar servidor
app.listen(PORT, () => {
console.log(`servidor rodando na porta ${PORT}`);
console.log(`acesse: http://localhost:${PORT}`);
console.log(`banco de dados local ativo no arquivo db.json`);
});
