import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Linking, Platform, Pressable, View } from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useFormValidation } from './_layout';

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
  const { setIsValid } = useFormValidation();
  const [formLoaded, setFormLoaded] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Check for form validity on mount (for returning to the page)
  useEffect(() => {
    // Check if form already has values
    const currentValues = form.getValues();
    
    const isFormComplete = 
      currentValues.email.trim() !== '' && 
      currentValues.phone.trim() !== '' && 
      currentValues.password.trim() !== '' && 
      currentValues.confirmPassword.trim() !== '' &&
      currentValues.password === currentValues.confirmPassword;
    
    if (isFormComplete && agreedToTerms) {
      setIsValid(true);
    }
    
    setFormLoaded(true);
  }, [form, setIsValid, agreedToTerms]);

  // Update form validation state in context when form validity or terms agreement changes
  useEffect(() => {
    if (formLoaded) {
      // Form is valid only if all fields are valid AND terms are agreed to
      setIsValid(form.formState.isValid && agreedToTerms);
    }
    
    return () => {
      // We don't reset form validity when unmounting anymore
      // This allows the form to stay valid when returning via back navigation
    };
  }, [form.formState.isValid, agreedToTerms, setIsValid, formLoaded]);

  // Handle checking/unchecking terms agreement
  const toggleTermsAgreement = () => {
    const newValue = !agreedToTerms;
    setAgreedToTerms(newValue);
    
    // Clear root error when agreeing to terms
    if (newValue && form.formState.errors.root) {
      form.clearErrors('root');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1 justify-end px-4 -top-10" 
      >
        <View className="pb-36">
          <Text className="text-2xl font-medium mb-6">Next, create an account to stay connected</Text>
          
          <Form {...form}>
          <View className="flex flex-col  gap-3 bg-background rounded-lg ">
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
              
              <View className="flex-row items-start mt-2">
                <Pressable 
                  onPress={toggleTermsAgreement}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 