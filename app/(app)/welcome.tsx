import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Platform, Image as RNImage, View } from "react-native";
import Animated, {
	Easing,
	cancelAnimation,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontFamily } from "@/app/theme/fonts";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H2, P } from "@/components/ui/typography";

// Get screen width for animation calculations
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Image data for the carousel
const CAROUSEL_IMAGES = [
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
	"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
	"https://images.unsplash.com/photo-1509365465985-25d11c17e812",
	"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
	// Adding duplicates to make the carousel loop seamlessly
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
	"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
	"https://images.unsplash.com/photo-1509365465985-25d11c17e812",
	"https://images.unsplash.com/photo-1568605114967-8130f3a36994",
];

// Size of each image card
const CARD_WIDTH = SCREEN_WIDTH * 0.35;
const CARD_HEIGHT = 200;
const CARD_SPACING = 12;

// Different gradient settings for iOS and Android
const GRADIENT_CONFIG = {
  width: SCREEN_WIDTH * 0.2, // Much wider gradient
  leftEnd: 1, // Longer fade out
  rightStart: 0, // Earlier fade in
};

export default function WelcomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	
	// Animation value for the carousel
	const translateX = useSharedValue(0);
	
	// Calculate total width of all images
	const totalWidth = CAROUSEL_IMAGES.length * (CARD_WIDTH + CARD_SPACING);
	
	// Set up the continuous animation
	useEffect(() => {
		// Start position
		translateX.value = 0;
		
		// Animate to the end position (negative because we're moving left)
		const animation = withRepeat(
			withTiming(
				-(totalWidth / 2), // Only need to move half the distance since we duplicated the images
				{ 
					duration: 20000, // 20 seconds for one complete cycle
					easing: Easing.linear 
				}
			),
			-1, // Infinite repetitions
			false // Don't reverse the animation
		);
		
		translateX.value = animation;
		
		// Clean up animation when component unmounts
		return () => {
			cancelAnimation(translateX);
		};
	}, []);
	
	// Create the animated style
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		};
	});

	return (
		<SafeAreaView className="flex flex-1 bg-background">
			<View className="flex flex-1 px-8 pt-8 pb-4 justify-center">
				{/* Background pattern */}
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
	
				{/* Logo and tagline */}
				<View className="items-center justify-center mt-32 mb-4">
					<Image
						source={require("@/assets/logo.svg")}
						className="w-[150] h-[52] mr-4"
						contentFit="contain"
					/>
					<P 
						className="text-center text-[#002E1E] text-xl"
						
					>
						Weaving memories for those with Alzheimer's
					</P>
				</View>
				
				{/* Image Carousel */}
				<View className="flex-1 max-h-[200] relative">
					{/* Full-width carousel container that extends beyond parent padding */}
					<View 
						className="absolute left-0 right-0" 
						style={{ 
							width: SCREEN_WIDTH,
							marginLeft: -32, // Offset the parent's padding (8px * 4)
							overflow: 'hidden', // Ensure content doesn't overflow
						}}
					>
						<View className="h-[200] justify-center">
							{/* Left gradient mask */}
							<View
								style={{
									position: 'absolute',
									left: 0,
									top: 0,
									bottom: 0,
									width: GRADIENT_CONFIG.width,
									zIndex: 10,
								}}
							>
								<LinearGradient
									colors={['hsla(43, 20%, 93%, 1)', 'hsla(43, 20%, 93%, 0)']}
									start={{ x: 0, y: 0 }}
									end={{ x: GRADIENT_CONFIG.leftEnd, y: 0 }}
									style={{
										width: '100%',
										height: '100%',
									}}
								/>
							</View>
							
							<Animated.View 
								style={[
									{ flexDirection: 'row', paddingHorizontal: 16 },
									animatedStyle
								]}
							>
								{CAROUSEL_IMAGES.map((imageUri, index) => (
									<View 
										key={index} 
										style={{
											width: CARD_WIDTH,
											height: CARD_HEIGHT,
											marginRight: CARD_SPACING,
											borderRadius: 12,
											overflow: 'hidden',
											backgroundColor: '#f3f4f6',
										}}
									>
										<RNImage 
											source={{ uri: imageUri }} 
											style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
										/>
									</View>
								))}
							</Animated.View>
							
							{/* Right gradient mask */}
							<View
								style={{
									position: 'absolute',
									right: 0,
									top: 0,
									bottom: 0,
									width: GRADIENT_CONFIG.width,
									zIndex: 10,
								}}
							>
								<LinearGradient
									colors={['hsla(43, 20%, 93%, 0)', 'hsla(43, 20%, 93%, 1)']}
									start={{ x: GRADIENT_CONFIG.rightStart, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={{
										width: '100%',
										height: '100%',
									}}
								/>
							</View>
						</View>
					</View>
				</View>

				{/* Taglines */}
				<View className="mt-4 mb-6">
					<H2 
						className="text-left text-2xl text-[#002E1E] border-0 pb-0"
					>
						Every day is a Quilt.
					</H2>
					<H2 
						className="text-left text-2xl text-[#006B5B] border-0 pb-0"
					>
						Let's weave yours together.
					</H2>
				</View>

				{/* Buttons */}
				<View className="mb-4 gap-y-4">
					<Button
						size="lg"
						onPress={() => {
							router.push("/caregiver-onboarding");
						}}
					>
						<Text 
						>
							I am a caregiver or loved one
						</Text>
					</Button>
					<Button
						size="lg"
						variant="secondary"
						onPress={() => {
							router.push("/(app)/sign-up-recipient");
						}}
					>
						<Text 
						>
							I am receiving care
						</Text>
					</Button>
				</View>

				{/* Sign in link */}
				<View className="flex-row justify-center mt-2 mb-4">
					<Text 
						className="text-[#002E1E]"
						
					>
						Already have an account?{" "}
					</Text>
					<Text 
						className="text-[#006B5B]"
						style={{ fontFamily: fontFamily.semibold }}
						onPress={() => router.push("/sign-in")}
					>
						Sign in
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
