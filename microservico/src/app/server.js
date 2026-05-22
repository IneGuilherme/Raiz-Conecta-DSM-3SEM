require('dotenv').config({ path: '../../.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Mailtrap (O "Correio" do nosso sistema)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER, // Pega do arquivo .env do microsserviço
        pass: process.env.EMAIL_PASS  // Pega do arquivo .env do microsserviço
    }
});

// Função para ler o HTML e injetar as variáveis
function lerTemplateHTML(nomeArquivo, variaveis) {
    // Pega o caminho exato do arquivo na pasta templates
    const caminho = path.join(__dirname, 'templates', nomeArquivo);
    
    // Lê o conteúdo do arquivo HTML
    let html = fs.readFileSync(caminho, 'utf8');

    // Substitui cada marcador (ex: {{nome}}) pelo valor real
    for (const [chave, valor] of Object.entries(variaveis)) {
        html = html.replace(`{{${chave}}}`, valor);
    }
    
    return html;
}

// ROTA 1: Boas-vindas (Ao criar a conta)
app.post('/api/email/boas-vindas', async (req, res) => {
    const { email, nome } = req.body;
    
    try {
        // 1. Tratamos o nome (se não vier nome, usa 'Produtor')
        const nomeFinal = nome || 'Produtor';

        // 2. Lemos o arquivo HTML passando a variável
        const htmlCorpo = lerTemplateHTML('boas-vindas.html', { nome: nomeFinal });

        // 3. Enviamos o e-mail usando o HTML lido
        await transporter.sendMail({
            from: '"Equipe Raiz Conecta" <nao-responda@raizconecta.com.br>',
            to: email,
            subject: "🌱 Bem-vindo ao Raiz Conecta!",
            html: htmlCorpo // <--- Aqui entra o HTML limpinho
        });

        console.log(`[E-mail Enviado] Boas-vindas para: ${email}`);
        res.status(200).json({ message: "E-mail enviado com sucesso" });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});

// 📧 ROTA 2: Aprovação (Nível Raiz)
app.post('/api/email/aprovacao', async (req, res) => {
    const { email } = req.body;
    try {
        // Como não tem variável dinâmica nesse HTML, passamos um objeto vazio {}
        const htmlCorpo = lerTemplateHTML('aprovacao.html', {});

        await transporter.sendMail({
            from: '"Equipe Raiz Conecta" <nao-responda@raizconecta.com.br>',
            to: email,
            subject: "🎉 Aprovado! Você agora é um Produtor Raiz!",
            html: htmlCorpo
        });
        console.log(`[E-mail Enviado] Aprovação para: ${email}`);
        res.status(200).json({ message: "E-mail de aprovação enviado" });
    } catch (error) {
        console.error("Erro ao enviar aprovação:", error);
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});

// ROTA 3: Rejeição (Documento Inválido)
app.post('/api/email/rejeicao', async (req, res) => {
    const { email } = req.body;
    try {
        // Também não tem variáveis dinâmicas aqui
        const htmlCorpo = lerTemplateHTML('rejeicao.html', {});

        await transporter.sendMail({
            from: '"Equipe Raiz Conecta" <nao-responda@raizconecta.com.br>',
            to: email,
            subject: "⚠️ Atualização sobre sua documentação",
            html: htmlCorpo
        });
        console.log(`[E-mail Enviado] Rejeição para: ${email}`);
        res.status(200).json({ message: "E-mail de rejeição enviado" });
    } catch (error) {
        console.error("Erro ao enviar rejeição:", error);
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});

// 💡 ROTA 4: Nova Sugestão de Produto (Agora envia o recibo para o produtor)
app.post('/api/email/sugestao', async (req, res) => {
    // Adicionamos a variável imagemUrl que vem do Front
    const { emailProdutor, nomeProduto, descricao, imagemUrl } = req.body;
    try {
        const descricaoFinal = descricao || 'Nenhuma descrição fornecida.';
        // Se não enviarem foto, colocamos uma imagem padrão de "Sem Imagem"
        const imagemFinal = imagemUrl || 'https://via.placeholder.com/250x200?text=Sem+Imagem';

        const htmlCorpo = lerTemplateHTML('sugestao.html', {
            nomeProduto: nomeProduto,
            descricao: descricaoFinal,
            imagemUrl: imagemFinal // <-- Passamos a imagem para o HTML
        });

        await transporter.sendMail({
            from: '"Equipe Raiz Conecta" <nao-responda@raizconecta.com.br>',
            to: emailProdutor, // <-- Mudamos de "admin@" para enviar para o Produtor
            subject: "💡 Sua sugestão está em análise!",
            html: htmlCorpo
        });
        
        console.log(`[E-mail Enviado] Recibo de sugestão para: ${emailProdutor}`);
        res.status(200).json({ message: "E-mail de recibo enviado ao produtor" });
    } catch (error) {
        console.error("Erro ao enviar sugestão:", error);
        res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});

// INICIAR O SERVIDOR

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Microsserviço de E-mail rodando na porta ${PORT}`);
});