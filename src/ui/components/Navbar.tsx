import {
	BellRingingIcon,
	DatabaseIcon,
	FingerprintIcon,
	GearIcon,
	KeyholeIcon,
	KeyIcon,
	ReceiptIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import classes from "./Navbar.module.css";

const data = [
	{ link: "", label: "Notifications", icon: BellRingingIcon },
	{ link: "", label: "Billing", icon: ReceiptIcon },
	{ link: "", label: "Security", icon: FingerprintIcon },
	{ link: "", label: "SSH Keys", icon: KeyIcon },
	{ link: "", label: "Databases", icon: DatabaseIcon },
	{ link: "", label: "Authentication", icon: KeyholeIcon },
	{ link: "", label: "Other Settings", icon: GearIcon },
];

export function Navbar() {
	const [active, setActive] = useState("Billing");

	const links = data.map((item) => (
		<a
			className={classes.link}
			data-active={item.label === active || undefined}
			href={item.link}
			key={item.label}
			onClick={(event) => {
				event.preventDefault();
				setActive(item.label);
			}}
		>
			<item.icon className={classes.linkIcon} stroke="1.5" />
			<span>{item.label}</span>
		</a>
	));

	return (
		<nav className={classes.navbar}>
			<div className={classes.navbarMain}>{links}</div>
		</nav>
	);
}
