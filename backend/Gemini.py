def geminiApp(prompt):
    import google.generativeai as genai
    from GeminiHist import data

    # Configure your Gemini API key (replace "Abc" with your real key)
    genai.configure(api_key="abc")
    
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config=generation_config,
        system_instruction="You are a blockchain expert. Answer questions strictly related to blockchain, cryptocurrencies, smart contracts, DeFi, NFTs, and blockchain security. If a question is outside these topics, respond: 'I'm sorry, but I can only help with blockchain-related questions.'",
    )

    chat_session = model.start_chat(history=data)
    response = chat_session.send_message(prompt)
    return response.text
