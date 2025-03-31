from flask import Flask, request, jsonify
from flask_cors import CORS
from Gemini import geminiApp

app = Flask(__name__)
# Allow requests from http://localhost:3000 and enable credentials
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/output', methods=['POST'])
def handlePrompt():
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({'error': 'Prompt parameter is missing'}), 400
    prompt = data['prompt']
    response = geminiApp(prompt)
    return jsonify({'prompt': prompt, 'output': response})

if __name__ == '__main__':
    app.run(debug=True)
