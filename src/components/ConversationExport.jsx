import React from 'react';
import { CSVLink } from 'react-csv';

const ConversationExport = ({ conversationHistory }) => {
  // Ordenar histórico de conversas por data em ordem ascendente
  const sortedHistory = conversationHistory.sort((a, b) => a.timestamp - b.timestamp);

  // Criar array de dados CSV
  const csvData = sortedHistory.map((message) => ({
    Conversa: `Conversa usuário #${message.sender === 'user' ? 1 : 2}`,
    Timestamp: message.timestamp.toLocaleString(),
    Mensagem: message.text,
  }));

  return (
    <div>
      <h1>Exportar Conversa</h1>
      <CSVLink data={csvData} filename="historico_conversa.csv">
        Baixar CSV
      </CSVLink>
    </div>
  );
};

export default ConversationExport;
