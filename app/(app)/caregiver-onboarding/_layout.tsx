import { BackgroundPattern } from "@/components/background-pattern";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { usePathname, useRouter } from "expo-router";
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Alert,
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	View,
} from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import { AccountInfo, CaregiverInfo } from "@/services/auth";
import {
	CaregiverOnboardingStatus,
	markOnboardingComplete
} from "@/services/profile";
import { CustomStack } from "../../../CustomStack";

// Create a context for form validation and navigation tracking
interface FormValidationContextType {
	isValid: boolean;
	setIsValid: (isValid: boolean) => void;
	previousScreen: string | null;
}

export const FormValidationContext = createContext<FormValidationContextType>({
	isValid: false,
	setIsValid: () => {},
	previousScreen: null,
});

// Create a context for storing caregiver registration data
interface CaregiverRegistrationContextType {
	caregiverInfo: CaregiverInfo;
	setCaregiverInfo: (info: CaregiverInfo) => void;
	accountInfo: AccountInfo;
	setAccountInfo: (info: AccountInfo) => void;
	isRegistering: boolean;
	setIsRegistering: (isRegistering: boolean) => void;
	registrationError: string | null;
	setRegistrationError: (error: string | null) => void;
}

export const CaregiverRegistrationContext =
	createContext<CaregiverRegistrationContextType>({
		caregiverInfo: { 
			firstName: "", 
			lastName: "", 
			relationship: "" 
		},
		setCaregiverInfo: () => {},
		accountInfo: { email: "", phone: "", password: "" },
		setAccountInfo: () => {},
		isRegistering: false,
		setIsRegistering: () => {},
		registrationError: null,
		setRegistrationError: () => {},
	});

export const useFormValidation = () => useContext(FormValidationContext);
export const useCaregiverRegistration = () =>
	useContext(CaregiverRegistrationContext);

// Helper to determine if a screen comes after account creation
const isPostAccountCreation = (path: string) => {
	return (
		path.includes("code-sharing") ||
		path.includes("account-verification")
	);
};

const hideContinueButton = (path: string) => {
	return path.includes("prompt-recipient-setup") || path.includes("account-verification");
};

export default function CaregiverOnboardingLayout() {
	const router = useRouter();
	const pathname = usePathname();
	const colorScheme = "light";
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const progressAnim = useRef(new Animated.Value(0)).current;
	const [isFormValid, setIsFormValid] = useState(false);
	const previousPathRef = useRef<string | null>(null);

	// Get user from Supabase context
	const { user } = useSupabase();

	// Get onboarding status from user
	const [onboardingStatus, setOnboardingStatus] =
		useState<CaregiverOnboardingStatus | null>(null);

	// Check if onboarding is complete

	// Caregiver registration state
	const [caregiverInfo, setCaregiverInfo] = useState<CaregiverInfo>(() => {
		// Try to load from storage or return default values
		return {
			firstName: "",
			lastName: "",
			relationship: "",
		};
	});
	const [accountInfo, setAccountInfo] = useState<AccountInfo>({
		email: "",
		phone: "",
		password: "",
	});
	const [isRegistering, setIsRegistering] = useState(false);
	const [registrationError, setRegistrationError] = useState<string | null>(
		null,
	);

	// Add keyboard listeners
	useEffect(() => {
		const keyboardWillShow = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			() => setKeyboardVisible(true),
		);
		const keyboardWillHide = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			() => setKeyboardVisible(false),
		);

		return () => {
			keyboardWillShow.remove();
			keyboardWillHide.remove();
		};
	}, []);

	const handleBackPress = () => {
		router.back();
	};

	// Set progress value based on current screen
	useEffect(() => {
		let progressValue = 0;

		if (pathname.includes("caregiver-info")) {
			progressValue = 0.15;
		} else if (pathname.includes("account-creation")) {
			progressValue = 0.3;
		} else if (pathname.includes("code-sharing")) {
			progressValue = 1;
		} else if (pathname.includes("account-verification")) {
			progressValue = 0.6;
		} else if (pathname.includes("recipient-info")) {
			progressValue = 0.75;
		} else if (pathname.includes("interface-selection")) {
			progressValue = 0.9;
		}

		Animated.timing(progressAnim, {
			toValue: progressValue,
			duration: 300,
			useNativeDriver: false,
		}).start();

		// Only reset form validity when navigating FORWARD, not when going back
		// We can detect navigation direction by comparing current path to previous path
		if (
			previousPathRef.current &&
			getProgressValue(pathname) > getProgressValue(previousPathRef.current)
		) {
			// Going forward - reset form validity
			setIsFormValid(false);
		}

		// Store current path for next comparison
		previousPathRef.current = pathname;
	}, [pathname, progressAnim]);

	// Helper function to get numerical progress value for a pathname
	const getProgressValue = (path: string): number => {
		if (path.includes("caregiver-info")) return 0.15;
		if (path.includes("account-creation")) return 0.3;
		if (path.includes("code-sharing")) return 0.45;
		if (path.includes("account-verification")) return 0.6;
		if (path.includes("recipient-info")) return 0.75;
		if (path.includes("interface-selection")) return 0.9;
		return 0;
	};

	// Function to handle continue button press
	const handleContinue = () => {
		// Dismiss keyboard first
		Keyboard.dismiss();

		// Wait a short delay before continuing to ensure keyboard is dismissed
		setTimeout(() => {
			if (pathname.includes("caregiver-info")) {
				// Log caregiver info before navigating
				console.log("[Layout] Caregiver info before navigation:", caregiverInfo);
				
				// Only navigate if we have valid caregiver info
				if (caregiverInfo.firstName && caregiverInfo.lastName && caregiverInfo.relationship) {
					router.push("/caregiver-onboarding/account-creation");
				} else {
					// Alert if info is incomplete
					Alert.alert(
						"Missing Information",
						"Please complete all fields before continuing.",
						[{ text: "OK" }]
					);
				}
			} else if (pathname.includes("account-creation")) {
				// Start the registration process
				setIsRegistering(true);
				// The registration process is handled in the account-creation.tsx file
				// It will navigate to the next screen when complete
			} else if (pathname.includes("account-verification")) {
				router.push("/caregiver-onboarding/prompt-recipient-setup");
			} else if (pathname.includes("prompt-recipient-setup")) {
				router.push("/caregiver-onboarding/recipient-info");
			} else if (pathname.includes("recipient-info")) {
				router.push("/caregiver-onboarding/interface-selection");
			} else if (pathname.includes("interface-selection")) {
				router.push("/caregiver-onboarding/code-sharing");
			} else if (pathname.includes("code-sharing")) {
				if (user) {
					markOnboardingComplete(user.id)
						.then(() => {
							// Navigate to the protected home screen after onboarding is complete
							router.replace("/(app)/(protected)");
						})
						.catch((error) => {
							console.error("Error marking onboarding as complete:", error);
						});
				} else {
					// If no user, still navigate to home
					router.replace("/(app)/(protected)");
				}
			}
			// Final step - navigate to main app
		}, 100);
	};

	return (
		<FormValidationContext.Provider
			value={{
				isValid: isFormValid,
				setIsValid: setIsFormValid,
				previousScreen: previousPathRef.current,
			}}
		>
			<CaregiverRegistrationContext.Provider
				value={{
					caregiverInfo,
					setCaregiverInfo,
					accountInfo,
					setAccountInfo,
					isRegistering,
					setIsRegistering,
					registrationError,
					setRegistrationError,
				}}
			>
				<View className="flex-1 bg-background">
					{/* Background pattern */}
					<BackgroundPattern />

					{/* Stack navigator without KeyboardAvoidingView to keep header fixed */}
					<View className="flex-1">
						<CustomStack
							screenOptions={{
								headerShown: true,
								headerTitle: "",
								headerShadowVisible: false,
								headerStyle: {
									backgroundColor: "transparent", // Make header transparent
								},
								headerLeft: ({ canGoBack }) => {
									return (
										<View
											style={{
												width: 50,
												paddingLeft: 16,
												justifyContent: "center",
											}}
										>
											{canGoBack && !isPostAccountCreation(pathname) ? (
												<TouchableOpacity onPress={handleBackPress}>
													<Ionicons
														name="chevron-back"
														size={24}
														color="#006B5B"
													/>
												</TouchableOpacity>
											) : null}
										</View>
									);
								},
								headerRight: () => (
									<View
										style={{
											width: 90,
											paddingRight: 16,
											justifyContent: "center",
											alignItems: "flex-end",
										}}
									>
										<Image
											source={require("@/assets/logo.svg")}
											className="w-[72] h-[52]"
											contentFit="contain"
										/>
									</View>
								),
								headerTitleAlign: "center",
								cardStyle: {
									backgroundColor: "transparent", // Make content background transparent
								},
								gestureEnabled: !isPostAccountCreation(pathname),
								gestureDirection: "horizontal",
								// Default transition spec for all screens
								transitionSpec: {
									open: {
										animation: "timing",
										config: { duration: 200 },
									},
									close: {
										animation: "timing",
										config: { duration: 200 },
									},
								},
								// Default card style interpolator for horizontal slide
								cardStyleInterpolator: ({ current, layouts }) => {
									return {
										cardStyle: {
											transform: [
												{
													translateX: current.progress.interpolate({
														inputRange: [0, 1],
														outputRange: [layouts.screen.width, 0],
													}),
												},
											],
										},
									};
								},
							}}
						>
							<CustomStack.Screen
								name="index"
								options={{
									headerShown: false,
								}}
							/>
							<CustomStack.Screen
								name="caregiver-info"
								options={{
									headerBackTitle: "",
									gestureEnabled: true,
									presentation: "card",
									cardStyle: {
										backgroundColor: "transparent", // Make content background transparent
									},
								}}
							/>
							<CustomStack.Screen
								name="account-creation"
								options={{
									headerBackTitle: "",
									gestureEnabled: true,
									presentation: "card",
									cardStyle: {
										backgroundColor: "transparent", // Make content background transparent
									},
								}}
							/>
							<CustomStack.Screen
								name="code-sharing"
								options={{
									headerBackTitle: "",
									presentation: "card",
									gestureEnabled: false,
								}}
							/>
							<CustomStack.Screen
								name="prompt-recipient-setup"
								options={{
									headerBackTitle: "",
									presentation: "card",
									gestureEnabled: true,
								}}
							/>
							<CustomStack.Screen
								name="account-verification"
								options={{
									headerBackTitle: "",
									presentation: "card",
									gestureEnabled: false,
								}}
							/>
							<CustomStack.Screen
								name="recipient-info"
								options={{
									headerBackTitle: "",
									presentation: "card",
									gestureEnabled: true,
								}}
							/>
							<CustomStack.Screen
								name="interface-selection"
								options={{
									headerBackTitle: "",
									presentation: "card",
									gestureEnabled: true,
								}}
							/>
						</CustomStack>
					</View>

					{/* Continue button */}
					{pathname !== "/caregiver-onboarding" &&
						pathname !== "/caregiver-onboarding/index" &&
						!hideContinueButton(pathname) && (
							<KeyboardAvoidingView
								className="px-4 "
								behavior={Platform.OS === "ios" ? "position" : "height"}
								keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
							>
								{keyboardVisible ? (
									// Regular view without safe area when keyboard is visible
									<View className="bg-transparent pb-4">
										<View className="mb-4">
											<View className="h-2 bg-muted rounded-full overflow-hidden">
												<Animated.View
													className="h-full bg-button rounded-full"
													style={{
														width: progressAnim.interpolate({
															inputRange: [0, 1],
															outputRange: ["0%", "100%"],
														}),
													}}
												/>
											</View>
										</View>

										<Button
											size="lg"
											onPress={handleContinue}
											disabled={!isFormValid}
											className={`h-14 ${!isFormValid ? "opacity-50" : ""}`}
										>
											<Text className="text-white font-medium text-lg">
												{onboardingStatus?.final_step ? "Finish" : "Continue"}
											</Text>
										</Button>
									</View>
								) : (
									// SafeAreaView when keyboard is not visible
									<SafeAreaView edges={["bottom"]} className="bg-transparent">
										<View className="mb-4">
											<View className="h-2 bg-muted rounded-full overflow-hidden">
												<Animated.View
													className="h-full bg-button rounded-full"
													style={{
														width: progressAnim.interpolate({
															inputRange: [0, 1],
															outputRange: ["0%", "100%"],
														}),
													}}
												/>
											</View>
										</View>

										<Button
											size="lg"
											onPress={handleContinue}
											disabled={
												pathname.includes("code-sharing") ||
												pathname.includes("account-verification") ||
												pathname.includes("interface-selection")
													? false
													: !isFormValid
											}
											// className={`h-14 ${!isFormValid ? 'opacity-50' : ''}`}
										>
											<Text className="text-white font-medium text-lg">
												{pathname.includes("code-sharing")
													? "Finish"
													: "Continue"}
											</Text>
										</Button>
									</SafeAreaView>
								)}
							</KeyboardAvoidingView>
						)}
				</View>
			</CaregiverRegistrationContext.Provider>
		</FormValidationContext.Provider>
	);
}
