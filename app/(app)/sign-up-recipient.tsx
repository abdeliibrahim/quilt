import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import * as z from "zod";

import { fontFamily } from "@/app/theme/fonts";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";

// Validation schema for the invitation code
const formSchema = z.object({
  code: z.string().min(1, "Please enter an invitation code"),
});

export default function SignUpRecipient() {
  const router = useRouter();
  const { } = useSupabase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // This is a placeholder - you'll need to implement the actual verification logic
      // For now, we'll just simulate a successful verification
      const isValid = true; // Placeholder for actual verification

      if (isValid) {
        // Navigate to the sign-in page after successful verification
        router.push("/sign-in");
      } else {
        form.setError("code", { 
          type: "manual", 
          message: "Invalid invitation code. Please try again." 
        });
      }
    } catch (error: Error | any) {
      console.log(error.message);
      form.setError("code", { 
        type: "manual", 
        message: "An error occurred. Please try again." 
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 pt-8 pb-4 justify-center">
        {/* Background pattern - similar to welcome screen */}
        <View className="absolute top-0 right-0 opacity-10">
          <View className="flex flex-row flex-wrap">
            {Array.from({ length: 28 }).map((_, i) => (
              <View 
                key={i} 
                className="w-12 h-12 rounded-lg m-1"
                style={{ 
                  backgroundColor: i < 10 ? '#8A9A5B' : 'transparent',
                  opacity: i < 10 ? 0.2 + (i * 0.08) : 0
                }} 
              />
            ))}
          </View>
        </View>

        {/* Logo */}
        <View className="items-center justify-center mb-6">
          <Image
            source={require("@/assets/logo.svg")}
            className="w-[150] h-[52]"
            contentFit="contain"
          />
        </View>

        {/* Back button */}
        <View className="absolute top-8 left-8">
          <Button
            variant="ghost"
            className="p-0"
            onPress={() => router.back()}
          >
            <Text className="text-[#006B5B] text-lg">←</Text>
          </Button>
        </View>

        {/* Invitation code form */}
        <View className="mb-8">
          <Text className="text-2xl font-semibold mb-8 text-center">
            Please enter the invitation code below.
          </Text>

          <Form {...form}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormInput
                  label="Code"
                  placeholder="Code"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-lg h-16"
                  {...field}
                />
              )}
            />
          </Form>
        </View>

        {/* Help link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-[#002E1E]">
            Didn't receive a code?{" "}
          </Text>
          <Text 
            className="text-[#006B5B]"
            style={{ fontFamily: fontFamily.semibold }}
            onPress={() => {
              // Handle help action
              router.push("/help");
            }}
          >
            Help
          </Text>
        </View>

        {/* Continue button */}
        <Button
          size="lg"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          <Text>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 