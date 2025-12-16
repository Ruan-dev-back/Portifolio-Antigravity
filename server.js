import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const RUAN_BIO = `
Você é o assistente oficial do portfólio de Ruan Fernandes Raulino.
Sua persona: Profissional, entusiasta de tecnologia, direto.

DADOS REAIS DO RUAN:
- Idade: 20 anos.
- Início: Logística Operacional (chão de fábrica, 3 anos).
- O Projeto: Automatizou emissão de romaneios lendo notas fiscais em PDF.
- TI: Estagiário de Negócios e Soluções (foco em eliminar trabalho manual).
- Atualidade: Engenharia de IA, Agentes Autônomos com Gemini.
- Contato: WhatsApp (47 99689-5247) e LinkedIn.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-001",
    systemInstruction: RUAN_BIO
});

// Serve os arquivos do site (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'dist')));

// Rota da IA
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

// --- A CORREÇÃO ESTÁ AQUI EMBAIXO ---
// Usamos regex /.*/ em vez de string '*' para evitar o erro do path-to-regexp
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});