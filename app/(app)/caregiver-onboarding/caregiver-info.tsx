import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BackHandler, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
});

type FormValues = z.infer<typeof formSchema>;

// Relationship options
const RELATIONSHIP_OPTIONS = [
  { label: 'Parent', value: 'parent' },
  { label: 'Child', value: 'child' },
  { label: 'Grandchild', value: 'grandchild' },
  { label: 'Caretaker', value: 'caretaker' },
];

export default function CaregiverInfoScreen() {
  const router = useRouter();
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  
  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/welcome');
      return true;
    });

    return () => backHandler.remove();
  }, [router]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      relationship: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, you would save this data to state or context
    console.log('Caregiver info:', data);
    router.push('/caregiver-onboarding/account-creation');
  };

  // Get the selected relationship label
  const getRelationshipLabel = (value: string) => {
    const option = RELATIONSHIP_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : 'Select relationship';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-6">First, tell us about yourself</Text>
          
          <Form {...form}>
            <View className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormInput
                    label="First Name"
                    placeholder="Enter your first name"
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
                    placeholder="Enter your last name"
                    autoCapitalize="words"
                    {...field}
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <View className="space-y-2">
                    <Text className="font-medium text-foreground pb-1 px-px">Relationship to care recipient</Text>
                    <TouchableOpacity 
                      onPress={() => setShowRelationshipModal(true)}
                      className="border border-input rounded-md h-12 px-3 justify-center"
                    >
                      <Text className={field.value ? "text-foreground" : "text-muted-foreground"}>
                        {field.value ? getRelationshipLabel(field.value) : "Select relationship"}
                      </Text>
                    </TouchableOpacity>
                    
                    {form.formState.errors.relationship && (
                      <Text className="text-sm font-medium text-destructive">
                        {form.formState.errors.relationship.message}
                      </Text>
                    )}
                    
                    {/* Relationship Selection Modal */}
                    <Modal
                      visible={showRelationshipModal}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setShowRelationshipModal(false)}
                    >
                      <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-background rounded-t-xl">
                          <View className="p-4 border-b border-border">
                            <Text className="text-lg font-medium text-center">Select Relationship</Text>
                          </View>
                          
                          <ScrollView className="max-h-80">
                            {RELATIONSHIP_OPTIONS.map((option) => (
                              <TouchableOpacity
                                key={option.value}
                                className={`p-4 border-b border-border ${
                                  field.value === option.value ? "bg-button/10" : ""
                                }`}
                                onPress={() => {
                                  field.onChange(option.value);
                                  setShowRelationshipModal(false);
                                }}
                              >
                                <Text className="text-lg">{option.label}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                          
                          <TouchableOpacity
                            className="p-4 border-t border-border"
                            onPress={() => setShowRelationshipModal(false)}
                          >
                            <Text className="text-button text-center font-medium">Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                )}
              />
            </View>
          </Form>
        </View>
      </ScrollView>
      
      <View className="p-4 border-t border-border">
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 