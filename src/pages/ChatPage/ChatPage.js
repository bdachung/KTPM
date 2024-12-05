import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import ChatSidebar from '../../components/Chat/ChatSidebar';
import ChatWindow from '../../components/Chat/ChatWindow';
import ChatInfoPanel from '../../components/Chat/ChatInfoPanel';
import './ChatPage.css';
// import {BASE_URL} from "@env";

const BASE_URL = process.env.BASE_URL;

const socket = io(BASE_URL);

function ChatPage() {
  const location = useLocation();
  const username = location.state?.username;
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch chats from the API
    const fetchChats = async () => {
      try {
        console.log(`${BASE_URL}/chats?username=${username}`)
        const response = await fetch(`${BASE_URL}/chats?username=${username}`);
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [username]);

  useEffect(() => {
    if (selectedChat) {
      // Fetch messages for the selected chat from the API
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${BASE_URL}/chats/${selectedChat.id}/messages`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();

      // Join the WebSocket room for the selected chat
      socket.emit('join', { conversation_id: selectedChat.id });

      // Listen for new messages
      socket.on('message', (message) => {
        console.log('New message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on unmount
      return () => {
        socket.emit('leave', { conversation_id: selectedChat.id });
        socket.off('message');
      };
    }
  }, [selectedChat]);

  const sendMessage = async (message, image) => {
    let imageUrl = null;
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      imageUrl = data.url;
    }

    const newMessage = {
      user_id: username,
      timestamp: new Date().toISOString(),
      content: message,
      imageUrl,
    };
    socket.emit('message', { conversation_id: selectedChat.id, ...newMessage });
  };

  return (
    <div className="chat-page">
      <ChatSidebar chats={chats} onSelectChat={setSelectedChat} />
      <ChatWindow messages={messages} onSendMessage={sendMessage} currentUser={username} />
      <ChatInfoPanel chat={selectedChat} />
    </div>
  );
}

export default ChatPage;