import { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import * as Sentry from '@sentry/browser';

const useChatClient = () => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  const connectChat = async () => {
    if (!user?.email) {
      console.error('No user session available for chat connection');
      return;
    }
    
    try {
      const response = await fetch('/api/customerSupport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.aud}`
        },
        body: JSON.stringify({ email: user.email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch customer support data:', errorData);
        throw new Error(errorData.error || 'Failed to connect to chat');
      }
      
      const { token, channelId, userId, STREAM_API_KEY } = await response.json();
      
      const streamClient = StreamChat.getInstance(STREAM_API_KEY);
      await streamClient.connectUser(
        { id: userId, name: user.email },
        token
      );
      
      const streamChannel = streamClient.channel('messaging', channelId);
      await streamChannel.watch();
      
      setClient(streamClient);
      setChannel(streamChannel);
      
      console.log('Chat connected successfully');
    } catch (error) {
      console.error('Error initializing chat:', error);
      Sentry.captureException(error);
    }
  };

  const disconnectChat = async () => {
    if (client) {
      try {
        await client.disconnectUser();
        setClient(null);
        setChannel(null);
        console.log('Chat disconnected');
      } catch (error) {
        console.error('Error disconnecting chat:', error);
        Sentry.captureException(error);
      }
    }
  };

  return { client, channel, connectChat, disconnectChat };
};

export default useChatClient;