import { Session, User } from "@supabase/supabase-js";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/config/supabase";
import { CaregiverOnboardingStatus } from "@/services/profile";

SplashScreen.preventAutoHideAsync();

// Extend the User type to include onboarding_status
export interface QuiltUser extends User {
	onboarding_status: CaregiverOnboardingStatus | null;
}

type SupabaseContextProps = {
	user: QuiltUser | null;
	session: Session | null;
	initialized?: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	signUp: async () => {},
	signInWithPassword: async () => {},
	signOut: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [user, setUser] = useState<QuiltUser | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			throw error;
		}
		// Profile will be automatically created by the database trigger
	};

	const signInWithPassword = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	};

	// Function to fetch user profile with onboarding status
	const fetchUserWithProfile = async (
		userId: string,
	): Promise<QuiltUser | null> => {
		if (!userId) return null;

		try {
			// Get the base user from auth
			const { data: authUser, error: authError } =
				await supabase.auth.getUser();

			if (authError || !authUser.user) {
				console.error("Error fetching auth user:", authError);
				return null;
			}

			// Get the profile with onboarding status
			// Profile should exist due to the database trigger
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("onboarding_status")
				.eq("id", userId)
				.single();

			if (profileError) {
				console.error("Error fetching profile:", profileError);
				return authUser.user as QuiltUser;
			}

			// Combine the auth user with the profile data
			return {
				...authUser.user,
				onboarding_status:
					profile.onboarding_status as CaregiverOnboardingStatus,
			} as QuiltUser;
		} catch (error) {
			console.error("Error in fetchUserWithProfile:", error);
			return null;
		}
	};

	// Function to check onboarding status and route accordingly
	const checkOnboardingStatusAndRoute = async (userId: string) => {
		try {
			const { data: profile, error } = await supabase
				.from("profiles")
				.select("onboarding_status")
				.eq("id", userId)
				.single();

			if (error) throw error;

			const onboardingStatus =
				profile?.onboarding_status as CaregiverOnboardingStatus;

			// Update the user with onboarding status
			if (user) {
				setUser({
					...user,
					onboarding_status: onboardingStatus,
				} as QuiltUser);
			}

			if (!onboardingStatus?.onboarding_complete) {
				// If onboarding is not complete, stay in onboarding flow
				// router.replace('/(app)/(protected)');
			} else {
				// If fully onboarded, go to main app
				router.replace("/(app)/(protected)");
			}
		} catch (error) {
			console.error("Error checking onboarding status:", error);
			// On error, default to beginning of onboarding
			router.replace("/(app)/welcome");
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			setSession(session);

			if (session?.user) {
				// Fetch user with profile data
				const userWithProfile = await fetchUserWithProfile(session.user.id);
				setUser(userWithProfile);
			} else {
				setUser(null);
			}

			setInitialized(true);
		});

		supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);

			if (session?.user) {
				// Fetch user with profile data
				const userWithProfile = await fetchUserWithProfile(session.user.id);
				setUser(userWithProfile);

				// Check onboarding status and route accordingly
				checkOnboardingStatusAndRoute(session.user.id);
			} else {
				setUser(null);
			}
		});
	}, []);

	useEffect(() => {
		if (!initialized) return;

		const inProtectedGroup = segments[1] === "(protected)";

		if (!session) {
			router.replace("/(app)/welcome");
		}

		/* HACK: Something must be rendered when determining the initial auth state... 
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 500);
	}, [initialized, session]);

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				signOut,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
