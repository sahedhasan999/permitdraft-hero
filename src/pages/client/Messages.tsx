import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  LogOut,
  LayoutDashboard,
  FileText,
  ShoppingCart,
  MessageSquare,
  Settings,
  Menu,
  Send,
  Clock,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Download
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { getUserOrders, Order } from '@/services/orderService';

// Temporary message type until we implement messaging service
interface Message {
  id: string;
  orderId: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  sender: 'client' | 'admin';
  senderName: string;
  senderAvatar?: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
  }>;
}

// Mock conversation threads
interface Thread {
  id: string;
  orderId: string;
  subject: string;
  lastMessage: Date;
  unreadCount: number;
  messages: Message[];
}

const ClientMessages = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been successfully logged out of your account."
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Fetch orders and messages on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
        
        // Mock message threads based on orders
        // In a real implementation, this would be fetched from Firestore
        const mockThreads: Thread[] = [];
        
        userOrders.forEach(order => {
          // Create a welcome thread for each order
          const welcomeMessages: Message[] = [
            {
              id: `msg-${Math.random().toString(36).substring(2, 9)}`,
              orderId: order.id,
              subject: `Welcome to your ${order.projectType} project`,
              content: `Hello ${currentUser.displayName},\n\nThank you for choosing PermitDraft Pro for your ${order.projectType} project. We're excited to work with you and help bring your vision to life.\n\nYour project has been assigned to our team, and we'll be in touch shortly with updates on the progress. In the meantime, if you have any questions or additional information you'd like to share about your project, please don't hesitate to reply to this message.\n\nBest regards,\nThe PermitDraft Pro Team`,
              timestamp: new Date(order.createdAt.getTime() + 3600000), // 1 hour after order
              isRead: true,
              sender: 'admin',
              senderName: 'Project Manager'
            }
          ];
          
          // If order is in progress, add some additional messages
          if (order.status === 'in-progress') {
            welcomeMessages.push(
              {
                id: `msg-${Math.random().toString(36).substring(2, 9)}`,
                orderId: order.id,
                subject: `Welcome to your ${order.projectType} project`,
                content: `Thank you for the warm welcome! I'm looking forward to working with your team. I actually have a few specific requirements for this project that I'd like to discuss. Can we schedule a quick call?`,
                timestamp: new Date(order.createdAt.getTime() + 7200000), // 2 hours after order
                isRead: true,
                sender: 'client',
                senderName: currentUser.displayName || 'You'
              },
              {
                id: `msg-${Math.random().toString(36).substring(2, 9)}`,
                orderId: order.id,
                subject: `Welcome to your ${order.projectType} project`,
                content: `Absolutely! We'd be happy to schedule a call to discuss your specific requirements. How does tomorrow at 2:00 PM sound? If that works for you, I'll send a calendar invite with the call details.\n\nIn the meantime, if you have any documents or sketches that might help us understand your vision better, feel free to upload them here.`,
                timestamp: new Date(order.createdAt.getTime() + 10800000), // 3 hours after order
                isRead: false,
                sender: 'admin',
                senderName: 'Project Manager'
              }
            );
          }
          
          mockThreads.push({
            id: `thread-${Math.random().toString(36).substring(2, 9)}`,
            orderId: order.id,
            subject: `Welcome to your ${order.projectType} project`,
            lastMessage: welcomeMessages[welcomeMessages.length - 1].timestamp,
            unreadCount: welcomeMessages.filter(m => !m.isRead && m.sender === 'admin').length,
            messages: welcomeMessages
          });
          
          // For older orders, add a second thread about plans
          if (order.status === 'in-progress' || order.status === 'completed') {
            const planMessages: Message[] = [
              {
                id: `msg-${Math.random().toString(36).substring(2, 9)}`,
                orderId: order.id,
                subject: `Draft Plans for Review - ${order.projectType}`,
                content: `Hello ${currentUser.displayName},\n\nI'm pleased to share the first draft of your ${order.projectType} plans for review. Please take a look at the attached documents and let me know if you have any feedback or if there are any changes you'd like to make.\n\nWe've tried to incorporate all the requirements you shared with us, but we're always open to making adjustments to ensure the final result meets your expectations.\n\nBest regards,\nDesign Team`,
                timestamp: new Date(order.createdAt.getTime() + 172800000), // 2 days after order
                isRead: true,
                sender: 'admin',
                senderName: 'Design Team',
                attachments: [
                  {
                    id: `att-${Math.random().toString(36).substring(2, 9)}`,
                    name: `${order.projectType}_Draft_Plans.pdf`,
                    size: '2.4 MB',
                    url: '#'
                  }
                ]
              }
            ];
            
            mockThreads.push({
              id: `thread-${Math.random().toString(36).substring(2, 9)}`,
              orderId: order.id,
              subject: `Draft Plans for Review - ${order.projectType}`,
              lastMessage: planMessages[planMessages.length - 1].timestamp,
              unreadCount: planMessages.filter(m => !m.isRead && m.sender === 'admin').length,
              messages: planMessages
            });
          }
        });
        
        // Sort threads by lastMessage date (newest first)
        mockThreads.sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
        
        setThreads(mockThreads);
        
        // Set active thread to the first one if available
        if (mockThreads.length > 0) {
          setActiveThread(mockThreads[0]);
        }
      } catch (error) {
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
  }, [currentUser, navigate, toast]);

  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, path: '/client/dashboard' },
    { name: 'Orders', icon: ShoppingCart, path: '/client/orders' },
    { name: 'Documents', icon: FileText, path: '/client/documents' },
    { name: 'Messages', icon: MessageSquare, path: '/client/messages' },
    { name: 'Settings', icon: Settings, path: '/client/settings' },
  ];

  const handleThreadSelect = (thread: Thread) => {
    // Mark all messages as read in this thread
    const updatedThreads = threads.map(t => {
      if (t.id === thread.id) {
        return {
          ...t,
          unreadCount: 0,
          messages: t.messages.map(m => ({
            ...m,
            isRead: true
          }))
        };
      }
      return t;
    });
    
    setThreads(updatedThreads);
    setActiveThread(thread);
  };

  const handleSendReply = () => {
    if (!activeThread || !replyText.trim()) return;
    
    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg-${Math.random().toString(36).substring(2, 9)}`,
        orderId: activeThread.orderId,
        subject: activeThread.subject,
        content: replyText,
        timestamp: new Date(),
        isRead: true,
        sender: 'client',
        senderName: currentUser?.displayName || 'You'
      };
      
      // Update threads with new message
      const updatedThreads = threads.map(thread => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            lastMessage: newMessage.timestamp,
            messages: [...thread.messages, newMessage]
          };
        }
        return thread;
      });
      
      // Sort threads by lastMessage date (newest first)
      updatedThreads.sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
      
      setThreads(updatedThreads);
      
      // Update active thread
      const updatedActiveThread = updatedThreads.find(t => t.id === activeThread.id);
      if (updatedActiveThread) {
        setActiveThread(updatedActiveThread);
      }
      
      setReplyText('');
      setIsSending(false);
      
      toast({
        title: "Message Sent",
        description: "Your reply has been sent successfully."
      });
    }, 1000);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      // Older - show date
      return date.toLocaleDateString();
    }
  };

  const getTotalUnreadCount = () => {
    return threads.reduce((count, thread) => count + thread.unreadCount, 0);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-28 lg:pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar (Desktop) */}
              <aside className="hidden md:flex flex-col w-64 shrink-0 mr-8">
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                        {currentUser?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{currentUser?.displayName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <nav className="space-y-1">
                    {navigation.map((item) => (
                      <Button
                        key={item.name}
                        variant={item.name === 'Messages' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                        {item.name === 'Messages' && getTotalUnreadCount() > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {getTotalUnreadCount()}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Sidebar (Mobile) */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden mb-4">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="mb-6 mt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                        {currentUser?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{currentUser?.displayName}</p>
                        <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <nav className="space-y-1">
                    {navigation.map((item) => (
                      <Button
                        key={item.name}
                        variant={item.name === 'Messages' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                        {item.name === 'Messages' && getTotalUnreadCount() > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {getTotalUnreadCount()}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">My Messages</h1>
                    <p className="text-muted-foreground">Communicate with our team</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
                    <p className="mt-2 text-muted-foreground">Loading your messages...</p>
                  </div>
                ) : threads.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Messages Found</h3>
                      <p className="text-muted-foreground mb-4">You don't have any messages yet.</p>
                      <Button onClick={() => navigate('/order')}>Start a New Project</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Thread List */}
                    <div className="md:col-span-1">
                      <Card className="h-full">
                        <CardContent className="p-0">
                          <div className="overflow-y-auto max-h-[600px]">
                            {threads.map(thread => {
                              const order = getOrderById(thread.orderId);
                              const lastMessage = thread.messages[thread.messages.length - 1];
                              
                              return (
                                <div 
                                  key={thread.id}
                                  className={cn(
                                    "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                                    activeThread?.id === thread.id && "bg-gray-50"
                                  )}
                                  onClick={() => handleThreadSelect(thread)}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h3 className={cn(
                                      "font-medium line-clamp-1",
                                      thread.unreadCount > 0 && "font-bold"
                                    )}>
                                      {thread.subject}
                                    </h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                      {formatDate(thread.lastMessage)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                                    {order?.projectType}: {lastMessage.sender === 'client' ? 'You' : lastMessage.senderName}: {lastMessage.content.substring(0, 50)}...
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">
                                      {thread.messages.length} {thread.messages.length === 1 ? 'message' : 'messages'}
                                    </span>
                                    {thread.unreadCount > 0 && (
                                      <Badge variant="default" className="text-xs">
                                        {thread.unreadCount} new
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Message Content */}
                    <div className="md:col-span-2">
                      {activeThread ? (
                        <Card className="h-full flex flex-col">
                          <CardHeader className="bg-gray-50 border-b">
                            <CardTitle>{activeThread.subject}</CardTitle>
                            <CardDescription>
                              {getOrderById(activeThread.orderId)?.projectType || 'Project'} - 
                              {activeThread.messages.length} {activeThread.messages.length === 1 ? 'message' : 'messages'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 p-0">
                            <div className="overflow-y-auto max-h-[400px] p-6 space-y-6">
                              {activeThread.messages.map(message => (
                                <div 
                                  key={message.id}
                                  className={cn(
                                    "flex gap-4",
                                    message.sender === 'client' && "flex-row-reverse"
                                  )}
                                >
                                  <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarFallback className={message.sender === 'client' ? "bg-primary" : "bg-gray-500"}>
                                      {message.senderName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={cn(
                                    "bg-gray-100 rounded-lg p-4 max-w-[80%]",
                                    message.sender === 'client' && "bg-primary/10"
                                  )}>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{message.senderName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {message.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="text-sm whitespace-pre-line">
                                      {message.content}
                                    </div>
                                    
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs text-muted-foreground mb-2">Attachments</p>
                                        <div className="space-y-2">
                                          {message.attachments.map(attachment => (
                                            <div 
                                              key={attachment.id}
                                              className="flex items-center p-2 bg-white rounded border"
                                            >
                                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                              </div>
                                              <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="h-8 w-8 ml-2"
                                                onClick={() => window.open(attachment.url, '_blank')}
                                              >
                                                <Download className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          
                          <div className="p-4 border-t mt-auto">
                            <Textarea
                              placeholder="Type your reply..."
                              className="mb-3 min-h-[100px]"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm" disabled>
                                <Paperclip className="h-4 w-4 mr-2" />
                                Attach Files
                              </Button>
                              <Button 
                                disabled={!replyText.trim() || isSending}
                                onClick={handleSendReply}
                              >
                                {isSending ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Reply
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                            <p className="text-muted-foreground mb-4">Choose a conversation from the list to view messages</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientMessages; 