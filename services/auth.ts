import { supabase } from "@/config/supabase";

export interface CaregiverInfo {
	firstName: string;
	lastName: string;
	relationship: string;
}

export interface AccountInfo {
	email: string;
	phone: string;
	password: string;
}

/**
 * Register a new caregiver with Supabase
 * @param caregiverInfo Basic information about the caregiver
 * @param accountInfo Account credentials
 * @returns The user object if successful
 */
export async function registerCaregiver(
	caregiverInfo: CaregiverInfo,
	accountInfo: AccountInfo,
) {
	try {
		// Validate input data
		if (!caregiverInfo.firstName || !caregiverInfo.lastName || !caregiverInfo.relationship) {
			throw new Error("Missing required caregiver information");
		}

		if (!accountInfo.email || !accountInfo.password) {
			throw new Error("Missing required account information");
		}

		// Format the metadata properly
		const metadata = {
			first_name: caregiverInfo.firstName.trim(),
			last_name: caregiverInfo.lastName.trim(),
			phone: accountInfo.phone.trim(),
			relationship: caregiverInfo.relationship.trim(),
			user_type: "caregiver",
		};

		console.log("Registering caregiver with metadata:", JSON.stringify(metadata, null, 2));

		// First, create the auth user with email and password
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: accountInfo.email.trim(),
			password: accountInfo.password,
			options: {
				data: metadata,
			},
		});

		if (authError) {
			console.error("Auth error during registration:", authError);
			throw authError;
		}

		if (!authData.user) {
			throw new Error("User creation failed - no user returned");
		}

		console.log("User created successfully with ID:", authData.user.id);

		// The profile will be automatically created by the database trigger
		// with the default onboarding status

		// Return the user data
		return authData.user;
	} catch (error) {
		console.error("Error registering caregiver:", error);
		throw error;
	}
}
