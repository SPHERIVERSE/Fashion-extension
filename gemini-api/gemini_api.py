from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import traceback # Import traceback module

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        prompt = data['prompt']
        api_key = os.environ.get("GOOGLE_API_KEY")

        print(f"Received prompt: {prompt}") # Log the prompt
        print(f"API key being used: {api_key}") # Log the api key

        if not api_key:
            return jsonify({'error': 'GOOGLE_API_KEY environment variable not set'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)

        print(f"Gemini API Response: {response.text}") # Log the response

        return jsonify({'result': response.text})

    except Exception as e:
        error_message = traceback.format_exc() #get the full error information.
        print(f"Error generating content: {error_message}") # Log the full error
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
