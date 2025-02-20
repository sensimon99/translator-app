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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

const detectLanguage = async (text) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;

  try {
      const response = await fetch(url);
      const data = await response.json();

      // Extract detected language from API response
      let detectedLang = data[2]; // Language code (e.g., 'en')

      console.log("Detected Language:", detectedLang);
      return detectedLang;
  } catch (error) {
      console.error("Error detecting language:", error);
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
    if (!message.trim()) {
      setErrorMessage("Please enter a message");

      setTimeout(() => {
        setErrorMessage("");
      }, 1000);

      return;
    }

    setErrorMessage("");
    setLoading(true);

    let sourceLang = selectedSourceLanguage.includes("Detect") ? "auto" : selectedSourceLanguage.match(/\((.*?)\)/)[1];
    let targetLang = selectedTargetLanguage.match(/\((.*?)\)/)[1];

    if (sourceLang === "auto") {
      const detectedLang = await detectLanguage(message);
      if (!detectedLang) {
        alert("Could not detect language. Please try again.");
        setLoading(false);
        return;
      }
      sourceLang = detectedLang;
    }

    const translatedText = await translateText(message, sourceLang, targetLang);
    setChatHistory([...chatHistory, { text: message, translated: translatedText }]);
    setMessage(""); // Clear textarea after sending
    setLoading(false);
  };


  const summarizeText = async () => {
    if (!message.trim() || message.split(' ').length < 150) {
      alert('Text must be at least 150 words to summarize.');
      return;
    }

    console.log("Message has more than 150 words. Proceeding...");

    setLoading(true);

    let sourceLang = selectedSourceLanguage.includes('Detect')
      ? 'auto'
      : selectedSourceLanguage.match(/\((.*?)\)/)[1];

    console.log("Source Language:", sourceLang);

    let textToSummarize = message;

    if (sourceLang !== 'en') {
      console.log("Translating text to English before summarization...");
      textToSummarize = await translateText(textToSummarize, sourceLang, 'en');
      console.log("Translated text:", textToSummarize);
    }

    if (!window.ai?.summarizer) {
      alert('Summarization is not supported in this browser.');
      setLoading(false);
      return;
    }

    console.log("Summarization API is available. Creating summarizer...");

    try {
      const summarizer = await window.ai.summarizer.create();
      console.log("Summarizer created. Summarizing text...");

      const summary = await summarizer.summarize({ text: textToSummarize });
      console.log("Summary received:", summary);

      setMessage(summary);

      setChatHistory([...chatHistory, { text: message, translated: summary }]);

      console.log("Chat history updated.");
    } catch (error) {
      console.error("❌ Summarization error:", error);
      alert('Error summarizing text. Please try again.');
    }

    setLoading(false);
  };

  const testSummarizer = async () => {
    if (!window.ai?.summarizer) {
      console.error("AI Summarizer is not available in this browser.");
      return;
    }
    console.log("Creating summarizer...");
    try {
      const summarizer = await window.ai.summarizer.create();
      console.log("Summarizer created:", summarizer);
    } catch (error) {
      console.error("Error creating summarizer:", error);
    }
  };

  const handleMessageChange = async (e) => {
    const text = e.target.value;
    setMessage(text);

    if (selectedSourceLanguage === "Detect language" && text.trim().length > 3) {
      const detectedLang = await detectLanguage(text);
      console.log("🔍 Detected Language Code:", detectedLang);

      if (!detectedLang) return;

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
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <main className='chat-body'>
        <button className="menu-bar" onClick={toggleSidebar}>
          ☰
        </button>
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={toggleSidebar}>✖</button>
          <div className='deepsearch-main'>
            <h1 className='deepsearch-i'>DeepSearch</h1>
            <button className='new-chat-i'>New Chat</button>
          </div>

          <div className='user-details'>
            <div className='user-container'>
              <div className='user-info'>
                <h3 className='user-name'>Omawunmi</h3>
                <h3 className='user-email'>Oma@gmail.com</h3>
              </div>
              <div className='user-svg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.25008 3.33341C6.71032 3.33342 7.08342 2.96032 7.08342 2.50008C7.08342 2.03984 6.71032 1.66675 6.25008 1.66675H5.00008C3.15913 1.66675 1.66675 3.15913 1.66675 5.00008V15.0001C1.66675 16.841 3.15913 18.3334 5.00008 18.3334H6.25008C6.71032 18.3334 7.08341 17.9603 7.08341 17.5001C7.08341 17.0398 6.71032 16.6667 6.25008 16.6667H5.00008C4.07961 16.6667 3.33341 15.9206 3.33341 15.0001L3.33342 5.00008C3.33342 4.07961 4.07961 3.33341 5.00008 3.33341H6.25008Z" fill="#000501" />
                  <path d="M18.9227 10.5893C19.2481 10.2639 19.2481 9.73626 18.9227 9.41083L15.5893 6.07749C15.2639 5.75206 14.7363 5.75206 14.4108 6.07749C14.0854 6.40293 14.0854 6.93057 14.4108 7.256L16.3216 9.16675L6.66675 9.16675C6.20651 9.16675 5.83341 9.53984 5.83341 10.0001C5.83341 10.4603 6.20651 10.8334 6.66675 10.8334L16.3216 10.8334L14.4108 12.7442C14.0854 13.0696 14.0854 13.5972 14.4108 13.9227C14.7363 14.2481 15.2639 14.2481 15.5893 13.9227L18.9227 10.5893Z" fill="#000501" />
                </svg>
              </div>
            </div>
          </div>
        </aside>

        <header>AI Translator</header>

        <div className="chat-container">
          <div className="chat-box" ref={chatBoxRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className="chat-message">
                <div className="original-main">
                  <p className="original">{msg.text}</p>
                </div>

                <div className="translated-main">
                  <p className="translated">{msg.translated}</p>
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
                  <li onClick={() => {
                    setSelectedSourceLanguage("Detect language");
                    setSourceDropdownOpen(false);
                  }}>
                    Detect language
                  </li>
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
            
            <div className="language-i" onClick={() => {
              if (selectedSourceLanguage) {
                const temp = selectedSourceLanguage;
                setSelectedSourceLanguage(selectedTargetLanguage);
                setSelectedTargetLanguage(temp);
              }
            }}>
              <h5>Translate to</h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5.25 7.5L3 5.25M3 5.25L5.25 3M3 5.25H15M12.75 10.5L15 12.75M15 12.75L12.75 15M15 12.75H3"
                  stroke="#0A090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                  {languages.filter(lang => lang !== "Detect language").map((lang) => (
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
              className={`chat-input ${errorMessage ? "error" : ""}`}
              value={message}
              onChange={handleMessageChange}
              placeholder={errorMessage || "Type a message..."}
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