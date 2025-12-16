import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

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

// Inicialização do Gemini com a Instrução de Sistema
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: RUAN_BIO
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Inicia o chat (sem histórico por enquanto para economizar tokens, ou pode adicionar history: [])
        const chat = model.startChat({
            history: [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Erro na IA:', error);
        res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
