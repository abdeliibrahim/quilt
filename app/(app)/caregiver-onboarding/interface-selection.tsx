import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function InterfaceSelectionScreen() {
  const router = useRouter();
  const [selectedInterface, setSelectedInterface] = useState<'default' | 'easy' | null>(null);
  
  const handleContinue = () => {
    if (selectedInterface) {
      // In a real app, you would save this preference
      console.log('Selected interface:', selectedInterface);
      router.push('/(app)/(protected)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <View className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold mb-6">
          How would you like their Quilt to look and feel?
        </Text>
        
        <View className="space-y-6">
          <TouchableOpacity
            onPress={() => setSelectedInterface('default')}
            className={`border rounded-xl p-4 ${
              selectedInterface === 'default' ? 'border-button bg-button/10' : 'border-border'
            }`}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className={`w-6 h-6 rounded-full border ${
                  selectedInterface === 'default' 
                    ? 'border-button bg-button' 
                    : 'border-muted-foreground'
                } mr-3 items-center justify-center`}
              >
                {selectedInterface === 'default' && (
                  <View className="w-3 h-3 bg-white rounded-full" />
                )}
              </View>
              <Text className="font-medium text-lg">Default</Text>
            </View>
            
            <View className="bg-muted rounded-lg overflow-hidden h-40 items-center justify-center">
              {/* Placeholder for default interface preview */}
              <Text className="text-muted-foreground">Standard design with subtle elements</Text>
            </View>
            
            <Text className="text-muted-foreground mt-2">
              Clean, modern interface with standard text size and contrast
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSelectedInterface('easy')}
            className={`border rounded-xl p-4 ${
              selectedInterface === 'easy' ? 'border-button bg-button/10' : 'border-border'
            }`}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className={`w-6 h-6 rounded-full border ${
                  selectedInterface === 'easy' 
                    ? 'border-button bg-button' 
                    : 'border-muted-foreground'
                } mr-3 items-center justify-center`}
              >
                {selectedInterface === 'easy' && (
                  <View className="w-3 h-3 bg-white rounded-full" />
                )}
              </View>
              <Text className="font-medium text-lg">Easy</Text>
            </View>
            
            <View className="bg-muted rounded-lg overflow-hidden h-40 items-center justify-center">
              {/* Placeholder for easy interface preview */}
              <Text className="text-muted-foreground">Larger elements with high contrast</Text>
            </View>
            
            <Text className="text-muted-foreground mt-2">
              Larger text, high contrast colors, and bigger buttons for easier use
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-sm text-center text-muted-foreground mt-6">
          Don't worry—you can always change this later
        </Text>
      </View>
      
      <View className="p-4 border-t border-border">
        <Button 
          onPress={handleContinue}
          disabled={!selectedInterface}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 