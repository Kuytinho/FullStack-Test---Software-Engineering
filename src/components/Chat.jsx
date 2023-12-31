import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import Header from './Header';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showExportLink, setShowExportLink] = useState(false);
  const messageContainerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const storeConversation = (conversation) => {
    fetch('https://kuytinhochatapi.up.railway.app/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversation),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Conversa armazenada com sucesso no banco de dados!');
        } else {
          console.error('Erro ao armazenar a conversa no banco de dados.');
        }
      })
      .catch((error) => {
        console.error('Erro ao enviar a conversa para o servidor:', error);
      });
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://kuytinhochatapi.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
  
      if (response.ok) {
        setLoggedIn(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Welcome, ${username}! How can I help you today?`, sender: 'bot', timestamp: new Date() },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Login failed.', sender: 'bot', timestamp: new Date() },
        ]);
      }
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleLoanOptions = () => {
    handleNewMessage('Please click at one of the option bellow:')
    handleNewMessage('Do you want to apply for a loan?', 'loan-apply', 'option-button');
    handleNewMessage('Loan conditions', 'loan-conditions', 'option-button');
    handleNewMessage('Help', 'help', 'option-button');
  };

  const handleNewMessage = (text, link, sender = 'bot', className = '') => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender, timestamp: new Date(), link, className },
    ]);
  };

  const handleUserMessage = (e) => {
    e.preventDefault();
    const userMessage = e.target.elements.message.value;
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: 'user', timestamp: new Date() },
    ]);
  
    if (!isLoggedIn) {
      handleFormSubmit(e); 
    } else if (userMessage.toLowerCase().includes('hello')) {
      handleNewMessage('Hello! How can I help you today?');
    } else if (userMessage.toLowerCase().includes('goodbye')) {
      handleNewMessage('Goodbye! Have a nice day!');
      setLoggedIn(false); 
      setShowExportLink(true); 
    } else if (userMessage.toLowerCase().includes('good')) {
      handleNewMessage('I\'m glad to hear that! What else can I do for you today?');
    } else if (userMessage.toLowerCase().includes('i want')) {
      handleNewMessage('What do you want?');
    } else if (userMessage.toLowerCase().includes('loan')) {
      handleLoanOptions();
    } else {
      handleNewMessage('Sorry, I did not understand. Can you please repeat?');
    }
    e.target.elements.message.value = '';
    storeConversation({ text: userMessage, sender: 'user', timestamp: new Date() });
  };
  

  const handleOptionMessageClick = (option, link, className) => {
    if (option === 'Do you want to apply for a loan?') {
      handleNewMessage('Apply for a loan', link, 'user');
      handleNewMessage('Please click the link below to continue your application:', '', 'bot');
      handleNewMessage(
        <a href="https://lexartlabs.com/for-companies/" target="_blank" rel="noopener noreferrer" className={className}>
          Apply for a loan
        </a>,
        '',
        'bot'
      );
    } else if (option === 'Loan conditions') {
      handleNewMessage('Loan conditions', link, 'user');
      handleNewMessage(
        'Short term loans are called such because of how quickly the loan needs to be paid off. ' +
        'In most cases, it must be paid off within six months to a year – at most, 18 months. ' +
        'Any longer loan term than that is considered a medium term or long term loan.',
        '',
        'bot'
      );
      handleNewMessage('You can learn more about it by clicking the link below:', '', 'bot');
      handleNewMessage(
        <a href="https://lexartlabs.com/for-companies/" target="_blank" rel="noopener noreferrer" className={className}>
          Loan Conditions
        </a>,
        '',
        'bot'
      );
    } else if (option === 'Help') {
      handleNewMessage('Help', link, 'user');
      handleNewMessage('For assistance with our services, please click the link below:', '', 'bot');
      handleNewMessage(
        <a href="https://lexartlabs.com/for-companies/" target="_blank" rel="noopener noreferrer" className={className}>
          Help
        </a>,
        '',
        'bot'
      );
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <Header />
      {isLoggedIn && (
        <>
      {showExportLink && (
        <CSVLink
          data={messages.map((message) => ({
            Text: message.text,
            Sender: message.sender,
            Timestamp: format(message.timestamp, 'yyyy-MM-dd HH:mm:ss'),
          }))}
          filename={'conversation.csv'}
        >
          Export Conversation to CSV
        </CSVLink>
      )}
      <div className="chat-container">
        <div className="message-container" ref={messageContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender} ${message.className}`}
              onClick={() => handleOptionMessageClick(message.text, message.link, message.className)}
            >
              <span className="timestamp">
                {message.timestamp && format(message.timestamp, 'HH:mm')}
              </span>
              {message.text}
            </div>
          ))}
        </div>
        <form className="input-container" onSubmit={handleUserMessage}>
          <input type="text" name="message" placeholder="Digite sua mensagem" required />
          <button type="submit">Enviar</button>
        </form>
      </div>
      </>
      )}
      {!isLoggedIn && (
        <form className="login-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Usuário"
            value={username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Chat;
