# 🎬 Gerador de Roteiros com IA

Aplicação web para gerar roteiros detalhados e extensos para vídeos em múltiplos idiomas usando Google Gemini AI.

## ✨ Funcionalidades

- 🌍 **5 Idiomas**: Português, Espanhol, Inglês, Russo e Árabe
- 📝 **Roteiros Extensos**: 10.000-12.000 palavras por roteiro
- 💾 **Salvar API Key**: Sua chave fica salva no navegador
- ⚙️ **Prompt Customizável**: Personalize como os roteiros são gerados
- 📊 **Estatísticas**: Veja contagem de palavras e caracteres
- 📋 **Copiar Fácil**: Botão para copiar roteiros com um clique
- 🎨 **Interface Moderna**: Design responsivo e profissional

## 🚀 Como Usar

### 1. Obter API Key do Google Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Configurar a Aplicação

1. Abra o arquivo `index.html` no navegador
2. Cole sua API Key no campo correspondente
3. Clique em "💾 Salvar" para salvar a chave
4. Digite o título do seu vídeo
5. (Opcional) Customize o prompt de geração

### 3. Gerar Roteiros

1. Clique no botão "🚀 Gerar Roteiros em Todos os Idiomas"
2. Aguarde a geração (pode levar alguns minutos)
3. Os roteiros aparecerão um por um conforme forem gerados
4. Clique em "📋 Copiar" para copiar o roteiro desejado

## 📁 Estrutura do Projeto

```
geradorr/
├── index.html      # Interface principal
├── style.css       # Estilos e design
├── app.js          # Lógica da aplicação
└── README.md       # Documentação
```

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica da aplicação
- **Google Gemini AI**: Geração de conteúdo com IA
- **LocalStorage**: Armazenamento local das configurações

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

A aplicação salva automaticamente no navegador:
- ✅ API Key do Gemini
- ✅ Prompt customizado

## 🎯 Idiomas Suportados

| Idioma | Código | Flag |
|--------|--------|------|
| Português | portugues | 🇧🇷 |
| Espanhol | espanhol | 🇪🇸 |
| Inglês | ingles | 🇺🇸 |
| Russo | russo | 🇷🇺 |
| Árabe | arabe | 🇸🇦 |

## ⚠️ Limites e Considerações

- **Tempo de Geração**: 5-15 minutos para todos os idiomas
- **Cota da API**: Respeite os limites gratuitos do Google Gemini
- **Conexão**: Necessária internet estável
- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)

## 🐛 Solução de Problemas

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente (sem espaços)
- Confirme que a API está ativada no Google Cloud

### Erro: "Cota excedida"
- Aguarde um tempo antes de gerar novos roteiros
- Considere criar uma nova API Key

### Roteiros não aparecem
- Verifique a conexão com internet
- Abra o Console do navegador (F12) para ver erros
- Tente gerar novamente

## 📝 Licença

Este projeto é de código aberto e pode ser usado livremente.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando Google Gemini AI

---

**Última atualização**: Dezembro 2025
