// 1. Importar as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Configurar o servidor Express
const app = express();
app.use(cors()); // Permite que o front end acese o back end
app.use(express.json()); // Permite que o servidor entenda o JSON

// 3. Conectar ao MongoDB
// SUBSTITUA PELA SUA STRING DE CONEXÃO !!!
const mongoURI = '';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Conetado ao MongoDB com sucesso!'))
    .catch(() => console.log('Erro ao conectar ao MongoDB:', err));

// 4. Definir o "Schema" - A estrutura dos dados
// que corresponderá à estrutura do seu formulário
const relatorioSchema = new mongoose.Schema({
    titulo: String,
    tipo: String,
    ano: String,
    status: String,
    data_envio: Date,
    responsavel: {
        nome: String,
        cargo: String,
        departamento: String
    },
    palavras_chave: [String],
    revisoes: [{
        data: Date,
        revisado_por: String,
        comentario: String
    }]
});

// 5. Criar o "model" - o objeto que representa sua coleção no banco
const Relatorio = mongoose.model('Relatorio', relatorioSchema);

// 6. Criar a "Rota" ou "EndPoint" = a url que o front irá chamar
app.post('/salvar-relatorio', async(req, res) => {
    try{
        // Pega os dados que o front end enviou (estão em req.body)
        const dadosDoFormulario = req.body;

        // Cria um novo documento com base nos dados
        const novoRelatorio = new Relatorio(dadosDoFormulario);

        // Salva o documento no banco de dados
        await novoRelatorio.save();

        // Envia uma resposta de sucesso de volta para o front end
        res.status(201).json({ message: 'Relatório salvo com sucesso!'});
        console.log('Relatorio salvo:', novoRelatorio);
    } catch(error){
        // Se der erro, envia uma mensagem de erro
        res.status(500).json({ message: 'Ocorreu um erro ao salvar o relatório.',
        error: error});
        console.error('Erro ao salvar:', error);
    }
});

const PORT = 3000; // A porta em que o back end irá rodar
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
