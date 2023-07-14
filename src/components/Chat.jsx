import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleInputChange = (e) => {
    if (e.target.name === 'username') {
      setUsername(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Adicione sua lógica de autenticação aqui
    if (username === 'your_username' && password === 'your_password') {
      setLoggedIn(true);
      setMessages([
        ...messages,
        { text: `Bem-vindo, ${username}! Como posso ajudar hoje?`, sender: 'bot', timestamp: new Date() }
      ]);
    } else {
      setMessages([...messages, { text: 'Usuário ou senha inválidos.', sender: 'bot', timestamp: new Date() }]);
    }

    // Limpe os campos de input
    setUsername('');
    setPassword('');
  };

  const handleLoanOptions = () => {
    handleNewMessage('Aqui estão as opções relacionadas a empréstimos:');
    handleNewMessage('1. Você deseja solicitar um empréstimo?', 'loan-apply');
    handleNewMessage('2. Condições do empréstimo', 'loan-conditions');
    handleNewMessage('3. Ajuda', 'help');
  };

  const handleOptionClick = (option) => {
    if (option === 'loan-apply') {
      handleNewMessage('Para solicitar um empréstimo, visite nossa página de solicitação de empréstimo:', 'bot');
      handleNewMessage('Solicitar Empréstimo', 'bot', 'https://exemplo.com/solicitar-emprestimo');
    } else if (option === 'loan-conditions') {
      handleNewMessage('Você pode encontrar as condições e termos do empréstimo em nosso site:', 'bot');
      handleNewMessage('Condições do Empréstimo', 'bot', 'https://exemplo.com/condicoes-emprestimo');
    } else if (option === 'help') {
      handleNewMessage('Se você precisar de ajuda relacionada a empréstimos, entre em contato com nossa equipe de suporte:', 'bot');
      handleNewMessage('Contato de Suporte', 'bot', 'https://exemplo.com/contato-suporte');
    }
  };

  const handleNewMessage = (text, sender = 'bot', link = '') => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender, timestamp: new Date(), link },
    ]);
  };

  const handleUserMessage = (e) => {
    e.preventDefault();
    const userMessage = e.target.elements.message.value;

    // Exiba a mensagem do usuário na interface do chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: 'user', timestamp: new Date() },
    ]);

    // Lide com diferentes mensagens do usuário aqui
    if (!isLoggedIn) {
      handleFormSubmit(e); // Autentique o usuário
    } else if (userMessage.toLowerCase().includes('olá')) {
      const startTimeMessage = startTime
        ? `Você iniciou a conversa às ${format(startTime, 'HH:mm')}.`
        : '';
      handleNewMessage(`Olá! Como posso ajudar? ${startTimeMessage}`);
    } else if (userMessage.toLowerCase().includes('tchau')) {
      handleNewMessage('Tchau! Tenha um ótimo dia!');
      setLoggedIn(false); // Redefina o status de login
    } else if (userMessage.toLowerCase().includes('bom')) {
      handleNewMessage('Fico feliz em saber! Como posso ajudar hoje?');
    } else if (userMessage.toLowerCase().includes('quero')) {
      handleNewMessage('O que você deseja?');
    } else if (userMessage.toLowerCase().includes('empréstimo')) {
      handleLoanOptions();
    } else {
      handleNewMessage('Desculpe, mas não entendi. Como posso ajudar?');
    }

    // Limpe o campo de input
    e.target.elements.message.value = '';
  };

  const handleOptionMessageClick = (option, link) => {
    if (link) {
      window.open(link, '_blank');
    } else if (option) {
      handleOptionClick(option);
    }
  };

  return (
    <div>
      <h1 className="title">Chatbot</h1>
      <div className="chat-container">
        <div className="message-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}`}
              onClick={() => handleOptionMessageClick(message.option, message.link)}
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
