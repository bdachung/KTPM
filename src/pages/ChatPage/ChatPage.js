import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import ChatSidebar from '../../components/Chat/ChatSidebar.js';
import ChatWindow from '../../components/Chat/ChatWindow.js';
import ChatInfoPanel from '../../components/Chat/ChatInfoPanel.js';
import './ChatPage.css';
import { useAuth } from '../../AuthContext.js';
import { Messaging, Message } from './messaging.js';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../../components/ProfileHeader/profileHeader.jsx';
// import {BASE_URL} from "@env";

const BASE_URL = "http://54.167.91.115";

// const socket = io(BASE_URL);

function ChatPage() {
  // let messaging = null;
  const location = useLocation();
  // const username = location.state?.username;
  const {username, accessToken} = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messaging, setMessaging] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = () => {
    const accesskey = accessToken;
    return [username, accesskey];
  }

  useEffect(() => {
    if (!username || !accessToken) {
      navigate('/');
    }
    // Fetch chats from the API
    const newmessaging = new Messaging({
      get: getUserInfo,
    });

    setMessaging(newmessaging);

    newmessaging.connectSocket();

    newmessaging.addEventListener('connection', (event) => {
      // console.log(event.detail);
    });

    newmessaging.addEventListener('message', (event) => {
      // console.log("message:");
      // console.log("----");
      console.log(event.detail);
      const msg = event.detail;
      if (msg.type === "MESSAGE") {
        msg.content = JSON.parse(msg.content);
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      // setMessages((prevMessages) => [...prevMessages, event.detail]);
      // console.log(event.detail);
      // console.log("----");
    });

    const fetchChats = async () => {
      try {
        const response = await fetch(`${BASE_URL}:4002/`, {
          method: 'GET',
          headers: {
            "accesskey": accessToken,
            "user": username
          }
        });
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [username, accessToken]);

  useEffect(() => {
    if (selectedChat) {
      const msg = messages[0];
      if (msg && msg.content.groupId === selectedChat.groupId) {
        return;
      }
      else{
        setMessages([]);
      }
      // Fetch messages for the selected chat from the API
      // const fetchMessages = async () => {
      //   try {
      //     const response = await fetch(`${BASE_URL}/chats/${selectedChat.id}/messages`);
      //     const data = await response.json();
      //     setMessages(data);
      //   } catch (error) {
      //     console.error('Error fetching messages:', error);
      //   }
      // };

      // fetchMessages();

      // // Join the WebSocket room for the selected chat
      // socket.emit('join', { conversation_id: selectedChat.id });

      // // Listen for new messages
      // socket.on('message', (message) => {
      //   console.log('New message:', message);
      //   setMessages((prevMessages) => [...prevMessages, message]);
      // });

      // // Cleanup on unmount
      // return () => {
      //   socket.emit('leave', { conversation_id: selectedChat.id });
      //   socket.off('message');
      // };
    }
  }, [selectedChat]);

  const sendMessage = async (message, image) => {
    if (!selectedChat) {
      return;
    }
    const msg = new Message();
    msg.channel = "INDIVIDUAL";
    msg.type = "MESSAGE";
    msg.ephemeral = false;
    msg.timestamp = Math.floor(Date.now() / 1000);
    msg.content = {"text": message, "image_url": image, "groupId": selectedChat.groupId};
    msg.meta = {};
    // msg.destination = selectedChat.groupId;
    // await messaging.send(msg);
    // console.log(selectedChat.members[i].username);
    for (let i = 0; i < selectedChat.members.length; i++) {
      if (selectedChat.members[i].username !== username) {
        // console.log(msg);
        msg.destination = selectedChat.members[i].username;
        await messaging.send(msg);
      }
    }
    setMessages((prevMessages) => [...prevMessages, msg]);

    // let imageUrl = null;
    // if (image) {
    //   const formData = new FormData();
    //   formData.append('file', image);
    //   const response = await fetch(`${BASE_URL}/upload`, {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const data = await response.json();
    //   imageUrl = data.url;
    // }

    // const newMessage = {
    //   user_id: username,
    //   timestamp: new Date().toISOString(),
    //   content: message,
    //   imageUrl,
    // };
    // socket.emit('message', { conversation_id: selectedChat.id, ...newMessage });
  };

  return (
    <>
    <ToastContainer />
    <ProfileHeader />
    <div className="chat-page">
      <ChatSidebar chats={chats} onSelectedChat={setSelectedChat} username={username}/>
      <ChatWindow messages={messages} selectedChat={selectedChat} onSendMessage={sendMessage} currentUser={username} />
      <ChatInfoPanel chat={selectedChat} />
    </div>
    </>
    
  );
}

export default ChatPage;