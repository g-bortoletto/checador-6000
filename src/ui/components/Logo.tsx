import { Image } from "@mantine/core";

interface LogoProps {
	size?: number;
	fit?: React.CSSProperties["objectFit"];
	className?: string;
}

export default function Logo(props?: LogoProps) {
	return (
		<Image
			src="icon.svg"
			w={props?.size ?? 32}
			h={props?.size ?? 32}
			fit={props?.fit ?? "contain"}
			className={props?.className}
		/>
	);
}
