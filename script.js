
    const { application } = require("express");

const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('aluno-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// campo forms
const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputCPF = document.getElementById('cpf');
const inputData = document.getElementById('data');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');

// estado local
let editandoId = null;

// 1. LER (GET): buscar dados do backend e renderizar na tela
async function carregarAluno() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

        if (alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.data}</td>
                <td>${aluno.curso}</td>
                <td class="action">
                    <button class="btn-icon btn-edit" onclick="
                    iniciarEdicao(${aluno.id}, '${aluno.nome}', '${aluno.email}', '${aluno.CPF} , '${aluno.data} , '${aluno.curso}')">
                    Editar</button>

                    <button class="btn-icon btn-delete"
                    onclick="deletarAluno(${aluno.id})">Excluir</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
        alert('Erro de conexão com o servidor!');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const aluno = {
        nome: inputNome.value,
        email: inputEmail.value,
        CPF :  inputCPF.value,
        data : inputData.value,
        curso: inputCurso.value,

    };

    try {
        if (editandoId) {
            // Se tem um ID, estamos editando (Put)
            await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno)
            });

            editandoId = null; // reseta o estado
        } else {
            //se nao tem ID estamos criando (POST)
            await fetch(API_URL , {
                method: 'POST' , 
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify(aluno)
            });
        }



resetarFormulario();
carregarAluno(); //recarregar a lista atualizada do backend

    } catch (erro) {
        console.error('erro ao salvar:' , erro);
        alert('erro ao salvar os ddos no servidor');
    }
});
