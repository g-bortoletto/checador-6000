import { Group } from "@mantine/core";
import { useState } from "react";
import classes from "./Header.module.css";
import { ActionThemeToggle } from "./ThemeActionToggle";
import Logo from "./Logo";

const links = [
	{ link: "/about", label: "Features" },
	{ link: "/pricing", label: "Pricing" },
	{ link: "/learn", label: "Learn" },
	{ link: "/community", label: "Community" },
];

export function Header() {
	const [active, setActive] = useState(links[0].link);

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			data-active={active === link.link || undefined}
			onClick={(event) => {
				event.preventDefault();
				setActive(link.link);
			}}
		>
			{link.label}
		</a>
	));

	return (
		<header className={classes.header}>
			<Logo />
			<Group gap={5} visibleFrom="xs">
				{items}
			</Group>
			<ActionThemeToggle className={classes.themeToggle} />
		</header>
	);
}
