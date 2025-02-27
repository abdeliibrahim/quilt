import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { useFormValidation } from "./_layout";

export default function InterfaceSelectionScreen() {
	const router = useRouter();
	const [selectedInterface, setSelectedInterface] = useState<
		"default" | "easy" | null
	>("default");
	const { setIsValid } = useFormValidation();
	useEffect(() => {
		setIsValid(selectedInterface !== null);
	}, [selectedInterface]);

	return (
		<SafeAreaView className="flex-1 bg-transparent">
			<View className="flex-1 justify-end px-4 py-4">
				<View className="bg-background">
					<Text className="text-2xl font-medium mb-6 ">
						How would you like their Quilt to look and feel?
					</Text>

					<View className="flex-row space-x-4 justify-between bg-background">
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => setSelectedInterface("default")}
							className={`rounded-xl p-4 flex-1 border border-transparent ${
								selectedInterface === "default"
									? "border  border-button/20"
									: ""
							}`}
						>
							<View className="items-center justify-center">
								<Image
									source={require("@/assets/onboarding/default-interface.svg")}
									className="w-[121] h-[155] bg-background"
								/>
							</View>

							<View className="flex-row items-center justify-center mt-4">
								<Text className="font-semibold text-xl">Default</Text>
							</View>

							<Text className="text-muted-foreground mt-2 text-center">
								Modern interface with standard text and contrast
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={0.5}
							className="rounded-xl p-4 flex-1 border border-transparent opacity-50"
						>
							<View className="items-center justify-center">
								<Image
									source={require("@/assets/onboarding/easy-interface.svg")}
									className="w-[118] h-[155] bg-background opacity-50"
								/>
							</View>

							<View className="flex-row items-center justify-center mt-4">
								<Text className="font-semibold text-xl text-muted-foreground">
									Easy
								</Text>
								<Text className="font-semibold text-sm text-muted-foreground ml-2">
									(Coming Soon)
								</Text>
							</View>

							<Text className="text-muted-foreground mt-2 text-center">
								Larger text, high contrast colors, and bigger buttons
							</Text>
						</TouchableOpacity>
					</View>

					<Text className="text-sm text-center text-muted-foreground mt-8">
						Don't worry—you can always change this later
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
