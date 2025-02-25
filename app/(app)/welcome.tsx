import { useRouter } from "expo-router";
import React from "react";
import { Image as RNImage, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontFamily } from "@/app/theme/fonts";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H2, P } from "@/components/ui/typography";

export default function WelcomeScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView className="flex flex-1 bg-background">
			<View className="flex flex-1 px-8 pt-8 pb-4">
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
				<View className="items-center justify-center mt-16 mb-4">
					<Image
						source={require("@/assets/logo.svg")}
						className="w-[200] h-[88]"
						contentFit="contain"
					/>
					<P 
						className="text-center text-[#002E1E] mt-4 text-lg"
						style={{ fontFamily: fontFamily.regular }}
					>
						Weaving memories for those with Alzheimer's
					</P>
				</View>

				{/* Image grid */}
				<View className="flex-1 mt-8">
					<View className="flex-row justify-between mb-2">
						<View className="w-[48%] h-32 bg-gray-100 rounded-lg overflow-hidden">
							<RNImage 
								source={{ uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" }} 
								className="w-full h-full"
								style={{ resizeMode: 'cover' }}
							/>
						</View>
						<View className="w-[48%] h-32 bg-gray-100 rounded-lg overflow-hidden">
							<RNImage 
								source={{ uri: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" }} 
								className="w-full h-full"
								style={{ resizeMode: 'cover' }}
							/>
						</View>
					</View>
					<View className="flex-row justify-between">
						<View className="w-[48%] h-32 bg-gray-100 rounded-lg overflow-hidden">
							<RNImage 
								source={{ uri: "https://images.unsplash.com/photo-1509365465985-25d11c17e812" }} 
								className="w-full h-full"
								style={{ resizeMode: 'cover' }}
							/>
						</View>
						<View className="w-[48%] h-32 bg-gray-100 rounded-lg overflow-hidden">
							<RNImage 
								source={{ uri: "https://images.unsplash.com/photo-1568605114967-8130f3a36994" }} 
								className="w-full h-full"
								style={{ resizeMode: 'cover' }}
							/>
						</View>
					</View>
				</View>

				{/* Taglines */}
				<View className="mt-4 mb-6">
					<H2 
						className="text-left text-2xl text-[#002E1E] border-0 pb-0"
						style={{ fontFamily: fontFamily.bold }}
					>
						Every day is a Quilt.
					</H2>
					<P 
						className="text-left text-2xl text-[#006B5B]"
						style={{ fontFamily: fontFamily.medium }}
					>
						Let's weave yours together.
					</P>
				</View>

				{/* Buttons */}
				<View className="mb-4 gap-y-4">
					<Button
						size="lg"
						className="bg-[#002E1E] py-6 rounded-full"
						onPress={() => {
							router.push("/sign-up");
						}}
					>
						<Text 
							className="text-white text-lg"
							style={{ fontFamily: fontFamily.medium }}
						>
							I am a caregiver or loved one
						</Text>
					</Button>
					<Button
						size="lg"
						className="bg-white border border-[#002E1E] py-6 rounded-full"
						onPress={() => {
							router.push("/sign-in");
						}}
					>
						<Text 
							className="text-[#002E1E] text-lg"
							style={{ fontFamily: fontFamily.medium }}
						>
							I am receiving care
						</Text>
					</Button>
				</View>

				{/* Sign in link */}
				<View className="flex-row justify-center mt-2 mb-4">
					<Text 
						className="text-[#002E1E]"
						style={{ fontFamily: fontFamily.regular }}
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
