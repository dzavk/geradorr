from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import requests
import io
import zipfile
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
import time
import os

app = Flask(__name__)
CORS(app)

# Configuração da API Claude
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_MODEL = "claude-3-5-haiku-20241022"  # Modelo que funciona com sua API Key

# Prompt padrão para roteiros longos
PROMPT_PADRAO = """VOCÊ É UM ROTEIRISTA PROFISSIONAL. Seu trabalho é ESCREVER IMEDIATAMENTE um roteiro completo.

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

[INÍCIO DO ROTEIRO]"""

# Idiomas suportados
IDIOMAS = {
    'portugues': {'nome': 'português brasileiro', 'flag': '🇧🇷'},
    'espanhol': {'nome': 'espanhol', 'flag': '🇪🇸'},
    'ingles': {'nome': 'inglês', 'flag': '🇺🇸'},
    'russo': {'nome': 'russo', 'flag': '🇷🇺'},
    'arabe': {'nome': 'árabe', 'flag': '🇸🇦'}
}

def chamar_claude_api(api_key, prompt):
    """Faz chamada para a API do Claude"""
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }

    data = {
        "model": CLAUDE_MODEL,
        "max_tokens": 8192,  # Limite do Haiku
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(CLAUDE_API_URL, headers=headers, json=data, timeout=300)
    response.raise_for_status()

    result = response.json()
    return result['content'][0]['text']

def gerar_roteiro_longo(api_key, titulo, custom_prompt, idioma_info):
    """Gera um roteiro longo em 2 partes"""

    # PARTE 1: Gerar primeira metade do roteiro
    prompt_parte1 = custom_prompt.replace('{titulo}', titulo).replace('{idioma}', idioma_info['nome'])
    prompt_parte1 += """

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

🚀 COMECE A ESCREVER AGORA! Escreva direto em """ + idioma_info['nome'] + ":"

    texto_parte1 = chamar_claude_api(api_key, prompt_parte1)

    # Pequena pausa entre as requisições
    time.sleep(2)

    # PARTE 2: Continuar e finalizar o roteiro
    prompt_parte2 = f"""VOCÊ É UM ROTEIRISTA PROFISSIONAL. Continue escrevendo o roteiro sobre "{titulo}" em {idioma_info['nome']}.

━━━━━━━━━━━━━━━━━━━━━━
⚠️ INSTRUÇÕES PARA PARTE 2/2:
━━━━━━━━━━━━━━━━━━━━━━

Esta é a SEGUNDA E ÚLTIMA PARTE do roteiro.

📄 PARTE 1 JÁ ESCRITA:
{texto_parte1}

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

🚀 CONTINUE ESCREVENDO AGORA em {idioma_info['nome']}:"""

    texto_parte2 = chamar_claude_api(api_key, prompt_parte2)

    # Juntar as duas partes
    roteiro_completo = texto_parte1 + '\n\n' + texto_parte2

    return roteiro_completo

def contar_estatisticas(texto):
    """Conta palavras e caracteres"""
    palavras = len(texto.split())
    caracteres = len(texto)
    return {'palavras': palavras, 'caracteres': caracteres}

def criar_docx(titulo, idioma, conteudo):
    """Cria um documento DOCX formatado"""
    doc = Document()

    # Título
    titulo_para = doc.add_heading(f'Roteiro: {titulo}', 0)
    titulo_para.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER

    # Subtítulo com idioma
    subtitulo = doc.add_paragraph(f'Idioma: {idioma}')
    subtitulo.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
    subtitulo.runs[0].bold = True

    doc.add_paragraph()  # Espaço

    # Conteúdo do roteiro
    paragrafos = conteudo.split('\n')
    for paragrafo in paragrafos:
        if paragrafo.strip():
            p = doc.add_paragraph(paragrafo)
            p.style.font.size = Pt(12)
            p.style.font.name = 'Arial'

    return doc

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/api/gerar-roteiros', methods=['POST'])
def gerar_roteiros():
    """Endpoint para gerar roteiros"""
    try:
        data = request.json
        api_key = data.get('apiKey')
        titulo = data.get('titulo')
        custom_prompt = data.get('customPrompt', PROMPT_PADRAO)

        if not api_key or not titulo:
            return jsonify({'error': 'API Key e título são obrigatórios'}), 400

        roteiros = {}

        # Gerar roteiros para cada idioma
        for idioma_key, idioma_info in IDIOMAS.items():
            try:
                roteiro = gerar_roteiro_longo(api_key, titulo, custom_prompt, idioma_info)
                stats = contar_estatisticas(roteiro)

                roteiros[idioma_key] = {
                    'conteudo': roteiro,
                    'stats': stats,
                    'idioma': idioma_info['nome'],
                    'flag': idioma_info['flag']
                }

                # Pausa entre idiomas
                if idioma_key != 'arabe':
                    time.sleep(2)

            except Exception as e:
                roteiros[idioma_key] = {
                    'erro': str(e),
                    'idioma': idioma_info['nome'],
                    'flag': idioma_info['flag']
                }

        return jsonify({
            'sucesso': True,
            'roteiros': roteiros
        })

    except Exception as e:
        return jsonify({
            'sucesso': False,
            'erro': str(e)
        }), 500

@app.route('/api/download-txt/<idioma>', methods=['POST'])
def download_txt(idioma):
    """Download roteiro como TXT"""
    try:
        data = request.json
        conteudo = data.get('conteudo')
        titulo = data.get('titulo', 'roteiro')

        if not conteudo:
            return jsonify({'error': 'Conteúdo não fornecido'}), 400

        # Criar arquivo em memória
        buffer = io.BytesIO()
        buffer.write(conteudo.encode('utf-8'))
        buffer.seek(0)

        filename = f'{titulo}_{idioma}.txt'

        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='text/plain'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-docx/<idioma>', methods=['POST'])
def download_docx(idioma):
    """Download roteiro como DOCX"""
    try:
        data = request.json
        conteudo = data.get('conteudo')
        titulo = data.get('titulo', 'roteiro')
        idioma_nome = data.get('idiomaNome', idioma)

        if not conteudo:
            return jsonify({'error': 'Conteúdo não fornecido'}), 400

        # Criar documento
        doc = criar_docx(titulo, idioma_nome, conteudo)

        # Salvar em memória
        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        filename = f'{titulo}_{idioma}.docx'

        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-zip', methods=['POST'])
def download_zip():
    """Download todos os roteiros como ZIP"""
    try:
        data = request.json
        roteiros = data.get('roteiros', {})
        titulo = data.get('titulo', 'roteiros')
        formato = data.get('formato', 'txt')

        if not roteiros:
            return jsonify({'error': 'Nenhum roteiro fornecido'}), 400

        # Criar ZIP em memória
        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for idioma_key, roteiro_data in roteiros.items():
                conteudo = roteiro_data.get('conteudo')
                if not conteudo:
                    continue

                if formato == 'txt':
                    filename = f'{titulo}_{idioma_key}.txt'
                    zip_file.writestr(filename, conteudo.encode('utf-8'))

                elif formato == 'docx':
                    idioma_nome = roteiro_data.get('idioma', idioma_key)
                    doc = criar_docx(titulo, idioma_nome, conteudo)

                    # Salvar DOCX em buffer temporário
                    docx_buffer = io.BytesIO()
                    doc.save(docx_buffer)
                    docx_buffer.seek(0)

                    filename = f'{titulo}_{idioma_key}.docx'
                    zip_file.writestr(filename, docx_buffer.read())

        zip_buffer.seek(0)

        filename = f'{titulo}_todos_roteiros.zip'

        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/zip'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Criar pasta templates se não existir
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)

    print('🎬 Servidor iniciado!')
    print('📡 Acesse: http://localhost:5000')
    print('⚠️  Pressione CTRL+C para parar')

    app.run(debug=True, host='0.0.0.0', port=5000)
