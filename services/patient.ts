import { supabase } from "@/config/supabase";
import { updateOnboardingStatus } from "./profile";

/**
 * Basic patient information
 */
export interface PatientData {
	first_name: string;
	last_name: string;
	email: string;
	// phone: string;
}

/**
 * Patient record with additional fields
 */
export interface Patient extends PatientData {
	id: string;
	created_at: string;
	invitation_code: string;
	created_by: string;
}

/**
 * Generates a unique 6-character alphanumeric invitation code
 * @returns A unique code in uppercase
 */
function generateUniqueCode(): string {
	// Generate a 6-character alphanumeric code
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Creates a new patient record and links it to a caregiver
 * @param caregiverId The ID of the caregiver creating the patient
 * @param patientData The patient information
 * @returns The created patient record
 */
export async function createPatient(
	caregiverId: string,
	patientData: PatientData,
): Promise<Patient> {
	// Generate unique invitation code
	const invitationCode = generateUniqueCode();

	// Create patient record
	const { data, error } = await supabase
		.from("patients")
		.insert({
			name: `${patientData.first_name} ${patientData.last_name}`,
			email: patientData.email,
			invitation_code: invitationCode,
			created_by: caregiverId,
		})
		.select()
		.single();

	if (error) throw error;

	// Create caregiver-patient relationship
	const { error: relationshipError } = await supabase
		.from("caregiver_patient")
		.insert({
			caregiver_id: caregiverId,
			patient_id: data.id,
			relationship_type: "primary",
		});

	if (relationshipError) {
		// If relationship creation fails, attempt to delete the patient record
		await supabase.from("patients").delete().eq("id", data.id);
		throw relationshipError;
	}

	// Update caregiver's onboarding status
	await updateOnboardingStatus(caregiverId, { patient_connected: true });

	return data as Patient;
}

/**
 * Retrieves patients associated with a caregiver
 * @param caregiverId The ID of the caregiver
 * @returns Array of patient records
 */
export async function getPatientsByCaregiver(
	caregiverId: string,
): Promise<Patient[]> {
	const { data, error } = await supabase
		.from("caregiver_patient")
		.select(
			`
      patient_id,
      patients:patient_id (*)
    `,
		)
		.eq("caregiver_id", caregiverId);

	if (error) throw error;

	// Extract the patient data from the joined query
	return data.map((item) => item.patients) as Patient[];
}

/**
 * Retrieves a patient by their invitation code
 * @param invitationCode The unique invitation code
 * @returns The patient record or null if not found
 */
export async function getPatientByInvitationCode(
	invitationCode: string,
): Promise<Patient | null> {
	const { data, error } = await supabase
		.from("patients")
		.select("*")
		.eq("invitation_code", invitationCode)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// No rows returned - invalid code
			return null;
		}
		throw error;
	}

	return data as Patient;
}
