import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional(),
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
    console.log('Recipient info:', data);
    router.push('/caregiver-onboarding/interface-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-6">
            Please tell us about the person receiving care
          </Text>
          
          <Form {...form}>
            <View className="space-y-6">
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
                    label="Phone (Optional)"
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
                    autoCapitalize="none"
                    {...field}
                  />
                )}
              />
              
              {form.formState.errors.email?.message === "Either phone or email is required" && (
                <Text className="text-sm font-medium text-destructive">
                  Please provide either a phone number or email address
                </Text>
              )}
            </View>
          </Form>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 