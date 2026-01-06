// Importar a biblioteca do Google Generative AI via CDN
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

// Prompt padrão para roteiros longos
const PROMPT_PADRAO = `VOCÊ É UM ROTEIRISTA PROFISSIONAL. Seu trabalho é ESCREVER IMEDIATAMENTE um roteiro completo.

TÍTULO DO VÍDEO: "{titulo}"
IDIOMA: {idioma}

⚠️ ATENÇÃO - REGRAS OBRIGATÓRIAS:
1. NÃO FAÇA PERGUNTAS
2. NÃO PEÇA INFORMAÇÕES ADICIONAIS
3. NÃO DIGA QUE PRECISA DE MAIS DETALHES
4. COMECE A ESCREVER O ROTEIRO AGORA MESMO
5. Use APENAS o título fornecido acima: "{titulo}"

📝 ESTRUTURA OBRIGATÓRIA DO ROTEIRO (10.000-12.000 palavras):

1️⃣ HOOK/INTRODUÇÃO (500-800 palavras)
   - Gancho inicial impactante
   - Apresentação do tema "{titulo}"
   - Por que este assunto é importante

2️⃣ DESENVOLVIMENTO (8.000-9.000 palavras)
   - Mínimo 10 pontos principais detalhados
   - Cada ponto com 700-900 palavras
   - Exemplos práticos e histórias reais
   - Dados e estatísticas
   - Transições suaves entre tópicos

3️⃣ CONCLUSÃO (500-800 palavras)
   - Resumo dos pontos principais
   - Call-to-action forte
   - Mensagem final inspiradora

🎯 TOM: Engajador, profissional, informativo e motivacional

⚡ IMPORTANTE:
- Seja EXTREMAMENTE detalhado e extenso
- Cada seção deve ser rica em informações
- Use storytelling quando apropriado
- Mantenha o leitor engajado do início ao fim

🚀 COMECE AGORA! Escreva o roteiro completo em {idioma} sobre "{titulo}":

[INÍCIO DO ROTEIRO]`;

// Idiomas suportados
const IDIOMAS = {
    portugues: { nome: 'português brasileiro', flag: '🇧🇷' },
    espanhol: { nome: 'espanhol', flag: '🇪🇸' },
    ingles: { nome: 'inglês', flag: '🇺🇸' },
    russo: { nome: 'russo', flag: '🇷🇺' },
    arabe: { nome: 'árabe', flag: '🇸🇦' }
};

// Carregar configurações salvas ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    carregarConfiguracoes();
});

// Carregar configurações do localStorage
function carregarConfiguracoes() {
    const apiKeySalva = localStorage.getItem('gemini_api_key');
    const promptSalvo = localStorage.getItem('custom_prompt');

    if (apiKeySalva) {
        document.getElementById('apiKey').value = apiKeySalva;
    }

    if (promptSalvo) {
        document.getElementById('customPrompt').value = promptSalvo;
    } else {
        document.getElementById('customPrompt').value = PROMPT_PADRAO;
    }
}

// Função para salvar API Key
window.salvarApiKey = function() {
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!apiKey) {
        alert('⚠️ Por favor, digite uma API Key antes de salvar.');
        return;
    }

    localStorage.setItem('gemini_api_key', apiKey);
    alert('✅ API Key salva com sucesso!');
};

// Função para alternar visualização da API Key
window.toggleApiKey = function() {
    const input = document.getElementById('apiKey');
    const button = event.target;

    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
};

// Salvar prompt customizado
window.salvarPrompt = function() {
    const prompt = document.getElementById('customPrompt').value.trim();

    if (!prompt) {
        alert('⚠️ Por favor, digite um prompt antes de salvar.');
        return;
    }

    localStorage.setItem('custom_prompt', prompt);
    alert('✅ Prompt salvo com sucesso!');
};

// Resetar para prompt padrão
window.resetarPrompt = function() {
    if (confirm('Deseja resetar para o prompt padrão? O prompt atual será perdido.')) {
        document.getElementById('customPrompt').value = PROMPT_PADRAO;
        localStorage.removeItem('custom_prompt');
        alert('✅ Prompt resetado para o padrão!');
    }
};

// Atualizar mensagem de progresso
function atualizarProgresso(mensagem) {
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.innerHTML = mensagem;
    }
}

// Função para contar palavras e caracteres
function contarEstatisticas(texto) {
    const palavras = texto.trim().split(/\s+/).length;
    const caracteres = texto.length;
    return { palavras, caracteres };
}

// Função para exibir estatísticas
function exibirEstatisticas(idioma, texto) {
    const stats = contarEstatisticas(texto);
    const statsElement = document.getElementById(`stats-${idioma}`);
    if (statsElement) {
        statsElement.innerHTML = `
            📊 <strong>Estatísticas:</strong>
            ${stats.palavras.toLocaleString('pt-BR')} palavras |
            ${stats.caracteres.toLocaleString('pt-BR')} caracteres
        `;
    }
}

// Função para gerar um roteiro longo em 2 partes
async function gerarRoteiroLongo(model, titulo, customPrompt, idioma) {
    // PARTE 1: Gerar primeira metade do roteiro
    atualizarProgresso(`🎬 Gerando ${idioma.flag} ${idioma.nome} - Parte 1/2...`);

    const promptParte1 = customPrompt
        .replace(/{titulo}/g, titulo)
        .replace(/{idioma}/g, idioma.nome) +
        `\n\n━━━━━━━━━━━━━━━━━━━━━━
⚠️ INSTRUÇÕES PARA PARTE 1/2:
━━━━━━━━━━━━━━━━━━━━━━

Esta é a PRIMEIRA PARTE do roteiro. Você DEVE escrever aproximadamente 5.000-6.000 palavras.

✅ O QUE ESCREVER AGORA:
- HOOK/INTRODUÇÃO completa
- Primeiros 5-6 pontos do DESENVOLVIMENTO (bem detalhados)
- Cada ponto com 700-900 palavras

❌ NÃO FAÇA:
- Não faça perguntas
- Não peça mais informações
- Não escreva a conclusão ainda (deixe para parte 2)

🚀 COMECE A ESCREVER AGORA! Escreva direto em ${idioma.nome}:`;

    const resultParte1 = await model.generateContent(promptParte1);
    const responseParte1 = await resultParte1.response;
    const textoParte1 = responseParte1.text();

    // Pequena pausa entre as requisições
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PARTE 2: Continuar e finalizar o roteiro
    atualizarProgresso(`🎬 Gerando ${idioma.flag} ${idioma.nome} - Parte 2/2...`);

    const promptParte2 = `VOCÊ É UM ROTEIRISTA PROFISSIONAL. Continue escrevendo o roteiro sobre "${titulo}" em ${idioma.nome}.

━━━━━━━━━━━━━━━━━━━━━━
⚠️ INSTRUÇÕES PARA PARTE 2/2:
━━━━━━━━━━━━━━━━━━━━━━

Esta é a SEGUNDA E ÚLTIMA PARTE do roteiro.

📄 PARTE 1 JÁ ESCRITA:
${textoParte1}

✅ O QUE ESCREVER AGORA (5.000-6.000 palavras):
- Continue de onde parou
- Escreva os pontos 6-10+ do DESENVOLVIMENTO
- Cada ponto com 700-900 palavras
- CONCLUSÃO completa (500-800 palavras)
- Call-to-action final forte

❌ REGRAS:
- NÃO repita o que já foi escrito
- NÃO faça perguntas
- NÃO peça esclarecimentos
- Apenas CONTINUE e FINALIZE

🚀 CONTINUE ESCREVENDO AGORA em ${idioma.nome}:`;

    const resultParte2 = await model.generateContent(promptParte2);
    const responseParte2 = await resultParte2.response;
    const textoParte2 = responseParte2.text();

    // Juntar as duas partes
    const roteiroCompleto = textoParte1 + '\n\n' + textoParte2;

    return roteiroCompleto;
}

// Função principal para gerar roteiros
window.gerarRoteiros = async function() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const customPrompt = document.getElementById('customPrompt').value.trim();

    // Validações
    if (!apiKey) {
        alert('⚠️ Por favor, insira sua API Key do Google Gemini.');
        document.getElementById('apiKey').focus();
        return;
    }

    if (!titulo) {
        alert('⚠️ Por favor, insira um título para o roteiro.');
        document.getElementById('titulo').focus();
        return;
    }

    if (!customPrompt) {
        alert('⚠️ Por favor, configure um prompt.');
        document.getElementById('customPrompt').focus();
        return;
    }

    // Salvar API Key automaticamente
    localStorage.setItem('gemini_api_key', apiKey);

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    atualizarProgresso('🚀 Iniciando geração de roteiros longos...');

    // Limpar roteiros anteriores
    Object.keys(IDIOMAS).forEach(idiomaKey => {
        const elemento = document.getElementById(`roteiro-${idiomaKey}`);
        if (elemento) {
            elemento.textContent = '⏳ Aguardando geração...';
        }
        const statsElement = document.getElementById(`stats-${idiomaKey}`);
        if (statsElement) {
            statsElement.innerHTML = '';
        }
    });

    try {
        // Inicializar API do Gemini
        atualizarProgresso('🔧 Conectando com Google Gemini AI...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Mostrar resultados desde o início
        document.getElementById('results').style.display = 'block';

        // Gerar roteiros para cada idioma SEQUENCIALMENTE (um por vez)
        let sucessos = 0;
        let erros = 0;

        for (const idiomaKey of Object.keys(IDIOMAS)) {
            const idioma = IDIOMAS[idiomaKey];

            try {
                atualizarProgresso(`🎬 Gerando roteiro em ${idioma.flag} ${idioma.nome}...`);

                const roteiroCompleto = await gerarRoteiroLongo(model, titulo, customPrompt, idioma);

                // Exibir o roteiro assim que estiver pronto
                const elemento = document.getElementById(`roteiro-${idiomaKey}`);
                if (elemento) {
                    elemento.textContent = roteiroCompleto;
                }

                // Exibir estatísticas
                exibirEstatisticas(idiomaKey, roteiroCompleto);

                sucessos++;

                // Scroll suave até o roteiro gerado
                const card = elemento.closest('.idioma-card');
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

            } catch (erro) {
                console.error(`Erro ao gerar roteiro em ${idioma.nome}:`, erro);

                const elemento = document.getElementById(`roteiro-${idiomaKey}`);
                if (elemento) {
                    elemento.textContent = `❌ Erro ao gerar roteiro: ${erro.message}\n\nVerifique sua API Key e tente novamente.`;
                }

                erros++;
            }

            // Pausa entre idiomas para não sobrecarregar a API
            if (idiomaKey !== 'arabe') { // Não pausar no último idioma
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Finalizar
        document.getElementById('loading').style.display = 'none';

        if (sucessos === Object.keys(IDIOMAS).length) {
            atualizarProgresso('✅ Todos os roteiros foram gerados com sucesso!');
            alert(`✅ Sucesso! Todos os ${sucessos} roteiros foram gerados.`);
        } else if (sucessos > 0) {
            atualizarProgresso(`⚠️ Geração parcial: ${sucessos} sucessos, ${erros} erros.`);
            alert(`⚠️ ${sucessos} roteiros gerados com sucesso, ${erros} falharam.`);
        } else {
            atualizarProgresso('❌ Falha na geração de todos os roteiros.');
            alert('❌ Nenhum roteiro foi gerado. Verifique sua API Key e conexão.');
        }

        // Scroll suave até os resultados
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

    } catch (erro) {
        console.error('Erro geral:', erro);

        let mensagemErro = erro.message;

        if (mensagemErro.includes('API_KEY_INVALID') || mensagemErro.includes('API key')) {
            mensagemErro = 'API Key inválida. Verifique se você copiou corretamente.';
        } else if (mensagemErro.includes('quota')) {
            mensagemErro = 'Cota da API excedida. Tente novamente mais tarde.';
        } else if (mensagemErro.includes('network') || mensagemErro.includes('fetch')) {
            mensagemErro = 'Erro de conexão. Verifique sua internet.';
        }

        alert(`❌ Erro ao gerar roteiros: ${mensagemErro}`);
        document.getElementById('loading').style.display = 'none';
    }
};

// Função para copiar roteiro
window.copiarRoteiro = async function(idioma) {
    const conteudo = document.getElementById(`roteiro-${idioma}`).textContent;

    if (!conteudo || conteudo.includes('Aguardando') || conteudo.includes('Erro')) {
        alert('⚠️ Nenhum roteiro válido para copiar.');
        return;
    }

    try {
        await navigator.clipboard.writeText(conteudo);

        // Feedback visual
        const botao = event.target;
        const textoOriginal = botao.textContent;
        const corOriginal = botao.style.background;

        botao.textContent = '✅ Copiado!';
        botao.style.background = '#2196F3';

        setTimeout(() => {
            botao.textContent = textoOriginal;
            botao.style.background = corOriginal;
        }, 2000);

    } catch (erro) {
        console.error('Erro ao copiar:', erro);
        alert('❌ Erro ao copiar. Tente selecionar manualmente o texto.');
    }
};

// Log de inicialização
console.log('🎬 Gerador de Roteiros IA carregado com sucesso!');
console.log('📚 Idiomas disponíveis:', Object.keys(IDIOMAS).join(', '));
