import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { fontFamily } from "@/app/theme/fonts";
import { Image } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z
	.object({
		fullName: z.string().min(1, "Please enter your full name."),
		email: z.string().email("Please enter a valid email address."),
		password: z
			.string()
			.min(8, "Please enter at least 8 characters.")
			.max(64, "Please enter fewer than 64 characters.")
			.regex(
				/^(?=.*[a-z])/,
				"Your password must have at least one lowercase letter.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Your password must have at least one uppercase letter.",
			)
			.regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Your password must have at least one special character.",
			),
		confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Your passwords do not match.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const router = useRouter();
	const { signUp } = useSupabase();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			// Sign up the user
			await signUp(data.email, data.password);

			// Reset form and navigate to success or dashboard
			form.reset();
			router.push("/sign-in");
		} catch (error: Error | any) {
			console.log(error.message);
			form.setError("root", {
				type: "manual",
				message: "An error occurred during sign up. Please try again.",
			});
		}
	}

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
					<H1 className="self-start">Caregiver Sign Up</H1>
				</View>

				<Form {...form}>
					<View className="gap-4 mb-6">
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormInput
									label="Full Name"
									placeholder="Full Name"
									autoCapitalize="words"
									autoCorrect={false}
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormInput
									label="Email"
									placeholder="Email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect={false}
									keyboardType="email-address"
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormInput
									label="Password"
									placeholder="Password"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									{...field}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormInput
									label="Confirm Password"
									placeholder="Confirm password"
									autoCapitalize="none"
									autoCorrect={false}
									secureTextEntry
									{...field}
								/>
							)}
						/>
					</View>
				</Form>

				{/* Error message */}
				{form.formState.errors.root && (
					<Text className="text-red-500 mb-4">
						{form.formState.errors.root.message}
					</Text>
				)}

				{/* Sign up button */}
				<Button
					size="lg"
					onPress={form.handleSubmit(onSubmit)}
					disabled={form.formState.isSubmitting}
					className="mb-4"
				>
					{form.formState.isSubmitting ? (
						<ActivityIndicator size="small" />
					) : (
						<Text>Sign Up</Text>
					)}
				</Button>

				{/* Sign in link */}
				<View className="flex-row justify-center mt-2">
					<Text className="text-[#002E1E]">Already have an account? </Text>
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
