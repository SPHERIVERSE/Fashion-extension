from flask import Flask, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data['prompt']
        api_key = os.environ.get("GOOGLE_API_KEY")

        if not api_key:
            return jsonify({'error': 'GOOGLE_API_KEY environment variable not set'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)
        return jsonify({'result': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
