import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ReportCardProps {
  title: string;
  date: string;
  status: 'pending' | 'submitted' | 'draft';
  id: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
  title, 
  date, 
  status, 
  id 
}) => {
  const router = useRouter();
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };
  
  const handlePress = () => {
    router.push(`/report/${id}`);
  };
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-white rounded-lg shadow-sm p-4 mb-3"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-500 mt-1">{date}</Text>
        </View>
        
        <View className={`rounded-full px-3 py-1 ${statusColors[status]}`}>
          <Text className="text-xs font-medium">{status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-3">
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        <Text className="text-gray-400 text-sm ml-1">Tap to view details</Text>
      </View>
    </TouchableOpacity>
  );
};
