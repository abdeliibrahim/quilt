import { supabase } from "@/config/supabase";

/**
 * Represents the onboarding status of a caregiver user
 */
export type CaregiverOnboardingStatus = {
    account_created: boolean;
    patient_connected: boolean;
    final_step: boolean;
    onboarding_complete: boolean;
}

/**
 * Gets the onboarding status for a user
 * @param userId The ID of the user to get the status for
 * @returns The onboarding status or null if not found
 */
export async function getOnboardingStatus(
    userId: string
): Promise<CaregiverOnboardingStatus | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('onboarding_status')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching onboarding status:', error);
            return null;
        }

        return data?.onboarding_status as CaregiverOnboardingStatus || null;
    } catch (error) {
        console.error('Error in getOnboardingStatus:', error);
        return null;
    }
}

/**
 * This function is now primarily used for manual profile creation
 * when not using the auth.signUp flow, as triggers will handle
 * automatic profile creation during normal signup.
 * 
 * @deprecated Profiles are now automatically created by database triggers.
 * Use updateProfile instead for existing profiles.
 */
export async function createProfile(
    userId: string,
    email: string,
    fullName: string,
) {
    // Check if profile already exists (should be created by trigger)
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

    if (existingProfile) {
        // Profile already exists, update it instead
        return updateProfile(userId, { full_name: fullName });
    }

    // Create new profile if it doesn't exist (fallback)
    console.warn('Creating profile manually - this should be handled by triggers');
    const { error } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            email,
            full_name: fullName,
            onboarding_status: { account_created: true },
        });

    if (error) {
        throw error;
    }
}

/**
 * Updates a user's profile information
 */
export async function updateProfile(
    userId: string,
    updates: { [key: string]: any }
): Promise<boolean> {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    return !error;
}

/**
 * Updates the onboarding status for a user
 * @param userId The ID of the user to update
 * @param updates The partial onboarding status to merge with existing status
 * @returns A boolean indicating if the update was successful
 */
export async function updateOnboardingStatus(
    userId: string,
    updates: Partial<CaregiverOnboardingStatus>
): Promise<boolean> {
    // First get the current status
    const { data: current } = await supabase
        .from('profiles')
        .select('onboarding_status')
        .eq('id', userId)
        .single();

    // Merge existing status with updates
    const updatedStatus = {
        ...updates
    };

    // Update the profile with the new status
    const { error } = await supabase
        .from('profiles')
        .update({ onboarding_status: updatedStatus })
        .eq('id', userId);

    return !error;
}

/**
 * Marks the account creation step as complete
 * @param userId The ID of the user to update
 * @returns A boolean indicating if the update was successful
 */
export async function markAccountCreated(userId: string): Promise<boolean> {
    return updateOnboardingStatus(userId, { account_created: true });
}

/**
 * Marks the patient connection step as complete
 * @param userId The ID of the user to update
 * @returns A boolean indicating if the update was successful
 */
export async function markPatientConnected(userId: string): Promise<boolean> {
    return updateOnboardingStatus(userId, { patient_connected: true });
}

/**
 * Marks the interface selection step as complete
 * @param userId The ID of the user to update
 * @returns A boolean indicating if the update was successful
 */
export async function markFinalStep(userId: string): Promise<boolean> {
    return updateOnboardingStatus(userId, { final_step: true });
}
/**
 * Marks the onboarding process as complete
 * @param userId The ID of the user to update
 * @returns A boolean indicating if the update was successful
 */
export async function markOnboardingComplete(userId: string): Promise<boolean> {
    return updateOnboardingStatus(userId, {
        onboarding_complete: true
    });
    
} 