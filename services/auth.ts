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
		// First, create the auth user with email and password
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: accountInfo.email,
			password: accountInfo.password,
			options: {
				data: {
					first_name: caregiverInfo.firstName,
					last_name: caregiverInfo.lastName,
					phone: accountInfo.phone,
					relationship: caregiverInfo.relationship,
					user_type: "caregiver",
				},
			},
		});

		if (authError) {
			throw authError;
		}

		// The profile will be automatically created by the database trigger
		// with the default onboarding status

		// Return the user data
		return authData.user;
	} catch (error) {
		console.error("Error registering caregiver:", error);
		throw error;
	}
}
