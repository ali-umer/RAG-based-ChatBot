import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";


function TypingDots() {
  return (
    <span className="flex space-x-1 animate-pulse">
      <span>.</span>
      <span className="animate-delay-200">.</span>
      <span className="animate-delay-400">.</span>
    </span>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const typingPlaceholder = { sender: "bot", text: <TypingDots /> };

    setMessages((prev) => [...prev, userMessage, typingPlaceholder]);
    setInput("");

    try {
      const res = await fetch("https://373e-203-99-61-238.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botReply += chunk;

        // Replace the last bot message (typing) with updated response
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            sender: "bot",
            text: botReply,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠️ Failed to get response from model.",
        };
        return updated;
      });
    }
  };
  

  return (
    <div className="overflow-hidden overscroll-none">
      <div className="min-h-[100dvh] bg-[#1e1f22] flex items-center justify-center p-4">
        <div className="w-full max-w-3xl h-[80vh] bg-[#2b2d31] rounded-xl shadow-lg flex flex-col overflow-hidden border border-[#3a3b3e]">
          <div className="px-6 py-4 border-b border-[#3a3b3e]">
            <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-sm">FAST Nuces AI Chat Assistant</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
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
    </div>
  );
}