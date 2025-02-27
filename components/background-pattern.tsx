import { Image } from "@/components/image";
import React from "react";
import { Dimensions, View } from "react-native";

interface BackgroundPatternProps {
	className?: string;
	width?: number;
	height?: number;
	opacity?: number;
}

export function BackgroundPattern({
	className = "",
	width = Dimensions.get("window").width,
	height = 400,
	opacity = 0.8,
}: BackgroundPatternProps) {
	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				right: 0,
				opacity,
				zIndex: 0,
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
			className={className}
		>
			<Image
				source={require("@/assets/blocks-pattern-logo.svg")}
				style={{
					width,
					height,
				}}
				contentFit="cover"
			/>
		</View>
	);
}
