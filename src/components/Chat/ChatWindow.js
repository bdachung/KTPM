import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatMessage.css';
import './ChatWindow.css';
import { FaUpload, FaSmile } from 'react-icons/fa';
// import Picker from 'emoji-picker-react'; // Import the emoji picker


function ChatWindow({ messages, selectedChat, onSendMessage, currentUser }) {
  // console.log(selectedChat);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  let chatName = "";
  // const [chatName, setChatName] = useState("");
  // if (selectedChat){
  //   const chatName = selectedChat.name;
  //   console.log(chatName);
  // }

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedImage) {
      onSendMessage(newMessage, selectedImage);
      setNewMessage('');
      setSelectedImage(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-window">
      {selectedChat &&
      <div className="chat-header">
        <div className="chat-header-img">
          <img src={selectedChat.profilePic || "#"} alt="Group" />
        </div>
        <div className="chat-header-name">{selectedChat.name}</div>
      </div>
      }
      <div className="messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {selectedChat && <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
        />
        {/* <input type="file" onChange={handleImageChange} /> */}
        {/* <button onClick={handleSendMessage}>Send</button> */}
        {/* <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )} */}
        <label htmlFor="file-upload" className="file-upload-label">
          <FaUpload />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }} // Hide the default file input
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    }
    </div>
  );
}

export default ChatWindow;