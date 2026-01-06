# 🚀 Como Executar o Gerador de Roteiros (Versão Python + Claude AI)

## 📋 Pré-requisitos

- Python 3.8 ou superior instalado
- Conexão com internet
- API Key do Claude (Anthropic)

## 🔧 Instalação

### 1. Instalar as dependências

Abra o terminal na pasta do projeto e execute:

```bash
pip install -r requirements.txt
```

Ou instale manualmente:

```bash
pip install Flask==3.0.0
pip install flask-cors==4.0.0
pip install requests==2.31.0
pip install python-docx==1.1.0
```

### 2. Executar o servidor

```bash
python app.py
```

Você verá algo como:

```
🎬 Servidor Flask iniciado!
📡 Acesse: http://localhost:5000
⚙️  Usando Claude API: claude-3-5-haiku-20241022
⚠️  Pressione CTRL+C para parar
```

### 3. Acessar no navegador

Abra seu navegador e acesse:

```
http://localhost:5000
```

## 🎯 Como Usar

### 1. Obter API Key do Claude (Anthropic)

- Acesse: https://console.anthropic.com/settings/keys
- Faça login ou crie uma conta na Anthropic
- Clique em "Create Key" ou "Generate API Key"
- Copie a chave gerada (começa com "sk-ant-...")

### 2. Configurar na Interface

- Cole a API Key no campo correspondente
- Clique em "💾 Salvar" (fica salvo no navegador)
- Digite o título do vídeo
- (Opcional) Customize o prompt usando as variáveis `{titulo}` e `{idioma}`

### 3. Gerar Roteiros

- Clique em "🚀 Gerar Roteiros em Todos os Idiomas"
- Aguarde a geração (pode levar 5-15 minutos para todos os idiomas)
- Os roteiros aparecerão um por um na tela

### 4. Fazer Download

**Individual:**
- Clique em "📥 TXT" ou "📥 DOCX" em cada roteiro

**Em Massa:**
- Use os botões "📥 Baixar Todos (TXT ZIP)" ou "📥 Baixar Todos (DOCX ZIP)" no final da página

## 📁 Estrutura do Projeto

```
geradorr/
├── app.py              # Servidor Flask (backend)
├── requirements.txt    # Dependências Python
├── templates/
│   └── index.html     # Interface web
├── static/
│   ├── style.css      # Estilos
│   └── app.js         # JavaScript do frontend
└── COMO_EXECUTAR.md   # Este arquivo
```

## 🔧 Diferenças entre as Versões

### Versão JavaScript Pura (index.html + app.js na raiz)
- ✅ Mais simples, abre direto no navegador
- ❌ Não tem download de arquivos DOCX
- ❌ Não tem download ZIP
- Arquivo: `index.html` na raiz

### Versão Python Flask (templates/index.html + app.py) ⭐ RECOMENDADA
- ✅ Download TXT e DOCX
- ✅ Download em massa (ZIP)
- ✅ Processamento no servidor
- ✅ Usa Claude API corretamente
- ❌ Precisa rodar servidor Python
- Arquivos: `app.py` + `templates/index.html`

## ⚠️ Solução de Problemas

### Erro: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Erro: "Address already in use"
Outra instância do servidor está rodando. Feche e tente novamente ou use:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente do console da Anthropic
- Confirme que a chave começa com "sk-ant-"
- Certifique-se de que sua conta Anthropic está ativa

### Erro: "Rate limit exceeded"
- Você excedeu o limite de requisições da API
- Aguarde alguns minutos e tente novamente
- Considere espaçar as requisições

### Servidor não inicia
Verifique se o Python está instalado:
```bash
python --version
```

Deve mostrar Python 3.8 ou superior.

## 📝 Notas Importantes

- **Modelo usado**: Claude 3.5 Haiku (claude-3-5-haiku-20241022)
- **Limite de tokens**: 8.192 tokens por requisição
- Os roteiros são gerados em 2 partes de ~5.000 palavras cada
- Total: 10.000-12.000 palavras por roteiro
- **5 idiomas**: Português, Espanhol, Inglês, Russo, Árabe
- API Key fica salva no localStorage do navegador (seguro, local)
- Prompt customizado também fica salvo
- **Prompts imperativos** impedem a IA de fazer perguntas ao invés de gerar

## 🎨 Personalização do Prompt

O prompt padrão pode ser customizado. Use as variáveis:

- `{titulo}` - Será substituído pelo título do vídeo
- `{idioma}` - Será substituído pelo nome do idioma

Exemplo de prompt customizado:

```
Você é um roteirista especializado em {idioma}.
Crie um roteiro completo sobre "{titulo}" com:
- Introdução envolvente
- 10+ pontos principais
- Conclusão impactante

NÃO faça perguntas. COMECE A ESCREVER AGORA.
```

## 💡 Dicas

1. **Títulos claros**: Use títulos específicos e descritivos
2. **Aguarde pacientemente**: Cada idioma leva 2-3 minutos para gerar
3. **Salve suas configurações**: Use os botões "💾 Salvar" para API Key e Prompt
4. **Baixe em ZIP**: Use a opção ZIP para facilitar o download de todos os roteiros

## 🛑 Para parar o servidor

Pressione `CTRL+C` no terminal onde o servidor está rodando.

## 🚨 Custos da API

A API do Claude é paga. Verifique os custos em:
https://www.anthropic.com/pricing

O modelo Claude 3.5 Haiku é o mais econômico.

---

**Desenvolvido com Claude AI (Anthropic) • 2025**
