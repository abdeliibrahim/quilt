import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function AccountVerificationScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleContinue = () => {
    if (selectedOption === 'no') {
      router.push('/caregiver-onboarding/recipient-info');
    } else if (selectedOption === 'yes') {
      // In a real app, you would handle the invitation code flow
      router.push('/caregiver-onboarding/recipient-info');
    }
  };

  const onSubmit = (data: FormValues) => {
    // In a real app, you would verify the code
    console.log('Verification code:', data.code);
    router.push('/caregiver-onboarding/recipient-info');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold mb-8">
          Does the person receiving care already have an account?
        </Text>
        
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => setSelectedOption('no')}
            className={`border rounded-xl p-4 ${
              selectedOption === 'no' ? 'border-button bg-button/10' : 'border-border'
            }`}
          >
            <View className="flex-row items-center">
              <View 
                className={`w-6 h-6 rounded-full border ${
                  selectedOption === 'no' 
                    ? 'border-button bg-button' 
                    : 'border-muted-foreground'
                } mr-3 items-center justify-center`}
              >
                {selectedOption === 'no' && (
                  <View className="w-3 h-3 bg-white rounded-full" />
                )}
              </View>
              <Text className="font-medium text-lg">
                No, let's set up their profile
              </Text>
            </View>
            <Text className="text-muted-foreground ml-9 mt-1">
              Create a new account for the person receiving care
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSelectedOption('yes')}
            className={`border rounded-xl p-4 ${
              selectedOption === 'yes' ? 'border-button bg-button/10' : 'border-border'
            }`}
          >
            <View className="flex-row items-center">
              <View 
                className={`w-6 h-6 rounded-full border ${
                  selectedOption === 'yes' 
                    ? 'border-button bg-button' 
                    : 'border-muted-foreground'
                } mr-3 items-center justify-center`}
              >
                {selectedOption === 'yes' && (
                  <View className="w-3 h-3 bg-white rounded-full" />
                )}
              </View>
              <Text className="font-medium text-lg">
                Yes, I have an invitation code
              </Text>
            </View>
            <Text className="text-muted-foreground ml-9 mt-1">
              Connect with an existing care recipient account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="p-4 border-t border-border">
        <Button 
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 