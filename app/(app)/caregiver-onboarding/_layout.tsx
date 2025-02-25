import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function CaregiverOnboardingLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBackPress = () => {
    // If we're on the first screen of the onboarding flow, go to welcome
    if (pathname === '/caregiver-onboarding/caregiver-info') {
      router.replace('/welcome');
    } else {
      // Otherwise use the default back behavior
      router.back();
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: 'white' },
        headerLeft: () => (
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={24} color="#006B5B" />
          </TouchableOpacity>
        ),
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'white' },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationDuration: 200,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="caregiver-info" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          gestureEnabled: true,
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="account-creation" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="code-sharing" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="account-verification" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="recipient-info" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="interface-selection" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: '',
          animation: 'slide_from_right',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
} 