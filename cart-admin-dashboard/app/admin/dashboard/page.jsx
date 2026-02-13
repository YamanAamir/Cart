'use client';

import { useState, useEffect } from 'react';
import { 
  Users, ShoppingCart, DollarSign, Package, CheckCircle, XCircle, Truck, Clock, 
  Filter, X, RefreshCw, BarChart3 
} from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdvancedDashboard() {
 
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome To ClubPro Admin Dashboard</h2>
        </div>
        </div>
        </div>
       
  );
}