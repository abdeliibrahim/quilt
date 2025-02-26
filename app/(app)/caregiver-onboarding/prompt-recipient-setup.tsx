import { useRouter } from 'expo-router';
import React from 'react';
import { Share, View } from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function PromptRecipientSetupScreen() {
  const router = useRouter();
  const inviteCode = "DDIFEST25"; // In a real app, this would be generated or fetched
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my Quilt care circle with code: ${inviteCode}`,
      });
    } catch (error) {
      console.error('Error sharing code:', error);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <View className="flex-1 px-4 py-4 justify-center items-center -top-10">
        <View className="flex flex-col gap-3 bg-background">
        <Text className="text-2xl font-medium mb-6">
          Does the person receiving care have a Quilt account?
        </Text>
        

        <View className="gap-y-4">
         <Button size="lg" onPress={() => router.push('/caregiver-onboarding/recipient-info')}>
          <Text>No, let's set up their profile</Text>
         </Button>
         <Button variant="secondary" size="lg">
          <Text>Yes, I have an invitation code</Text>
         </Button>
        </View>

        
         </View>
      </View>
      
   
    </SafeAreaView>
  );
} 