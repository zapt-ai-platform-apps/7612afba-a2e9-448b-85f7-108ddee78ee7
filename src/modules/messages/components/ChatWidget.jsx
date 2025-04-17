import React, { useState } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import useChatClient from '@/modules/messages/hooks/useChatClient';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

function ChatLoading() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
      <span className="text-sm font-medium">Connecting...</span>
    </div>
  );
}

function CustomChannelHeader() {
  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <h3 className="font-medium">Customer Support Chat</h3>
    </div>
  );
}

export default function ChatWidget() {
  const { user } = useAuth();
  const { client, channel, connectChat, disconnectChat } = useChatClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  if (!user) {
    return null;
  }
  
  const toggleChat = async () => {
    if (!isOpen) {
      setIsChatLoading(true);
      try {
        await connectChat();
        setIsOpen(true);
      } catch (error) {
        console.error('Error connecting chat:', error);
      } finally {
        setIsChatLoading(false);
      }
    } else {
      setIsOpen(false);
      await disconnectChat();
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 chat-widget">
      <button
        onClick={toggleChat}
        className={`btn-primary rounded-full w-14 h-14 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all ${isOpen ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
        disabled={isChatLoading}
      >
        {isChatLoading ? (
          <ChatLoading />
        ) : isOpen ? (
          <FaTimes size={20} />
        ) : (
          <FaCommentDots size={24} />
        )}
      </button>
      
      {isOpen && client && channel && (
        <div className="chat-container">
          <Chat client={client} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput placeholder="Type your message here..." />
              </Window>
            </Channel>
          </Chat>
        </div>
      )}
    </div>
  );
}