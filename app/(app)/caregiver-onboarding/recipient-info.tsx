import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Form, FormField, FormInput } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';
import { updateOnboardingStatus } from '@/services/profile';
import { useCaregiverRegistration, useFormValidation } from './_layout';
import { createPatient } from '@/services/patient';
import { PatientData } from '@/services/patient';

// Form schema
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  // phone: z.string().min(1, 'Phone number is required'),
});

type FormValues = z.infer<typeof formSchema>;


export default function RecipientInfoScreen() {
  const router = useRouter();
  const { user } = useSupabase();
  const { setIsValid } = useFormValidation();
  // const { setOnboardingStatus } = useCaregiverRegistration();
  const [formLoaded, setFormLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
  });
  
  // Update form validation status
  useFocusEffect(
    useCallback(() => {
      setIsValid(form.formState.isValid);
    }, [form.formState.isValid, setIsValid])
  );

  
  // Check for form validity on mount
  useEffect(() => {
    // Check if form already has values
    const currentValues = form.getValues();
    
    const isFormComplete = 
      currentValues.firstName.trim() !== '' && 
      currentValues.lastName.trim() !== '';
    
    if (isFormComplete) {
      setIsValid(true);
    }
    
    setFormLoaded(true);
  }, [form, setIsValid]);

  // Update form validation state
  useEffect(() => {
    if (formLoaded) {
      setIsValid(form.formState.isValid);
    }
  }, [form.formState.isValid, setIsValid, formLoaded]);

  // Handle form submission when "Continue" is pressed
  useFocusEffect(
    useCallback(() => {
      return () => {
        // This will run when navigating away from this screen
        if (form.formState.isValid) {
          submitPatientData();
        }
      };
    }, [form])
  );

  // Function to submit patient data
  const submitPatientData = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = form.getValues();
      
      // Convert form data to PatientData structure
      const patientData: PatientData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        // phone: formData.phone,
      };
      
      // Create patient in database
      try {
        await createPatient(user.id, patientData);
      } catch (error) {
        console.error('Error creating patient:', error);
        setError(error instanceof Error ? error.message : 'Failed to create patient record');
        return;
      }
      
      // Update onboarding status
      try {
        await updateOnboardingStatus(user.id, { patient_connected: true });
      } catch (error) {
        console.error('Error updating onboarding status:', error);
        setError(error instanceof Error ? error.message : 'Failed to update onboarding status');
        return;
      }
      // Navigate to next screen
      router.push('/caregiver-onboarding/interface-selection');
    } catch (error) {
      console.error('Error creating patient:', error);
      setError(error instanceof Error ? error.message : 'Failed to create patient record');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1 px-4 top-10" 
      >
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pb-36">
            <Text className="text-2xl font-medium mb-6">Tell us about your care recipient</Text>
            
            <Form {...form}>
              <View className="flex flex-col gap-4">
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
                  name="email"
                  render={({ field }) => (
                    <FormInput
                      label="Email"
                      placeholder="Enter their email"
                      autoCapitalize="none"
                      {...field}
                    />
                  )}  
                />


                {/* <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormInput
                      label="Phone"
                      placeholder="Enter their phone number"
                      autoCapitalize="none"
                      {...field}
                    />
                  )}
                />
                 */}


        
                {error && (
                  <Text className="text-sm font-medium text-destructive mt-2">
                    {error}
                  </Text>
                )}
                
                {isSubmitting && (
                  <Text className="text-sm text-muted-foreground text-center">
                    Creating patient record...
                  </Text>
                )}
              </View>
            </Form>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}