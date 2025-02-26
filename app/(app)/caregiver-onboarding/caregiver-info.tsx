import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Animated,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import { z } from 'zod';

import { SafeAreaView } from '@/components/safe-area-view';
import { Form, FormField, FormInput, FormLabel } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useFormValidation } from './_layout';

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
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<Picker<string>>(null);
  const { setIsValid,  } = useFormValidation();
  const [formLoaded, setFormLoaded] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  
  // Log when screen becomes active
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      relationship: '',
    },
    mode: 'onChange',
  });
  
  useFocusEffect(
    useCallback(() => {
      setIsValid(form.formState.isValid);
    }, [])
  );

  // Handle animations when picker visibility changes
  useEffect(() => {
    if (showPicker) {
      // Fade in background and slide up picker
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150, // Reduced from 300
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150, // Reduced from 300
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out background and slide down picker
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100, // Reduced from 250
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 100, // Reduced from 250
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showPicker, fadeAnim, slideAnim]);
  
  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showPicker && Platform.OS === 'ios') {
        setShowPicker(false);
        return true;
      }
      router.replace('/welcome');
      return true;
    });

    return () => backHandler.remove();
  }, [router, showPicker]);

  // Check for form validity on mount (for returning to the page)
  useEffect(() => {
      // Only validate initial form state if we're not resetting
      const currentValues = form.getValues();
      
      const isFormComplete = 
        currentValues.firstName.trim() !== '' && 
        currentValues.lastName.trim() !== '' && 
        currentValues.relationship.trim() !== '';
      
      if (isFormComplete) {
        setIsValid(true);
      }
    
    setFormLoaded(true);
  }, [form, setIsValid]);

  // Update form validation state in context whenever form validity changes
  useEffect(() => {
    if (formLoaded) {
      setIsValid(form.formState.isValid);
    }
    
    return () => {
      // We don't reset form validity when unmounting anymore
      // This allows the form to stay valid when returning via back navigation
    };
  }, [form.formState.isValid, setIsValid, formLoaded]);

  // Store form data in global state or context when valid
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (form.formState.isValid) {
        // In a real app, you would save this data to state or context
        console.log('Caregiver info:', data);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Get the selected relationship label
  const getRelationshipLabel = (value: string) => {
    const option = RELATIONSHIP_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : 'Select relationship';
  };

  // Close picker with animation
  const closePicker = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150, // Reduced from 250
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 150, // Reduced from 250
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPicker(false);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1 justify-end px-4 -top-10" 
      >
        <View className="pb-36">
            <Text className="text-2xl font-medium mb-6">First, tell us about yourself</Text>
            
            <Form {...form}>
              <View className="flex flex-col gap-3">
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
                      <FormLabel nativeID={''}>Relationship to care recipient</FormLabel>
                      
                      {Platform.OS === 'web' && (
                        <View className="border border-input rounded-md overflow-hidden">
                          <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-full h-12 px-3 bg-transparent text-foreground focus:outline-none"
                            style={{ 
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 0.7rem top 50%',
                              backgroundSize: '0.65rem auto',
                              paddingRight: '1.75rem'
                            }}
                          >
                            <option value="" disabled>Select relationship</option>
                            {RELATIONSHIP_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </View>
                      )}
                      
                      {Platform.OS === 'android' && (
                        <View>
                          <TouchableOpacity 
                            onPress={() => {
                              Keyboard.dismiss();
                              setShowPicker(true);
                              setTimeout(() => {
                                pickerRef.current?.focus();
                              }, 100);
                            }}
                            className="border border-input rounded-md h-12 px-3 justify-center"
                          >
                            <Text className={field.value ? "text-foreground" : "text-muted-foreground"}>
                              {field.value ? getRelationshipLabel(field.value) : "Select relationship"}
                            </Text>
                          </TouchableOpacity>
                          
                          {showPicker && (
                            <View className="border border-input rounded-md mt-1 overflow-hidden">
                              <Picker
                                ref={pickerRef}
                                selectedValue={field.value}
                                onValueChange={(itemValue) => {
                                  field.onChange(itemValue);
                                  setShowPicker(false);
                                }}
                                onBlur={() => setShowPicker(false)}
                                style={{ 
                                  backgroundColor: 'transparent',
                                  display: showPicker ? 'flex' : 'none',
                                  height: 200,
                                }}
                                dropdownIconColor="#a1a1aa"
                                prompt="Select relationship"
                              >
                                <Picker.Item 
                                  label="Select relationship" 
                                  value="" 
                                  enabled={false}
                                />
                                {RELATIONSHIP_OPTIONS.map((option) => (
                                  <Picker.Item
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                  />
                                ))}
                              </Picker>
                            </View>
                          )}
                        </View>
                      )}
                      
                      {Platform.OS === 'ios' && (
                        <View>
                          <TouchableOpacity 
                            onPress={() => {
                              Keyboard.dismiss();
                              setShowPicker(true);
                            }}
                            className="border border-input bg-white rounded-xl h-12 px-3 justify-center"
                          >
                            <Text className={field.value ? "text-foreground" : "text-muted-foreground" + ' text-lg'}>
                              {field.value ? getRelationshipLabel(field.value) : "Select relationship"}
                            </Text>
                          </TouchableOpacity>
                          
                          <Modal
                            visible={showPicker}
                            transparent={true}
                            animationType="none"
                            onRequestClose={() => closePicker()}
                          >
                            <Animated.View 
                              style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                opacity: fadeAnim,
                              }}
                            >
                              <TouchableOpacity 
                                activeOpacity={1} 
                                onPress={() => closePicker()}
                                style={{ flex: 1 }}
                              >
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                  <TouchableOpacity 
                                    activeOpacity={1} 
                                    onPress={(e) => e.stopPropagation()}
                                  >
                                    <Animated.View
                                      style={[
                                        {
                                          transform: [{ translateY: slideAnim }],
                                        },
                                        { backgroundColor: 'white' } // Fallback color
                                      ]}
                                      className="bg-background"
                                    >
                                      <View className="flex-row justify-between border-b border-border p-4">
                                        <TouchableOpacity onPress={() => closePicker()}>
                                          <Text className=" font-medium text-xl">Select Relationship</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                          onPress={() => {
                                            if (!field.value) {
                                              field.onChange(RELATIONSHIP_OPTIONS[0].value);
                                            }
                                            closePicker();
                                          }}
                                        >
                                          <Text className="text-secondary font-medium text-xl">Done</Text>
                                        </TouchableOpacity>
                                      </View>
                                      
                                      <Picker
                                        selectedValue={field.value || RELATIONSHIP_OPTIONS[0].value}
                                        onValueChange={(itemValue) => field.onChange(itemValue)}
                                        style={{ 
                                          backgroundColor: 'transparent',
                                          height: 215,
                                          width: '100%',
                                        }}
                                        itemStyle={{ 
                                          fontSize: 18,
                                          height: 215,
                                        }}
                                      >
                                        {RELATIONSHIP_OPTIONS.map((option) => (
                                          <Picker.Item
                                            key={option.value}
                                            label={option.label}
                                            value={option.value}
                                          />
                                        ))}
                                      </Picker>
                                    </Animated.View>
                                  </TouchableOpacity>
                                </View>
                              </TouchableOpacity>
                            </Animated.View>
                          </Modal>
                        </View>
                      )}
                      
                      {form.formState.errors.relationship && (
                        <Text className="text-sm font-medium text-destructive">
                          {form.formState.errors.relationship.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </Form>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}