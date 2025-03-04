// import { useRouter } from "expo-router";
// import React, { useEffect } from "react";
// import { View } from "react-native";

// import { SafeAreaView } from "@/components/safe-area-view";
// import { Button } from "@/components/ui/button";
// import { Text } from "@/components/ui/text";
// import { Ionicons } from "@expo/vector-icons";
// import { useFormValidation } from "./_layout";

// export default function AccountVerificationScreen() {
// 	const router = useRouter();
// 	const { setIsValid } = useFormValidation();

// 	// Set form as valid so the continue button is enabled
// 	useEffect(() => {
// 		setIsValid(true);
// 	}, [setIsValid]);

// 	return (
// 		<SafeAreaView className="flex-1 bg-transparent">
// 			<View className="flex-1 px-4 pt-8 items-center">
// 				<View className="w-20 h-20 bg-muted-foreground/10 rounded-full items-center justify-center mb-6">
// 					<Ionicons name="mail-outline" size={40} color="#006B5B" />
// 				</View>

// 				<Text className="text-2xl font-medium text-center mb-4">
// 					Verify your email
// 				</Text>

// 				<Text className="text-base text-center text-muted-foreground mb-8">
// 					We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
// 				</Text>

// 				<View className="bg-muted/30 p-4 rounded-lg mb-8 w-full">
// 					<Text className="text-sm text-muted-foreground">
// 						<Text className="font-medium">Note:</Text> If you don't see the email in your inbox, please check your spam folder.
// 					</Text>
// 				</View>

// 				<Button
// 					variant="outline"
// 					className="mb-4"
// 					onPress={() => {
// 						// This would typically resend the verification email
// 						// For now, we'll just show an alert
// 						alert("Verification email resent!");
// 					}}
// 				>
// 					<Text>Resend verification email</Text>
// 				</Button>

// 				<Text className="text-sm text-muted-foreground text-center mt-8">
// 					Once you've verified your email, tap Continue below to proceed with setting up your care recipient.
// 				</Text>
// 			</View>
// 		</SafeAreaView>
// 	);
// }
