import { BackgroundPattern } from '@/components/background-pattern';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CustomStack } from '../../../CustomStack';

// Create a context for form validation and navigation tracking
interface FormValidationContextType {
  isValid: boolean;
  setIsValid: (isValid: boolean) => void;
  previousScreen: string | null;
}

export const FormValidationContext = createContext<FormValidationContextType>({
  isValid: false,
  setIsValid: () => {},
  previousScreen: null,
});

export const useFormValidation = () => useContext(FormValidationContext);

// Helper to determine if a screen comes after account creation
const isPostAccountCreation = (path: string) => {
  return path.includes('code-sharing') || 
         path.includes('account-verification') ||
         path.includes('recipient-info') ||
         path.includes('interface-selection');
};

export default function CaregiverOnboardingLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = 'light';
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [isFormValid, setIsFormValid] = useState(false);
  const previousPathRef = useRef<string | null>(null);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  // Set progress value based on current screen
  useEffect(() => {
    let progressValue = 0;
    
    if (pathname.includes('caregiver-info')) {
      progressValue = 0.15;
    } else if (pathname.includes('account-creation')) {
      progressValue = 0.3;
    } else if (pathname.includes('code-sharing')) {
      progressValue = 0.45;
    } else if (pathname.includes('account-verification')) {
      progressValue = 0.6;
    } else if (pathname.includes('recipient-info')) {
      progressValue = 0.75;
    } else if (pathname.includes('interface-selection')) {
      progressValue = 0.9;
    }
    
    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    // Only reset form validity when navigating FORWARD, not when going back
    // We can detect navigation direction by comparing current path to previous path
    if (previousPathRef.current && 
        getProgressValue(pathname) > getProgressValue(previousPathRef.current)) {
      // Going forward - reset form validity
      setIsFormValid(false);
    }

    // Store current path for next comparison
    previousPathRef.current = pathname;
    
  }, [pathname, progressAnim]);

  // Helper function to get numerical progress value for a pathname
  const getProgressValue = (path: string): number => {
    if (path.includes('caregiver-info')) return 0.15;
    if (path.includes('account-creation')) return 0.3;
    if (path.includes('code-sharing')) return 0.45;
    if (path.includes('account-verification')) return 0.6;
    if (path.includes('recipient-info')) return 0.75;
    if (path.includes('interface-selection')) return 0.9;
    return 0;
  };

  // Function to handle continue button press
  const handleContinue = () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    // Wait a short delay before continuing to ensure keyboard is dismissed
    setTimeout(() => {
      if (pathname.includes('caregiver-info')) {
        router.push('/caregiver-onboarding/account-creation');
      } else if (pathname.includes('account-creation')) {
        router.push('/caregiver-onboarding/code-sharing');
      } else if (pathname.includes('code-sharing')) {
        router.push('/caregiver-onboarding/account-verification');
      } else if (pathname.includes('account-verification')) {
        router.push('/caregiver-onboarding/recipient-info');
      } else if (pathname.includes('recipient-info')) {
        router.push('/caregiver-onboarding/interface-selection');
      } else if (pathname.includes('interface-selection')) {
        // Final step - navigate to main app
        // router.push('/home');
      }
    }, 100);
  };

  return (
    <FormValidationContext.Provider value={{ 
      isValid: isFormValid, 
      setIsValid: setIsFormValid,
      previousScreen: previousPathRef.current,
    }}>
      <View className="flex-1 bg-background">
        {/* Background pattern */}
        <BackgroundPattern />
        
        {/* Stack navigator without KeyboardAvoidingView to keep header fixed */}
        <View className="flex-1">
          <CustomStack
            screenOptions={{
              headerShown: true,
              headerTitle: '',
              headerShadowVisible: false,
              headerStyle: { 
                backgroundColor: 'transparent', // Make header transparent
              },
              headerLeft: ({ canGoBack }) => {
                // Only show back button if:
                // 1. We can go back
                // 2. We're not on a post-account-creation screen
                if (canGoBack && !isPostAccountCreation(pathname)) {
                  return (
                    <TouchableOpacity onPress={handleBackPress}>
                      <Ionicons name="chevron-back" size={24} color="#006B5B" />
                    </TouchableOpacity>
                  );
                }
                return null;
              },
              headerRight: () => (
                <View className="h-12 flex justify-center items-start -md z-10">
                <Image
                source={require("@/assets/logo.svg")}
                className="w-[72] h-[52] mr-4"
                contentFit="contain"
              />
                </View>
                ),
              cardStyle: { 
                backgroundColor: 'transparent', // Make content background transparent
              },
              gestureEnabled: !isPostAccountCreation(pathname),
              gestureDirection: 'horizontal',
              // Default transition spec for all screens
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: { duration: 200 },
                },
                close: {
                  animation: 'timing',
                  config: { duration: 200 },
                },
              },
              // Default card style interpolator for horizontal slide
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
          >
            <CustomStack.Screen 
              name="index" 
              options={{ 
                headerShown: false,
              }} 
            />
            <CustomStack.Screen 
              name="caregiver-info" 
              options={{ 
                headerBackTitle: '',
                gestureEnabled: true,
                presentation: 'card',
                cardStyle: { 
                  backgroundColor: 'transparent', // Make content background transparent
                },
              }} 
            />
            <CustomStack.Screen 
              name="account-creation" 
              options={{ 
                headerBackTitle: '',
                gestureEnabled: true,
                presentation: 'card',
                cardStyle: { 
                  backgroundColor: 'transparent', // Make content background transparent
                },
              }} 
            />
            <CustomStack.Screen 
              name="code-sharing" 
              options={{ 
                headerBackTitle: '',
                presentation: 'card',
                gestureEnabled: false,
              }} 
            />
            <CustomStack.Screen 
              name="account-verification" 
              options={{ 
                headerBackTitle: '',
                presentation: 'card',
                gestureEnabled: false,
              }} 
            />
            <CustomStack.Screen 
              name="recipient-info" 
              options={{ 
                headerBackTitle: '',
                presentation: 'card',
                gestureEnabled: false,
              }} 
            />
            <CustomStack.Screen 
              name="interface-selection" 
              options={{ 
                headerBackTitle: '',
                presentation: 'card',
                gestureEnabled: false,
              }} 
            />
          </CustomStack>
        </View>
        
        {/* Footer with progress bar and continue button - with KeyboardAvoidingView */}
        {pathname !== '/caregiver-onboarding' && pathname !== '/caregiver-onboarding/index' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {keyboardVisible ? (
              // Regular view without safe area when keyboard is visible
              <View className="border-t border-border bg-background">
                {/* Progress bar */}
                <View className="w-full rounded-r-full bg-background h-2">
                  <Animated.View 
                    className="h-2 bg-[#006B5B] rounded-r-full" 
                    style={{ width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })}}
                  />
                </View>
                
                <View className="p-4">
                  <Button
                    size="lg"
                    onPress={handleContinue}
                    disabled={!isFormValid}
                    className={`h-14 rounded-full ${isFormValid ? 'bg-[#0B2B26]' : 'bg-[#0B2B26]/50'}`}
                  >
                    <Text className="text-white text-lg font-medium">Continue</Text>
                  </Button>
                </View>
              </View>
            ) : (
              // SafeAreaView when keyboard is not visible
              <SafeAreaView edges={['bottom']} className="bg-background">
                <View className="border-t border-border">
                  {/* Progress bar */}
                  <View className="w-full rounded-r-full bg-background h-2">
                    <Animated.View 
                      className="h-2 bg-[#006B5B] rounded-r-full" 
                      style={{ width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })}}
                    />
                  </View>
                  
                  <View className="p-4">
                    <Button
                      size="lg"
                      onPress={handleContinue}
                      disabled={!isFormValid}
                    >
                      <Text className="text-white text-lg font-medium">Continue</Text>
                    </Button>
                  </View>
                </View>
              </SafeAreaView>
            )}
          </KeyboardAvoidingView>
        )}
      </View>
    </FormValidationContext.Provider>
  );
} 