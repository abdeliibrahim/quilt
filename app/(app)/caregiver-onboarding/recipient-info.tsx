import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email is required",
  path: ["email"],
});

type FormValues = z.infer<typeof formSchema>;

export default function RecipientInfoScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would save this data to state or context
    router.push('/caregiver-onboarding/interface-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      className="flex-1 justify-end px-4 -top-10" 
    >
      <View className="pb-36 bg-background">
          <Text className="text-2xl font-medium mb-6">Who are we preserving memories for?</Text>
          
          <Form {...form}>
            <View className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormInput
                    label="First Name"
                    placeholder="Enter their first name"
                    autoCapitalize="words"
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormInput
                    label="Last Name"
                    placeholder="Enter their last name"
                    autoCapitalize="words"
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormInput
                    label="Phone Number"
                    placeholder="Enter their phone number"
                    keyboardType="phone-pad"
                    {...field}
                  />
                )}
              />
              

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormInput
                    label="Email" 
                    placeholder="Enter their email"
                    keyboardType="email-address"
                    {...field}
                  />
                )}
              />
              


            </View>
          </Form>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
} 