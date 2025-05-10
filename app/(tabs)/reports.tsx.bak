import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReportCard } from '@/components/reports/ReportCard';

// Sample data for reports
const SAMPLE_REPORTS = [
  {
    id: '1',
    title: 'Site Inspection - Main Building',
    date: 'May 7, 2025',
    status: 'submitted',
  },
  {
    id: '2',
    title: 'Equipment Maintenance Check',
    date: 'May 6, 2025',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Safety Inspection Report',
    date: 'May 5, 2025',
    status: 'draft',
  },
];

export default function ReportsScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-gray-800">Onsite Reports</Text>
        <Text className="text-gray-500 mt-1">View and manage your reports</Text>
      </View>
      
      <FlatList
        data={SAMPLE_REPORTS}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-20"
        renderItem={({ item }) => (
          <ReportCard
            id={item.id}
            title={item.title}
            date={item.date}
            status={item.status as 'pending' | 'submitted' | 'draft'}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text className="text-gray-400">No reports found</Text>
          </View>
        }
      />
      
      <TouchableOpacity
        className="absolute right-6 bottom-6 bg-blue-500 rounded-full w-14 h-14 items-center justify-center shadow-lg"
        onPress={() => console.log('Create new report')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
