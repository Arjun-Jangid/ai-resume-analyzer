import { useState, useRef, useEffect } from "react";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import sendImg from "../assets/send.png";
import { CHAT_URL } from "../utils/constants";

function Chat() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const chatHandler = async () => {
    if (!query) {
      return;
    }

    setHistory((prev) => [...prev, { type: "user", text: query }]);

    const formData = new FormData();
    formData.append("query", query);

    try {
      setLoading(true);
      const response = await fetch(CHAT_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setHistory((prev) => [...prev, { type: "bot", text: data.answer }]);
    } catch (error) {
      console.error("Error", error);
      alert("An error occurred while sending the query.");
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <h2 className="chat_heading">Resume Insights Assistant</h2>
        <div className="question_box">
          <input
            className="question_input"
            type="text"
            required
            placeholder="Ask your query"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query) {
                chatHandler();
              }
            }}
            value={query}
          />
          <button
            className={`sendBtn ${query ? "active" : "deactive"}`}
            onClick={chatHandler}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <img className="sendImg" src={sendImg} alt="Submit" />
            )}
          </button>
        </div>
      </div>
      <div className="history">
        {history &&
          history.map((item, index) => (
            <div
              key={index}
              className={item.type === "user" ? "query_box" : "chat_box"}
            >
              <div className="message">
                <ReactMarkdown>{item.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
}

export default Chat;
