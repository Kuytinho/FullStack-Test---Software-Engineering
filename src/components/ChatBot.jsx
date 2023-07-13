import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Chatbot = () => {
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

    // Add your authentication logic here
    if (username === 'your_username' && password === 'your_password') {
      setLoggedIn(true);
      setMessages([
        ...messages,
        { text: `Welcome, ${username}! How can I assist you today?`, sender: 'bot', timestamp: new Date() }
      ]);
    } else {
      setMessages([...messages, { text: 'Invalid username or password.', sender: 'bot', timestamp: new Date() }]);
    }

    // Clear the input fields
    setUsername('');
    setPassword('');
  };

  const handleLoanOptions = () => {
    handleNewMessage('Here are the options related to loans:');
    handleNewMessage('1. Do you want to apply for a loan?', 'loan-apply');
    handleNewMessage('2. Loan conditions', 'loan-conditions');
    handleNewMessage('3. Help', 'help');
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

    // Display user message in the chat interface
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: 'user', timestamp: new Date() },
    ]);

    // Handle different user messages here
    if (!isLoggedIn) {
      handleFormSubmit(e); // Authenticate the user
    } else if (userMessage.toLowerCase().includes('hello')) {
      const startTimeMessage = startTime
        ? `You started the conversation at ${format(startTime, 'hh:mm a')}.`
        : '';
      handleNewMessage(`Hello! How can I help you? ${startTimeMessage}`);
    } else if (userMessage.toLowerCase().includes('goodbye')) {
      handleNewMessage('Goodbye! Have a great day!');
      setLoggedIn(false); // Reset login status
    } else if (userMessage.toLowerCase().includes('good')) {
      handleNewMessage('I\'m glad to hear that! How can I assist you today?');
    } else if (userMessage.toLowerCase().includes('i want')) {
      handleNewMessage('What do you want?');
    } else if (userMessage.toLowerCase().includes('loan')) {
      handleLoanOptions();
    } else {
      handleNewMessage('I\'m sorry, but I didn\'t understand that. How can I assist you?');
    }

    // Clear the input field
    e.target.elements.message.value = '';
  };

  const handleOptionMessageClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div className="chat-container">
        <div className="message-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}`}
              onClick={() => handleOptionMessageClick(message.link)}
            >
              <span className="timestamp">
                {message.timestamp && format(message.timestamp, 'hh:mm a')}
              </span>
              {message.link ? (
                <a href={message.link} target="_blank" rel="noopener noreferrer">
                  {message.text}
                </a>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        <form className="input-container" onSubmit={handleUserMessage}>
          <input type="text" name="message" placeholder="Enter your message" required />
          <button type="submit">Send</button>
        </form>
      </div>
      {!isLoggedIn && (
        <form className="login-form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
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

export default Chatbot;
