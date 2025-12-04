// public/script.js

// Define a URL base da nossa API
const API_URL = '/api/mensagens';

// Elementos do DOM
const formRecado = document.getElementById('form-recado');
const inputAutor = document.getElementById('autor');
const inputMensagem = document.getElementById('mensagem');
const listaRecados = document.getElementById('lista-recados');

// --- [R]EAD (GET) ---
// Função para carregar as mensagens da API
async function carregarMensagens() {
try {
const response = await fetch(API_URL);
const mensagens = await response.json();

// Limpa a lista antes de adicionar os novos
listaRecados.innerHTML = '';

if (mensagens.length === 0) {
listaRecados.innerHTML = '<p>Nenhum recado ainda. Seja o primeiro!</p>';
return;
}

// Adiciona cada mensagem ao DOM
mensagens.forEach(msg => {
const item = document.createElement('div');
item.className = 'recado-item';

// Formata a data para pt-BR
const dataFormatada = new Date(msg.data_criacao).toLocaleString('pt-BR');

item.innerHTML = `
<p>${msg.mensagem}</p>
<div class="info">
Enviado por: <strong>${msg.autor}</strong>
<br>
<em>Em: ${dataFormatada}</em>
</div>
`;
listaRecados.appendChild(item);
});

} catch (error) {
console.error('Erro ao carregar recados:', error);
listaRecados.innerHTML = '<p>Erro ao carregar recados.</p>';
}
}

// --- [C]REATE (POST) ---
// Event listener para o envio do formulário
formRecado.addEventListener('submit', async (e) => {
// 1. Impede o recarregamento da página (comportamento padrão do form)
e.preventDefault();

const autor = inputAutor.value;
const mensagem = inputMensagem.value;

// Validação simples
if (!autor || !mensagem) {
alert('Por favor, preencha seu nome e o recado!');
return;
}

try {
// 2. Envia os dados para a API (POST)
const response = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ autor, mensagem }),
});

if (response.ok) {
// 3. Limpa o formulário
inputAutor.value = '';
inputMensagem.value = '';

// 4. Recarrega a lista de mensagens (para exibir a nova)
await carregarMensagens();
} else {
alert('Erro ao salvar o recado.');
}

} catch (error) {
console.error('Erro ao enviar recado:', error);
}
});

// --- Ponto de Partida ---
// Carrega as mensagens assim que a página é aberta
document.addEventListener('DOMContentLoaded', carregarMensagens);