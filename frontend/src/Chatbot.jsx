import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    simulateBotResponse(input);
    setInput("");
  };

  const simulateBotResponse = (text) => {
    setTimeout(() => {
      const reply = `You said: "${text}"`;
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[80vh] bg-[#2b2d31] rounded-xl shadow-lg flex flex-col overflow-hidden border border-[#3a3b3e]">
        <div className="px-6 py-4 border-b border-[#3a3b3e]">
          <h1 className="text-white text-xl font-medium">AI Chat Assistant</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-[#3a3b3e] text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-[#3a3b3e] flex items-center gap-2 bg-[#2b2d31]">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-md bg-[#404249] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}