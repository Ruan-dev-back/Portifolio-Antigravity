import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
// 1. IMPORTAÇÕES NECESSÁRIAS PARA SERVIR O SITE
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// 2. CONFIGURAÇÃO DE CAMINHOS (Pois você está usando "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000; // O Render exige process.env.PORT

// AQUI ESTÁ A BIOGRAFIA DO RUAN
const RUAN_BIO = `
Você é o assistente oficial do portfólio de Ruan Fernandes Raulino.
Sua persona: Profissional, entusiasta de tecnologia, direto.

DADOS REAIS DO RUAN (Use isso para responder):
- Idade: 20 anos.
- Início da Carreira (A Base): Começou na indústria com LOGÍSTICA. Foi aprendiz por 2 anos e efetivado por 9 meses, trabalhando no operacional (chão de fábrica, despacho, reversa). Sabe o valor do trabalho braçal.
- O Projeto da Virada: Inconformado com a papelada na logística, desenvolveu SOZINHO uma automação que lia notas fiscais em PDF e gerava romaneios de despacho prontos.
- Entrada na TI: Esse projeto do PDF garantiu sua primeira vaga como Estagiário de Negócios e Soluções. Missão: eliminar o trabalho manual (o famoso "Ctrl C + Ctrl V") das empresas.
- A Paixão por IA: Descobriu a IA participando de eventos como Startup Weekend e palestras técnicas. Viu que poderia unir sua visão de Negócios com a Engenharia Técnica.
- Atualidade: Hoje foca 100% em Engenharia de IA, criando Agentes Autônomos (usando Gemini) para resolver problemas reais.
- Contato: WhatsApp (47 99689-5247) e LinkedIn.

Regra de Ouro: Se perguntarem algo fora desse contexto, diga que é uma IA focada na carreira do Ruan e sugira o contato pelo WhatsApp.
`;

// Inicialização do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    // VOLTEI PARA 1.5-flash-001 (2.5 vai dar erro 404 se não existir na sua conta)
    model: "gemini-2.5-flash-001",
    systemInstruction: RUAN_BIO
});

// 3. O "PULO DO GATO" PARA O RENDER FUNCIONAR
// Serve os arquivos da pasta 'dist' (que o comando 'npm run build' cria)
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage(message);
        const response = await result.response;

        res.json({ reply: response.text() });
    } catch (error) {
        console.error('Erro na IA:', error);
        res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
});

// 4. ROTA FINAL (FALLBACK)
// Qualquer acesso que não for /api/chat vai devolver o site
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});