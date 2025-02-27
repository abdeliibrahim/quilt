import React from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { fonts } from "../theme";

interface CustomTextProps extends TextProps {
	variant?: "regular" | "light" | "medium" | "semibold" | "bold";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
}

export function Text({
	children,
	variant = "regular",
	size = "md",
	style,
	...props
}: CustomTextProps) {
	return (
		<RNText
			style={[
				styles.text,
				{
					fontFamily: fonts.fontFamily[variant],
					fontSize: fonts.fontSize[size],
				},
				style,
			]}
			{...props}
		>
			{children}
		</RNText>
	);
}

const styles = StyleSheet.create({
	text: {
		color: "#000",
	},
});

export default Text;
