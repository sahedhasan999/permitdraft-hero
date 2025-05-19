
import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle 
} from 'lucide-react';

// Mock data - would be replaced with real data from an API
const stats = [
  {
    title: 'Total Orders',
    value: '124',
    icon: ShoppingCart,
    change: '+12%',
    changeType: 'positive',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
  },
  {
    title: 'New Leads',
    value: '42',
    icon: Users,
    change: '+18%',
    changeType: 'positive',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-500',
  },
  {
    title: 'Communications',
    value: '89',
    icon: MessageSquare,
    change: '-5%',
    changeType: 'negative',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Completed Projects',
    value: '76',
    icon: CheckCircle,
    change: '+8%',
    changeType: 'positive',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
  }
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-muted-foreground">{stat.title}</h3>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">{stat.value}</p>
            <div className={`flex items-center text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.changeType === 'positive' ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              <span>{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
