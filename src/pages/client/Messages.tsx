import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from '@/contexts/FirebaseContext';
import { getUserOrders, Order } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Message {
  id: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: string;
  attachments?: { name: string; url: string }[];
}

interface Thread {
  id: string;
  orderId: string;
  messages: Message[];
  participants: {
    client: { id: string; name: string };
    admin: { id: string; name: string };
  };
  lastMessage: string;
  lastMessageTime: string;
}

const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    orderId: 'order-123',
    messages: [
      {
        id: 'msg-1',
        sender: 'client',
        text: 'Hi, I have a question about my order.',
        timestamp: '2024-08-01T10:00:00Z',
        attachments: [{ name: 'order_details.pdf', url: '#' }]
      },
      {
        id: 'msg-2',
        sender: 'admin',
        text: 'Hello! How can I assist you?',
        timestamp: '2024-08-01T10:05:00Z'
      }
    ],
    participants: {
      client: { id: 'user-1', name: 'John Doe' },
      admin: { id: 'admin-1', name: 'Alice Smith' }
    },
    lastMessage: 'Hello! How can I assist you?',
    lastMessageTime: '2024-08-01T10:05:00Z'
  },
  {
    id: 'thread-2',
    orderId: 'order-456',
    messages: [
      {
        id: 'msg-3',
        sender: 'client',
        text: 'Can I get an update on my project?',
        timestamp: '2024-08-05T14:30:00Z'
      },
      {
        id: 'msg-4',
        sender: 'admin',
        text: 'Your project is currently in progress. We expect to complete it by next week.',
        timestamp: '2024-08-05T15:00:00Z'
      }
    ],
    participants: {
      client: { id: 'user-2', name: 'Jane Smith' },
      admin: { id: 'admin-2', name: 'Bob Johnson' }
    },
    lastMessage: 'Your project is currently in progress. We expect to complete it by next week.',
    lastMessageTime: '2024-08-05T15:00:00Z'
  }
];

const ClientMessages = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useFirebase();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Messages | PermitDraft Pro";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid, currentUser.email);
        setOrders(userOrders);
        
        setThreads(mockThreads);
        
        if (mockThreads.length > 0) {
          setActiveThread(mockThreads[0]);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not load your messages. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, toast]);

  const filteredThreads = searchTerm
    ? threads.filter(thread =>
        thread.participants.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.messages.some(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : threads;

  const sendMessage = () => {
    if (!activeThread) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedThread: Thread = {
      ...activeThread,
      messages: [...activeThread.messages, newMsg],
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString(),
    };

    setThreads(threads.map(t => t.id === activeThread.id ? updatedThread : t));
    setActiveThread(updatedThread);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communicate with our team</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {isLoading ? (
                    <div className="text-center py-4">Loading messages...</div>
                  ) : (
                    <div className="space-y-2">
                      {filteredThreads.map(thread => (
                        <Button
                          key={thread.id}
                          variant="ghost"
                          className={`w-full justify-start rounded-md ${activeThread?.id === thread.id ? 'bg-accent text-accent-foreground' : ''}`}
                          onClick={() => setActiveThread(thread)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="font-medium">{thread.participants.client.name}</p>
                              <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{thread.lastMessageTime.substring(11, 16)}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeThread ? (
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-full bg-muted w-8 h-8">
                          <path d="M16 6C12.6863 6 10 9.68629 10 13C10 16.3137 12.6863 19 16 19C19.3137 19 22 16.3137 22 13C22 9.68629 19.3137 6 16 6ZM6 25C6 21.6863 8.68629 19 12 19H20C23.3137 19 26 21.6863 26 25V27H6V25Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle>{activeThread.participants.client.name}</CardTitle>
                        <CardDescription>Order: {activeThread.orderId}</CardDescription>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {activeThread.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${msg.sender === 'client' ? 'bg-teal-500 text-white' : 'bg-muted'}`}
                          >
                            <p>{msg.text}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map(attachment => (
                                  <a
                                    key={attachment.name}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-300 hover:underline"
                                  >
                                    <Paperclip className="inline-block h-3 w-3 mr-1" />
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {msg.timestamp.substring(11, 16)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-4 border-t">
                    <div className="flex items-center">
                      <Textarea
                        placeholder="Type your message here..."
                        className="flex-1 mr-2 resize-none border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button onClick={sendMessage}>
                        Send
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full">
                  <CardContent className="text-center">
                    {isLoading ? (
                      <div>Loading messages...</div>
                    ) : (
                      <div>Select a message to view</div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientMessages;
