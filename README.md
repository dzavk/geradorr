# 🎬 Gerador de Roteiros Multilíngue com IA

Aplicação web profissional para gerar roteiros detalhados e extensos em múltiplos idiomas usando **Claude AI (Anthropic)**.

## ✨ Funcionalidades

- 🌍 **5 Idiomas**: Português, Espanhol, Inglês, Russo e Árabe
- 📝 **Roteiros Extensos**: 10.000-12.000 palavras por roteiro
- 🤖 **IA Avançada**: Claude 3.5 Haiku (Anthropic)
- 📥 **Downloads**: TXT, DOCX e ZIP
- 💾 **Persistência**: API Key e prompt salvos localmente
- ⚙️ **Prompt Customizável**: Personalize completamente
- 📊 **Estatísticas**: Contagem de palavras e caracteres
- 📋 **Copiar Fácil**: Botão para copiar com um clique
- 🎨 **Interface Moderna**: Design profissional e responsivo
- ⚡ **Prompts Imperativos**: IA não faz perguntas, gera direto

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

Ou manualmente:

```bash
pip install Flask==3.0.0 flask-cors==4.0.0 requests==2.31.0 python-docx==1.1.0
```

### 2. Obter API Key do Claude

1. Acesse: https://console.anthropic.com/settings/keys
2. Crie sua conta na Anthropic
3. Clique em "Create Key"
4. Copie a chave (começa com `sk-ant-...`)

### 3. Executar o Servidor

```bash
python app.py
```

Acesse: http://localhost:5000

### 4. Gerar Roteiros

1. Cole sua API Key do Claude
2. Digite o título do vídeo
3. (Opcional) Customize o prompt
4. Clique em "🚀 Gerar Roteiros"
5. Aguarde 5-15 minutos
6. Baixe em TXT, DOCX ou ZIP

## 📁 Estrutura do Projeto

```
geradorr/
├── app.py                # Servidor Flask + Claude API
├── requirements.txt      # Dependências Python
├── templates/
│   └── index.html       # Interface web
├── static/
│   ├── app.js           # JavaScript
│   └── style.css        # Estilos
├── COMO_EXECUTAR.md     # Instruções detalhadas
└── README.md            # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **Python Flask**: Backend e API REST
- **Claude AI (Anthropic)**: Geração de conteúdo com IA
- **HTML5 + CSS3**: Interface moderna
- **JavaScript (ES6+)**: Lógica do frontend
- **python-docx**: Geração de arquivos DOCX
- **requests**: Chamadas REST para API do Claude
- **LocalStorage**: Salvamento local de configurações

## ⚙️ Configurações Avançadas

### Customizar o Prompt

O prompt padrão pode ser editado diretamente na interface. Use as variáveis:

- `{titulo}` - Será substituído pelo título do vídeo
- `{idioma}` - Será substituído pelo idioma atual

Exemplo:
```
Crie um roteiro sobre '{titulo}' em {idioma} com foco em iniciantes...
```

### Persistência de Dados

A aplicação salva automaticamente no navegador (localStorage):
- ✅ API Key do Claude (seguro, apenas local)
- ✅ Prompt customizado

### Modelo e Limites

- **Modelo**: claude-3-5-haiku-20241022
- **Limite**: 8.192 tokens por requisição
- **Geração**: 2 partes de ~5.000 palavras cada
- **Total**: 10.000-12.000 palavras por roteiro

## 🎯 Idiomas Suportados

| Idioma | Código | Flag |
|--------|--------|------|
| Português | portugues | 🇧🇷 |
| Espanhol | espanhol | 🇪🇸 |
| Inglês | ingles | 🇺🇸 |
| Russo | russo | 🇷🇺 |
| Árabe | arabe | 🇸🇦 |

## ⚠️ Limites e Considerações

- **Tempo de Geração**: 5-15 minutos para todos os 5 idiomas
- **Custo da API**: A API do Claude é paga - veja https://anthropic.com/pricing
- **Python**: Requer Python 3.8 ou superior
- **Conexão**: Internet estável necessária
- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)

## 🐛 Solução de Problemas

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente (sem espaços)
- Confirme que a chave começa com `sk-ant-`
- Certifique-se de que sua conta Anthropic está ativa

### Erro: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Erro: "Rate limit exceeded"
- Você excedeu o limite de requisições
- Aguarde alguns minutos e tente novamente

### Porta 5000 já em uso
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
```

### Servidor não inicia
```bash
python --version  # Deve ser 3.8+
```

## 📝 Documentação Completa

Leia o [COMO_EXECUTAR.md](COMO_EXECUTAR.md) para instruções detalhadas.

## 👨‍💻 Desenvolvido com

- Claude AI (Anthropic)
- Python Flask
- Vanilla JavaScript
- CSS3

---

**2025** • Desenvolvido com ❤️ usando Claude AI
