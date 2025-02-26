import { SafeAreaView } from '@/components/safe-area-view';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';
import { markFinalStep } from '@/services/profile';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Share, TouchableOpacity, View } from 'react-native';

export default function CodeSharingScreen() {
  const router = useRouter();
  const inviteCode = "DDIFEST25"; // In a real app, this would be generated or fetched
  const [copied, setCopied] = useState(false);
  const { user } = useSupabase();
  
  // Mark onboarding as complete when this screen is reached
  useEffect(() => {
    if (user) {
      // Update the onboarding status in the database
      markFinalStep(user.id)
        .then(success => {
          if (success) {
            console.log('Onboarding marked as complete');
          } else {
            console.error('Failed to mark onboarding as complete');
          }
        })
        .catch(error => {
          console.error('Error marking onboarding as complete:', error);
        });
    }
  }, [user]);

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
      <View className="flex-1 px-4 py-4 justify-center items-center">
        <Text className="text-2xl font-semibold text-center mb-4">
          Your care recipient's Quilt is prepared!
        </Text>
        
        <View className="flex flex-col items-center gap-y-4">
          <Text className="text-md text-center text-muted-foreground">
            They'll need this code to join in their Quilt app
          </Text>
          
          <View className="w-full max-w-xs bg-muted p-6 rounded-xl mb-6 items-center">
            <View className="flex-row items-center justify-center">
              <Text className="text-3xl font-bold tracking-widest mb-4">
                {inviteCode}
              </Text>
              {/* <TouchableOpacity 
                onPress={handleCopyCode}
                className="ml-2"
              >
                <Ionicons name={copied ? "checkmark" : "copy-outline"} size={24} color={copied ? "green" : "#666"} />
              </TouchableOpacity> */}
            </View>
            <TouchableOpacity 
              onPress={handleShare}
              className="flex-row items-center bg-button px-4 py-2 rounded-full"
            >
              <Ionicons name="share-outline" size={20} color="white" />
              <Text className="text-white ml-2">Share Code</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text className="text-md text-center text-muted-foreground mb-8 max-w-xs">
          Share this code with your care recipient so they can connect to their Quilt
        </Text>
      </View>
    </SafeAreaView>
  );
}