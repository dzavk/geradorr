# 🚀 Como Executar o Gerador de Roteiros (Versão Python)

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
🎬 Servidor iniciado!
📡 Acesse: http://localhost:5000
⚠️  Pressione CTRL+C para parar
```

### 3. Acessar no navegador

Abra seu navegador e acesse:

```
http://localhost:5000
```

## 🎯 Como Usar

1. **Obter API Key do Claude (Anthropic)**
   - Acesse: https://console.anthropic.com/settings/keys
   - Faça login ou crie uma conta na Anthropic
   - Clique em "Create Key" ou "Generate API Key"
   - Copie a chave gerada (começa com "sk-ant-...")

2. **Configurar na Interface**
   - Cole a API Key no campo correspondente
   - Clique em "💾 Salvar" (fica salvo no navegador)
   - Digite o título do vídeo
   - (Opcional) Customize o prompt

3. **Gerar Roteiros**
   - Clique em "🚀 Gerar Roteiros em Todos os Idiomas"
   - Aguarde a geração (pode levar 5-15 minutos)
   - Os roteiros aparecerão um por um

4. **Fazer Download**
   - **Individual**: Clique em "📥 TXT" ou "📥 DOCX" em cada roteiro
   - **Em Massa**: Use os botões "📥 Baixar Todos" no final

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

### Versão Python Flask (templates/index.html + app.py)
- ✅ Download TXT e DOCX
- ✅ Download em massa (ZIP)
- ✅ Processamento no servidor
- ❌ Precisa rodar servidor Python
- Arquivos: `app.py` + `templates/index.html`

## ⚠️ Solução de Problemas

### Erro: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Erro: "Address already in use"
Outra instância do servidor está rodando. Feche e tente novamente.

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente
- Confirme que a API está ativada no Google Cloud

### Servidor não inicia
Verifique se o Python está instalado:
```bash
python --version
```

## 📝 Notas

- **Modelo usado**: Claude 3.5 Haiku (claude-3-5-haiku-20241022)
- **Limite de tokens**: 8.192 tokens por requisição
- Os roteiros são gerados em 2 partes de ~5.000 palavras cada
- Total: 10.000-12.000 palavras por roteiro
- 5 idiomas: Português, Espanhol, Inglês, Russo, Árabe
- API Key fica salva no localStorage do navegador
- Prompt customizado também fica salvo
- Prompts imperativos impedem a IA de fazer perguntas

## 🛑 Para parar o servidor

Pressione `CTRL+C` no terminal onde o servidor está rodando.

---

**Desenvolvido com Claude AI (Anthropic) • 2025**
