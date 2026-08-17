import { AppShell, Group, MantineProvider, Text } from "@mantine/core";
import "@mantine/core/styles.css";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";
import { FileIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import { theme } from "./theme";

export default function App(props: Partial<DropzoneProps>) {
	return (
		<MantineProvider theme={theme}>
			<AppShell>
				<AppShell.Header>
					<Text size="xl">Checador 6000</Text>
				</AppShell.Header>
				<AppShell.Main>
					<Dropzone
						onDrop={(files) => console.log("accepted files", files)}
						onReject={(files) => console.log("rejected files", files)}
						maxSize={5 * 1024 ** 2}
						accept={["application/xml"]}
						{...props}
					>
						<Group
							justify="center"
							gap="xl"
							mih={220}
							style={{ pointerEvents: "none" }}
						>
							<Dropzone.Accept>
								<UploadSimpleIcon
									size={52}
									color="var(--mantine-color-blue-6)"
								/>
							</Dropzone.Accept>
							<Dropzone.Reject>
								<XIcon size={52} color="var(--mantine-color-red-6)" />
							</Dropzone.Reject>
							<Dropzone.Idle>
								<FileIcon size={52} color="var(--mantine-color-dimmed)" />
							</Dropzone.Idle>

							<div>
								<Text size="xl" inline>
									Drag images here or click to select files
								</Text>
								<Text size="sm" c="dimmed" inline mt={7}>
									Attach as many files as you like, each file should not exceed
									5mb
								</Text>
							</div>
						</Group>
					</Dropzone>
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}
