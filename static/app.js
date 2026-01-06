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

// Armazenar roteiros gerados
let roteirosGerados = {};

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
function exibirEstatisticas(idioma, stats) {
    const statsElement = document.getElementById(`stats-${idioma}`);
    if (statsElement) {
        statsElement.innerHTML = `
            📊 <strong>Estatísticas:</strong>
            ${stats.palavras.toLocaleString('pt-BR')} palavras |
            ${stats.caracteres.toLocaleString('pt-BR')} caracteres
        `;
    }
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
    roteirosGerados = {};
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
        atualizarProgresso('🔧 Conectando com API do Claude...');

        // Fazer chamada para a API Python
        const response = await fetch('/api/gerar-roteiros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                titulo: titulo,
                customPrompt: customPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao gerar roteiros');
        }

        const data = await response.json();

        if (!data.sucesso) {
            throw new Error(data.erro || 'Erro desconhecido');
        }

        // Exibir os roteiros
        let sucessos = 0;
        let erros = 0;

        for (const [idiomaKey, roteiroData] of Object.entries(data.roteiros)) {
            const elemento = document.getElementById(`roteiro-${idiomaKey}`);

            if (roteiroData.erro) {
                if (elemento) {
                    elemento.textContent = `❌ Erro: ${roteiroData.erro}`;
                }
                erros++;
            } else {
                if (elemento) {
                    elemento.textContent = roteiroData.conteudo;
                }

                // Armazenar para downloads
                roteirosGerados[idiomaKey] = {
                    conteudo: roteiroData.conteudo,
                    idioma: roteiroData.idioma
                };

                // Exibir estatísticas
                exibirEstatisticas(idiomaKey, roteiroData.stats);
                sucessos++;

                // Scroll suave até o roteiro gerado
                const card = elemento.closest('.idioma-card');
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
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
        } else if (mensagemErro.includes('quota') || mensagemErro.includes('rate_limit')) {
            mensagemErro = 'Cota da API excedida. Tente novamente mais tarde.';
        } else if (mensagemErro.includes('network') || mensagemErro.includes('fetch')) {
            mensagemErro = 'Erro de conexão. Verifique sua internet e se o servidor está rodando.';
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

// Função para download individual
window.downloadRoteiro = async function(idioma, formato) {
    if (!roteirosGerados[idioma]) {
        alert('⚠️ Roteiro não disponível para download.');
        return;
    }

    const titulo = document.getElementById('titulo').value.trim() || 'roteiro';
    const roteiroData = roteirosGerados[idioma];

    try {
        const response = await fetch(`/api/download-${formato}/${idioma}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conteudo: roteiroData.conteudo,
                titulo: titulo,
                idiomaNome: roteiroData.idioma
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer download');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titulo}_${idioma}.${formato}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (erro) {
        console.error('Erro ao download:', erro);
        alert('❌ Erro ao fazer download.');
    }
};

// Função para download de todos os roteiros
window.downloadTodosRoteiros = async function(formato) {
    if (Object.keys(roteirosGerados).length === 0) {
        alert('⚠️ Nenhum roteiro disponível para download.');
        return;
    }

    const titulo = document.getElementById('titulo').value.trim() || 'roteiros';

    try {
        const response = await fetch('/api/download-zip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roteiros: roteirosGerados,
                titulo: titulo,
                formato: formato
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer download');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titulo}_todos_roteiros.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('✅ Download iniciado!');

    } catch (erro) {
        console.error('Erro ao download:', erro);
        alert('❌ Erro ao fazer download.');
    }
};

// Log de inicialização
console.log('🎬 Gerador de Roteiros IA carregado com sucesso!');
console.log('📚 Idiomas disponíveis:', Object.keys(IDIOMAS).join(', '));
console.log('🖥️ Modo: Cliente-Servidor (Python Flask + Claude API)');
console.log('🤖 Modelo: claude-3-5-haiku-20241022');
