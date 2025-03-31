import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AITradingInsights.css";

const AITradingInsights = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // Typing Effect for AI Response
  const typeResponse = (text) => {
    let i = 0;
    let tempText = "";
    setLoading(false);
    
    const interval = setInterval(() => {
      tempText += text[i];
      setMessages((prev) => [...prev.slice(0, -1), { text: tempText, type: "ai" }]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50); // Typing speed
  };

  // Chatbot interaction
  const askChatbot = async () => {
    if (!chatInput.trim()) return;
    
    setMessages([...messages, { text: chatInput, type: "user" }, { text: "AI is typing...", type: "ai" }]);
    setChatInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/output",
        { prompt: chatInput },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setTimeout(() => {
        typeResponse(response.data.output);
      }, 1000); // Simulate AI thinking delay
    } catch (error) {
      console.error("Error chatting with AI:", error);
      setMessages([...messages, { text: "Error getting chatbot response. Please try again.", type: "ai" }]);
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h2 className="title">AI Trading Chatbot</h2>
      
      <div className="chat-box" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.type === "user" ? "user-message" : "ai-message"}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Ask a trading-related question..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="input-box"
        />
        <button className="action-btn" onClick={askChatbot} disabled={loading}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>
    </div>
  );
};

export default AITradingInsights;
