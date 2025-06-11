import { useEffect } from "react";
import Chatbot from "./Chatbot";

function App() {
  useEffect(() => {
    // Disable scrolling
    document.body.classList.add("overflow-hidden");

    // Re-enable scrolling when component unmounts (optional)
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return <Chatbot />;
}

export default App;