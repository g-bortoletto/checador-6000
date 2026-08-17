import {
	ActionIcon,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import cx from "clsx";
import classes from "./ThemeActionToggle.module.css";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

export interface ActionThemeToggleProps {
	className?: string;
}

export function ActionThemeToggle(props?: ActionThemeToggleProps) {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<ActionIcon
			className={props?.className}
			onClick={() =>
				setColorScheme(computedColorScheme === "light" ? "dark" : "light")
			}
			variant="default"
			size="xl"
			radius="md"
			aria-label="Toggle color scheme"
		>
			<SunIcon className={cx(classes.icon, classes.light)} stroke="1.5" />
			<MoonIcon className={cx(classes.icon, classes.dark)} stroke="1.5" />
		</ActionIcon>
	);
}
