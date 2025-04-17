import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { FaRegPaperPlane } from 'react-icons/fa';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = React.useRef(null);

  // Fetch user's conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from the API
        // Simulating API call for now
        console.log('Fetching conversations for user:', user?.email);
        setTimeout(() => {
          setConversations([]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        Sentry.captureException(error, {
          extra: { userId: user?.id }
        });
        toast.error('Could not load conversations');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    async function fetchMessages(conversationId) {
      try {
        setLoadingMessages(true);
        console.log('Fetching messages for conversation:', conversationId);
        // Simulating API call for now
        setTimeout(() => {
          setMessages([]);
          setLoadingMessages(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Sentry.captureException(error, {
          extra: { 
            userId: user?.id,
            conversationId 
          }
        });
        toast.error('Could not load messages');
      } finally {
        setLoadingMessages(false);
      }
    }
    
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      console.log('Sending message:', {
        to: selectedConversation.otherUser?.email,
        content: newMessage
      });
      
      // Simulate API call
      setTimeout(() => {
        setSendingMessage(false);
        setNewMessage('');
        toast.success('Message sent');
      }, 800);
    } catch (error) {
      console.error('Error sending message:', error);
      Sentry.captureException(error, {
        extra: {
          userId: user?.id,
          recipientId: selectedConversation?.otherUser?.id,
          messagePreview: newMessage.substring(0, 50)
        }
      });
      toast.error('Failed to send message');
      setSendingMessage(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Messages</h1>
      
      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-2 text-gray-600">
            When you communicate with other collectors or sellers, your conversations will appear here.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            You can start a conversation by sending a message to a seller from an item's detail page,
            or respond to inquiries about your items for sale.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Conversations list */}
          <div className="bg-white rounded-lg shadow overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {conversations.map(conversation => (
                <li 
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ${
                    selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      {conversation.otherUser.profilePicture ? (
                        <img 
                          src={conversation.otherUser.profilePicture} 
                          alt={conversation.otherUser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-indigo-600 font-medium">
                          {conversation.otherUser.name?.charAt(0) || conversation.otherUser.email?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium truncate">
                          {conversation.otherUser.name || conversation.otherUser.email}
                        </p>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {format(new Date(conversation.lastMessage.createdAt), 'MMM d')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Messages area */}
          <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    {selectedConversation.otherUser.profilePicture ? (
                      <img 
                        src={selectedConversation.otherUser.profilePicture} 
                        alt={selectedConversation.otherUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-600 font-medium">
                        {selectedConversation.otherUser.name?.charAt(0) || selectedConversation.otherUser.email?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {selectedConversation.otherUser.name || selectedConversation.otherUser.email}
                    </p>
                    {selectedConversation.itemName && (
                      <p className="text-sm text-gray-500">
                        Re: {selectedConversation.itemName}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Messages list */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                      No messages yet. Send a message to start the conversation.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(message => (
                        <div 
                          key={message.id}
                          className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                              message.senderId === user.id 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'
                            }`}>
                              {format(new Date(message.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-300 rounded box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 transition duration-150"
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <FaRegPaperPlane />
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}