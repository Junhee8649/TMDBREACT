import React, { useState } from "react";
import "./ChatApp.css";
function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = {
      role: "user",
      content: input,
    };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMessage),
      });
      if (!response.ok) {
        throw new Error("API 요청이 실패했습니다");
      }
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다, 오류가 발생했습니다: " + error.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI 채팅</h1>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>AI와 대화를 시작해보세요</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === "user" ? "user-message" : "ai-message"}`}
            >
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message ai-message">
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "전송 중..." : "전송"}
        </button>
      </form>
    </div>
  );
}
export default ChatInterface;
