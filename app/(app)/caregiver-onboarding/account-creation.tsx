import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountCreationScreen() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!agreedToTerms) {
      form.setError('root', {
        type: 'manual',
        message: 'You must agree to the Terms of Service and Privacy Policy'
      });
      return;
    }
    
    // In a real app, you would save this data to state or context
    console.log('Account creation data:', data);
    router.push('/caregiver-onboarding/code-sharing');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-6">Next, create an account to stay connected</Text>
          
          <Form {...form}>
            <View className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInput
                    label="Email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormInput
                    label="Phone"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    placeholder="Create a password"
                    secureTextEntry
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    secureTextEntry
                    {...field}
                  />
                )}
              />
              
              <View className="flex-row items-start mt-4">
                <Pressable 
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  className="w-6 h-6 rounded-md border border-input mr-2 items-center justify-center"
                >
                  {agreedToTerms && (
                    <View className="w-4 h-4 bg-button rounded-sm" />
                  )}
                </Pressable>
                <View className="flex-1">
                  <Text className="text-sm">
                    I agree to the{' '}
                    <Text 
                      className="text-button underline" 
                      onPress={() => Linking.openURL('https://example.com/terms')}
                    >
                      Terms of Service
                    </Text>
                    {' '}and{' '}
                    <Text 
                      className="text-button underline" 
                      onPress={() => Linking.openURL('https://example.com/privacy')}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </View>
              
              {form.formState.errors.root && (
                <Text className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </Text>
              )}
            </View>
          </Form>
        </View>
      </ScrollView>
      
      <View className="p-4 border-t border-border">
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 