import React from 'react';
import logo from '../images/lex-white.svg';

const Header = () => {
  return (
    <header className="header"> {/* Adicione a classe CSS ao elemento */}
      <img src={logo} alt="LexArt Labs Logo" /> {/* Adicione a imagem da logo */}
      {/* Adicione qualquer conteúdo adicional do cabeçalho aqui */}
    </header>
  );
};

export default Header;
