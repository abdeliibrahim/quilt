import { useRouter } from "expo-router";
import { Linking, View } from "react-native";

import { fontFamily } from "@/app/theme/fonts";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, P } from "@/components/ui/typography";

export default function HelpScreen() {
	const router = useRouter();

	const contactSupport = () => {
		// Replace with your actual support email
		Linking.openURL(
			"mailto:support@quiltapp.com?subject=Invitation%20Code%20Help",
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 px-8 pt-8 pb-4">
				{/* Background pattern - similar to welcome screen */}
				<View className="absolute top-0 right-0 opacity-10">
					<View className="flex flex-row flex-wrap">
						{Array.from({ length: 28 }).map((_, i) => (
							<View
								key={i}
								className="w-12 h-12 rounded-lg m-1"
								style={{
									backgroundColor: i < 10 ? "#8A9A5B" : "transparent",
									opacity: i < 10 ? 0.2 + i * 0.08 : 0,
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

				{/* Back button and title */}
				<View className="flex-row items-center mb-6">
					<Button
						variant="ghost"
						className="mr-2 p-0"
						onPress={() => router.back()}
					>
						<Text className="text-[#006B5B] text-lg">←</Text>
					</Button>
					<H1 className="self-start">Need Help?</H1>
				</View>

				<View className="mb-8">
					<P className="mb-4">
						To use Quilt as a care recipient, you need an invitation code from
						your caregiver or healthcare provider.
					</P>

					<P className="mb-4">
						If you haven't received a code, please ask your caregiver to:
					</P>

					<View className="mb-4 ml-4">
						<Text className="mb-2" style={{ fontFamily: fontFamily.medium }}>
							• Sign up for a caregiver account
						</Text>
						<Text className="mb-2" style={{ fontFamily: fontFamily.medium }}>
							• Add you as a care recipient
						</Text>
						<Text className="mb-2" style={{ fontFamily: fontFamily.medium }}>
							• Share the generated invitation code with you
						</Text>
					</View>

					<P className="mb-4">
						If you're still having trouble, our support team is here to help.
					</P>
				</View>

				<View className="gap-4">
					<Button size="lg" onPress={contactSupport}>
						<Text>Contact Support</Text>
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
