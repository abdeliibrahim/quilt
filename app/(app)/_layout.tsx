import { Stack } from "expo-router";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export const unstable_settings = {
	initialRouteName: "(root)",
};

export default function AppLayout() {
	const { colorScheme, setColorScheme } = useColorScheme();
	setColorScheme("light");

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="(protected)" />
			<Stack.Screen name="welcome" />
			<Stack.Screen
				name="sign-up"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					animation: "slide_from_right",
				}}
			/>
			<Stack.Screen
				name="sign-up-recipient"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					animation: "slide_from_right",
					animationDuration: 200,
				}}
			/>
			<Stack.Screen
				name="caregiver-onboarding"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					animation: "slide_from_right",
					animationDuration: 200,
				}}
			/>
			<Stack.Screen
				name="help"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					animation: "slide_from_right",
				}}
			/>
			<Stack.Screen
				name="sign-in"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign In",
					headerStyle: {
						backgroundColor:
							colorScheme === "dark"
								? colors.dark.background
								: colors.light.background,
					},
					headerTintColor:
						colorScheme === "dark"
							? colors.dark.foreground
							: colors.light.foreground,
					gestureEnabled: true,
				}}
			/>
			<Stack.Screen
				name="modal"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Modal",
					headerStyle: {
						backgroundColor:
							colorScheme === "dark"
								? colors.dark.background
								: colors.light.background,
					},
					headerTintColor:
						colorScheme === "dark"
							? colors.dark.foreground
							: colors.light.foreground,
					gestureEnabled: true,
				}}
			/>
		</Stack>
	);
}
