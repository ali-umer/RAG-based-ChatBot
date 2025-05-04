const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
  
    addMessage(query, "user");
    input.value = "";
  
    // Create bot message bubble with typing animation inside
    const botMsg = document.createElement("div");
    botMsg.classList.add("message", "bot");
    botMsg.innerHTML = `<span class="loader"><span>.</span><span>.</span><span>.</span></span>`;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    try {
      const response = await fetch("http://192.168.100.104:5050/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      let started = false;
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
  
        if (!started) {
          // Remove the loader
          botMsg.querySelector(".loader").remove();
          started = true;
        }
  
        botMsg.textContent += chunk;
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    } catch (err) {
      botMsg.textContent = "⚠️ Failed to get response from model.";
    }
  });
  
function addMessage(text, role) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}