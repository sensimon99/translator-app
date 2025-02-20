import React, { useState, useEffect, useRef } from 'react';
import './ChatArea.css';


const languages = ['English (en)', 'Portuguese (pt)', 'Spanish (es)', 'Russian (ru)', 'Turkish (tr)', 'French (fr)'];

const ChatArea = () => {
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('Detect language');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('English (en)');
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const detectLanguage = async (text) => {
    if (!self.ai?.languageDetector) return null;
    try {
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect({ text });
      return results[0]?.detectedLanguage || null;
    } catch {
      return null;
    }
  };

  const translateText = async (text, fromLang, toLang) => {
    if (!self.ai?.translator) return text;
    try {
      const translator = await self.ai.translator.create({ sourceLanguage: fromLang, targetLanguage: toLang });
      const response = await translator.translate(text);
      return typeof response === 'string' ? response : response.translation || text;
    } catch {
      return text;
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    let sourceLang = selectedSourceLanguage.includes('Detect') ? 'auto' : selectedSourceLanguage.match(/\((.*?)\)/)[1];
    let targetLang = selectedTargetLanguage.match(/\((.*?)\)/)[1];

    if (sourceLang === 'auto') {
      const detectedLang = await detectLanguage(message);
      if (!detectedLang) {
        alert('Could not detect language. Please try again.');
        setLoading(false);
        return;
      }
      sourceLang = detectedLang;
    }

    const translatedText = await translateText(message, sourceLang, targetLang);
    setChatHistory([...chatHistory, { text: message, translated: translatedText }]);
    setMessage('');
    setLoading(false);
  };


  const summarizeText = async () => {
    if (!message.trim() || message.split(' ').length < 150) {
      alert('Text must be at least 150 words to summarize.');
      return;
    }

    console.log("✅ Message has more than 150 words. Proceeding...");

    setLoading(true);

    let sourceLang = selectedSourceLanguage.includes('Detect')
      ? 'auto'
      : selectedSourceLanguage.match(/\((.*?)\)/)[1];

    console.log("🌍 Source Language:", sourceLang);

    let textToSummarize = message;

    // Translate to English before summarization if needed
    if (sourceLang !== 'en') {
      console.log("🔄 Translating text to English before summarization...");
      textToSummarize = await translateText(textToSummarize, sourceLang, 'en');
      console.log("✅ Translated text:", textToSummarize);
    }

    // Check if the AI summarization API is available
    if (!window.ai?.summarizer) {
      alert('Summarization is not supported in this browser.');
      setLoading(false);
      return;
    }

    console.log("🧠 Summarization API is available. Creating summarizer...");

    try {
      const summarizer = await window.ai.summarizer.create();
      console.log("✅ Summarizer created. Summarizing text...");

      const summary = await summarizer.summarize({ text: textToSummarize });
      console.log("✅ Summary received:", summary);

      // ✅ Update the textarea with the summarized text
      setMessage(summary);

      // ✅ Save both original and summary in chat history
      setChatHistory([...chatHistory, { text: message, translated: summary }]);

      console.log("📜 Chat history updated.");
    } catch (error) {
      console.error("❌ Summarization error:", error);
      alert('Error summarizing text. Please try again.');
    }

    setLoading(false);
  };

  const testSummarizer = async () => {
    if (!window.ai?.summarizer) {
      console.error("❌ AI Summarizer is not available in this browser.");
      return;
    }
    console.log("🧠 Creating summarizer...");
    try {
      const summarizer = await window.ai.summarizer.create();
      console.log("✅ Summarizer created:", summarizer);
    } catch (error) {
      console.error("❌ Error creating summarizer:", error);
    }
  };


  const handleMessageChange = async (e) => {
    const text = e.target.value;
    setMessage(text);

    // Only detect language if "Detect language" is selected
    if (selectedSourceLanguage === "Detect language" && text.trim().length > 3) {
      const detectedLang = await detectLanguage(text);
      console.log("🔍 Detected Language Code:", detectedLang);

      if (!detectedLang) return; // Do nothing if detection fails

      const supportedLanguages = {
        en: "English (en)",
        pt: "Portuguese (pt)",
        es: "Spanish (es)",
        ru: "Russian (ru)",
        tr: "Turkish (tr)",
        fr: "French (fr)",
      };

      if (supportedLanguages[detectedLang]) {
        setSelectedSourceLanguage(supportedLanguages[detectedLang]);
      }
    }
  };
  return (
    <div>
      <main className='chat-body'>
        <header>AI Translator</header>
        {/* <div className='greeting'>Hi, how can I be of help?</div> */}

        <div className="chat-container">
          <div className="chat-box" ref={chatBoxRef}> {/* Add ref here */}
            {chatHistory.map((msg, index) => (
              <div key={index} className="chat-message">
                {/* Original Text */}
                <div className="original-main">
                  <p className="original">{msg.text}</p>
                  <p className="language-label">({msg.detectedLanguage})</p>
                </div>

                {/* Translated Text */}
                <div className="translated-main">
                  <p className="translated">{msg.translated}</p>
                  {/* <p className="language-label">({msg.translatedLanguage})</p> */}
                  <p className="language-label">({msg.detectedLanguage})</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="textarea-main">
          <div className='languages-main'>
            {/* Source Language */}
            <div className="language">
              <h5 className='dropdown-toggle' onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}>
                {selectedSourceLanguage}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="">
                  <path d="M5.83325 8.33325L10.0006 12.1499L14.1666 8.33325" stroke="#9499A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </h5>
              {sourceDropdownOpen && (
                <ul className="dropdown">
                  {languages.map((lang) => (
                    <li key={lang} onClick={() => {
                      setSelectedSourceLanguage(lang);
                      setSourceDropdownOpen(false);
                    }}>
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="language-i">
              <h5>Translate to</h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5.25 7.5L3 5.25M3 5.25L5.25 3M3 5.25H15M12.75 10.5L15 12.75M15 12.75L12.75 15M15 12.75H3" stroke="#0A090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Target Language */}
            <div className="language">
              <h5 className='dropdown-toggle' onClick={() => setTargetDropdownOpen(!targetDropdownOpen)}>
                {selectedTargetLanguage}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="">
                  <path d="M5.83325 8.33325L10.0006 12.1499L14.1666 8.33325" stroke="#9499A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </h5>
              {targetDropdownOpen && (
                <ul className="dropdown-i">
                  {languages.map((lang) => (
                    <li key={lang} onClick={() => {
                      setSelectedTargetLanguage(lang);
                      setTargetDropdownOpen(false);
                    }}>
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="input-container">
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Type a message..."
            ></textarea>

            <button className="send-button" onClick={handleSend}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.4322 4.0612C20.8183 3.8998 21.22 4.25585 21.1062 4.65856L16.9945 19.2003C16.9069 19.5104 16.553 19.6578 16.2711 19.5016L11.9004 17.0806L8.57687 20.0765L9.08837 15.8618L9.25236 15.6138L9.23723 15.6055L17.8407 7.21288L6.89056 14.3056L3.07739 12.1934C2.7118 11.9909 2.74124 11.4559 3.12684 11.2947L20.4322 4.0612Z" fill="#1751D0" />
              </svg>
            </button>
          </div>
          <div className='lang-div'>
            <button className='summarize-btn' onClick={summarizeText}>
              Summarize
            </button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatArea;