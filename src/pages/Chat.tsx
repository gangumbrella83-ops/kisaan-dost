import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("auto");

  const langPrompt = {
    auto: "Reply in the user's language.",
    english: "Reply only in English.",
    urdu: "جواب صرف اردو میں دیں۔",
    punjabi: "جواب صرف پنجابی ਵਿੱਚ ਦਿਓ۔",
    sindhi: "جواب صرف سنڌي ۾ ڏيو.",
    pashto: "ځواب يوازې په پښتو کې ورکړئ."
  }[language];

  // ✅ Text to Speech Function
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang =
      language === "urdu" ? "ur-PK" :
      language === "punjabi" ? "pa-IN" :
      language === "sindhi" ? "sd-PK" :
      language === "pashto" ? "ps-PK" :
      "en-US";
      
    window.speechSynthesis.speak(speech);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: "You are a multilingual agriculture assistant for Pakistan." },
            { role: "system", content: langPrompt },
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
          },
        }
      );

      const botReply = res.data.choices[0].message.content;
      const aiMessage = { role: "assistant", content: botReply };

      setMessages((prev) => [...prev, aiMessage]);

      // ✅ Auto speak AI reply if Urdu/Punjabi etc.
      speak(botReply);
      
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Error: API failed" }]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border">
      
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-lime-400 text-white p-4 flex items-center gap-3">
        <span className="bg-white/20 p-2 rounded-full"><BsRobot size={24} /></span>
        <h2 className="text-lg font-bold">🌾 KISAAN-DOST 🌾</h2>
      </div>

      {/* Language Buttons */}
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
        {[
          ["auto", "🌐 Auto"],
          ["english", "🇬🇧 EN"],
          ["urdu", "🇵🇰 UR"],
          ["punjabi", "🟢 PN"],
          ["sindhi", "💛 SD"],
          ["pashto", "🔵 PS"],
        ].map(([code, label]) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`px-3 py-1 rounded-full text-sm border ${
              language === code ? "bg-green-600 text-white" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-96 p-3 overflow-y-auto space-y-2 bg-gray-100">
        {messages.map((m, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`max-w-[80%] p-2 rounded-xl ${
                m.role === "user"
                  ? "bg-green-500 text-white ml-auto"
                  : "bg-white border text-gray-800"
              }`}
            >
              {m.content}
            </div>

            {/* ✅ Speaker button only for AI */}
            {m.role === "assistant" && (
              <button onClick={() => speak(m.content)} className="text-green-600">
                <HiSpeakerWave size={20} />
              </button>
            )}
          </div>
        ))}

        {loading && <div className="text-gray-500 italic text-sm">⏳ AI thinking…</div>}
      </div>

      <div className="flex gap-2 p-3 bg-white border-t">
        <input
          className="flex-1 border rounded-full px-4 py-2 focus:outline-green-500"
          placeholder="Ask about crops, soil, pests..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700"
        >
          <FiSend size={18}/>
        </button>
      </div>
    </div>
  );
};

export default Chat;
