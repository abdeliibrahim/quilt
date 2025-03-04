import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/supabase-provider";
import { getPatientsByCaregiver } from "@/services/patient";
import { markFinalStep } from "@/services/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Share, TouchableOpacity, View } from "react-native";

export default function CodeSharingScreen() {
	const router = useRouter();
	const [inviteCode, setInviteCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useSupabase();

	// Fetch the patient's invitation code when the component mounts
	useEffect(() => {
		async function fetchPatientCode() {
			if (!user) return;
			
			try {
				setIsLoading(true);
				// Get the patients associated with this caregiver
				const patients = await getPatientsByCaregiver(user.id);
				
				if (patients && patients.length > 0) {
					// Use the first patient's invitation code
					setInviteCode(patients[0].invitation_code);
				} else {
					setError("No patients found for this caregiver");
				}
			} catch (err) {
				console.error("Error fetching patient code:", err);
				setError("Failed to fetch invitation code");
			} finally {
				setIsLoading(false);
			}
		}

		fetchPatientCode();
	}, [user]);

	// Mark onboarding as complete when this screen is reached
	useEffect(() => {
		if (user) {
			// Update the onboarding status in the database
			markFinalStep(user.id)
				.then((success) => {
					if (success) {
						console.log("Onboarding marked as complete");
					} else {
						console.error("Failed to mark onboarding as complete");
					}
				})
				.catch((error) => {
					console.error("Error marking onboarding as complete:", error);
				});
		}
	}, [user]);

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Join my Quilt care circle with code: ${inviteCode}`,
			});
		} catch (error) {
			console.error("Error sharing code:", error);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-transparent">
			<View className="flex-1 px-4 py-4 justify-center items-center">
				<Text className="text-2xl font-semibold text-center mb-4">
					Your care recipient's Quilt is prepared!
				</Text>

				<View className="flex flex-col items-center gap-y-4">
					<Text className="text-md text-center text-muted-foreground">
						They'll need this code to join in their Quilt app
					</Text>

					<View className="w-full max-w-xs bg-muted p-6 rounded-xl mb-6 items-center">
						{isLoading ? (
							<ActivityIndicator size="large" color="#006B5B" />
						) : error ? (
							<Text className="text-destructive text-center">{error}</Text>
						) : (
							<View className="flex-row items-center justify-center">
								<Text className="text-3xl font-bold tracking-widest mb-4">
									{inviteCode}
								</Text>
							</View>
						)}
						
						{!isLoading && !error && (
							<TouchableOpacity
								onPress={handleShare}
								className="flex-row items-center bg-button px-4 py-2 rounded-full"
							>
								<Ionicons name="share-outline" size={20} color="white" />
								<Text className="text-white ml-2">Share Code</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<Text className="text-md text-center text-muted-foreground mb-8 max-w-xs">
					Share this code with your care recipient so they can connect to their
					Quilt
				</Text>
			</View>
		</SafeAreaView>
	);
}
