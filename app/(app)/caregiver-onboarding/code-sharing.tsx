import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Share, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function CodeSharingScreen() {
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

  const handleContinue = () => {
    router.push('/caregiver-onboarding/account-verification');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 py-4 justify-center items-center">
        <Text className="text-2xl font-bold text-center mb-2">
          Your care recipient's Quilt is prepared!
        </Text>
        
        <Text className="text-base text-center text-muted-foreground mb-8">
          They'll need this code to join in their Quilt app
        </Text>
        
        <View className="w-full max-w-xs bg-muted p-6 rounded-xl mb-6 items-center">
          <Text className="text-3xl font-bold tracking-widest mb-4">
            {inviteCode}
          </Text>
          
          <TouchableOpacity 
            onPress={handleShare}
            className="flex-row items-center bg-button px-4 py-2 rounded-full"
          >
            <Ionicons name="share-outline" size={20} color="white" />
            <Text className="text-white ml-2">Share Code</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-sm text-center text-muted-foreground mb-8 max-w-xs">
          Share this code with your care recipient so they can connect to your Quilt
        </Text>
      </View>
      
      <View className="p-4 border-t border-border">
        <Button onPress={handleContinue}>
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 