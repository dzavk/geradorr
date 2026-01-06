// Configuração da API Claude
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-3-5-haiku-20241022";

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
    const apiKeySalva = localStorage.getItem('claude_api_key');
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

    localStorage.setItem('claude_api_key', apiKey);
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

// Função para exibir estatísticas
function exibirEstatisticas(idioma, palavras, caracteres) {
    const statsElement = document.getElementById(`stats-${idioma}`);
    if (statsElement) {
        statsElement.innerHTML = `
            📊 <strong>Estatísticas:</strong>
            ${palavras.toLocaleString('pt-BR')} palavras |
            ${caracteres.toLocaleString('pt-BR')} caracteres
        `;
    }
}

// Função para chamar API do Claude
async function chamarClaudeAPI(apiKey, prompt) {
    const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: 8192,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na API do Claude');
    }

    const data = await response.json();
    return data.content[0].text;
}

// Função para gerar um roteiro longo em 2 partes
async function gerarRoteiroLongo(apiKey, titulo, customPrompt, idiomaInfo) {
    // PARTE 1
    let promptParte1 = customPrompt
        .replace(/{titulo}/g, titulo)
        .replace(/{idioma}/g, idiomaInfo.nome);

    promptParte1 += `

━━━━━━━━━━━━━━━━━━━━━━
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

🚀 COMECE A ESCREVER AGORA! Escreva direto em ${idiomaInfo.nome}:`;

    const textoParte1 = await chamarClaudeAPI(apiKey, promptParte1);

    // Pausa de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PARTE 2
    const promptParte2 = `VOCÊ É UM ROTEIRISTA PROFISSIONAL. Continue escrevendo o roteiro sobre "${titulo}" em ${idiomaInfo.nome}.

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

🚀 CONTINUE ESCREVENDO AGORA em ${idiomaInfo.nome}:`;

    const textoParte2 = await chamarClaudeAPI(apiKey, promptParte2);

    return textoParte1 + '\n\n' + textoParte2;
}

// Função principal para gerar roteiros
window.gerarRoteiros = async function() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const customPrompt = document.getElementById('customPrompt').value.trim();

    // Validações
    if (!apiKey) {
        alert('⚠️ Por favor, insira sua API Key do Claude (Anthropic).');
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
    localStorage.setItem('claude_api_key', apiKey);

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'block';
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

    let sucessos = 0;
    let erros = 0;

    // Gerar roteiros para cada idioma
    for (const [idiomaKey, idiomaInfo] of Object.entries(IDIOMAS)) {
        try {
            atualizarProgresso(`🎬 Gerando ${idiomaInfo.flag} ${idiomaInfo.nome}...`);

            const roteiro = await gerarRoteiroLongo(apiKey, titulo, customPrompt, idiomaInfo);

            // Exibir roteiro
            const elemento = document.getElementById(`roteiro-${idiomaKey}`);
            if (elemento) {
                elemento.textContent = roteiro;
            }

            // Calcular estatísticas
            const palavras = roteiro.split(/\s+/).length;
            const caracteres = roteiro.length;
            exibirEstatisticas(idiomaKey, palavras, caracteres);

            sucessos++;

            // Scroll até o roteiro
            const card = elemento.closest('.idioma-card');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Pausa entre idiomas
            if (idiomaKey !== 'arabe') {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (erro) {
            console.error(`Erro ao gerar ${idiomaInfo.nome}:`, erro);

            const elemento = document.getElementById(`roteiro-${idiomaKey}`);
            if (elemento) {
                elemento.textContent = `❌ Erro: ${erro.message}`;
            }
            erros++;
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

    // Scroll até os resultados
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
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
console.log('🖥️ Modo: Standalone (HTML + JavaScript puro)');
console.log('🤖 Modelo: claude-3-5-haiku-20241022');
console.log('⚠️ CORS: Chamadas diretas para API do Claude');
