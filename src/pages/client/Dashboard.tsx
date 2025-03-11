import React, { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Package, 
  MessageSquare, 
  User, 
  CreditCard, 
  Star, 
  Settings, 
  LogOut,
  Bell,
  ShoppingCart,
  ClipboardList,
  Calendar,
  RefreshCw,
  FileText,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ClientDashboard = () => {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been successfully logged out of your account."
      });
      navigate('/admin/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Mock data for demonstration
  const recentOrders = [
    { id: 'ORD-1234', name: 'Deck Installation', status: 'In Progress', date: '2023-06-15', amount: '$2,500' },
    { id: 'ORD-1235', name: 'Outdoor Kitchen Design', status: 'Completed', date: '2023-05-20', amount: '$3,800' },
    { id: 'ORD-1236', name: 'Patio Extension', status: 'Scheduled', date: '2023-07-10', amount: '$1,750' },
  ];

  const activeServices = [
    { id: 'SRV-001', name: 'Deck Maintenance Plan', nextService: '2023-08-15', status: 'Active' },
    { id: 'SRV-002', name: 'Garden Design Consultation', nextService: '2023-07-25', status: 'Pending' },
  ];

  const recentMessages = [
    { id: 'MSG-001', subject: 'Deck Installation Update', date: '2023-06-18', isUnread: true },
    { id: 'MSG-002', subject: 'Quote Request Response', date: '2023-06-15', isUnread: false },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <header className="bg-background border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-muted">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {currentUser?.displayName?.charAt(0) || 'U'}
               

