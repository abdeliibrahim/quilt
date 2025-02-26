import { usePathname } from "expo-router";
import { CustomStack } from "../../CustomStack";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export const unstable_settings = {
	initialRouteName: "(root)",
};


export default function AppLayout() {
	const { colorScheme, setColorScheme } = useColorScheme();
	setColorScheme("light");

	const cannotGoBack = (path: string) => {
		return path.includes('code-sharing') || 
			   path.includes('account-verification') ||
			   path.includes('recipient-info') ||
			   path.includes('interface-selection')
	  };


	return (
		<CustomStack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<CustomStack.Screen name="(protected)" />
			<CustomStack.Screen name="welcome" />
			<CustomStack.Screen
				name="sign-up"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					transitionSpec: {
						open: {
							animation: 'timing',
							config: { duration: 300 },
						},
						close: {
							animation: 'timing',
							config: { duration: 300 },
						},
					},
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
			/>
			<CustomStack.Screen
				name="sign-up-recipient"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					transitionSpec: {
						open: {
							animation: 'timing',
							config: { duration: 200 },
						},
						close: {
							animation: 'timing',
							config: { duration: 200 },
						},
					},
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
			/>
			<CustomStack.Screen
				name="caregiver-onboarding"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: !cannotGoBack(usePathname()),
					transitionSpec: {
						open: {
							animation: 'timing',
							config: { duration: 200 },
						},
						close: {
							animation: 'timing',
							config: { duration: 200 },
						},
					},
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
			/>
			<CustomStack.Screen
				name="help"
				options={{
					presentation: "card",
					headerShown: false,
					gestureEnabled: true,
					transitionSpec: {
						open: {
							animation: 'timing',
							config: { duration: 300 },
						},
						close: {
							animation: 'timing',
							config: { duration: 300 },
						},
					},
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
			/>
			<CustomStack.Screen
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
					transitionSpec: {
						open: {
							animation: 'spring',
							config: { 
								stiffness: 1000,
								damping: 500,
								mass: 3,
								overshootClamping: true,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
						close: {
							animation: 'spring',
							config: {
								stiffness: 1000,
								damping: 500,
								mass: 3,
								overshootClamping: true,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
					},
					cardStyleInterpolator: ({ current, layouts }) => {
						return {
							cardStyle: {
								transform: [
									{
										translateY: current.progress.interpolate({
											inputRange: [0, 1],
											outputRange: [layouts.screen.height, 0],
										}),
									},
								],
							},
							overlayStyle: {
								opacity: current.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 0.5],
								}),
							},
						};
					},
				}}
			/>
			<CustomStack.Screen
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
					transitionSpec: {
						open: {
							animation: 'spring',
							config: { 
								stiffness: 1000,
								damping: 500,
								mass: 3,
								overshootClamping: true,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
						close: {
							animation: 'spring',
							config: {
								stiffness: 1000,
								damping: 500,
								mass: 3,
								overshootClamping: true,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
					},
					cardStyleInterpolator: ({ current, layouts }) => {
						return {
							cardStyle: {
								transform: [
									{
										translateY: current.progress.interpolate({
											inputRange: [0, 1],
											outputRange: [layouts.screen.height, 0],
										}),
									},
								],
							},
							overlayStyle: {
								opacity: current.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 0.5],
								}),
							},
						};
					},
				}}
			/>
		</CustomStack>
	);
}
