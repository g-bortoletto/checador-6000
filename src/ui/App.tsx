import {
	Alert,
	Box,
	Button,
	Card,
	Center,
	Container,
	Group,
	MantineProvider,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Dropzone, type FileRejection } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";
import {
	CheckCircleIcon,
	FileIcon,
	UploadSimpleIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { validateDloXml } from "../core/ValidationPipeline";
import { type ValidationResult } from "../core/ValidationResultTypes";
import { theme } from "./theme";
import Logo from "./components/Logo";

export default function App() {
	const [file, setFile] = useState<File | null>(null);
	const [result, setResult] = useState<ValidationResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [validating, setValidating] = useState(false);

	function selectFile(acceptedFiles: File[]) {
		setFile(acceptedFiles[0]);
		setResult(null);
		setError(null);
	}

	function rejectFile(rejections: FileRejection[]) {
		setFile(null);
		setResult(null);
		setError(rejections[0]?.errors[0]?.message ?? "Selecione um arquivo XML.");
	}

	async function validate() {
		if (!file) return;

		setValidating(true);
		setError(null);
		try {
			setResult(await validateDloXml(file));
		} catch (validationError) {
			setResult(null);
			setError(
				validationError instanceof Error
					? validationError.message
					: "Nao foi possivel validar o arquivo.",
			);
		} finally {
			setValidating(false);
		}
	}

	return (
		<MantineProvider theme={theme}>
			<Box py={{ base: 48, sm: 88 }}>
				<Container size="sm">
					<Stack gap="xl">
						<Stack gap="xs">
							<Center>
								<Logo size={50} />
							</Center>
							<Center>
								<Title order={1}>Checador 6000</Title>
							</Center>
							<Text c="dimmed">
								Valide a estrutura e o cabecalho de arquivos DLO 2061. O processamento
								 e feito localmente no seu navegador.
							</Text>
						</Stack>

						<Dropzone
							onDrop={selectFile}
							onReject={rejectFile}
							accept={{ "application/xml": [".xml"], "text/xml": [".xml"] }}
							maxFiles={1}
						>
							<Group
								justify="center"
								gap="xl"
								mih={180}
								style={{ pointerEvents: "none" }}
							>
								<Dropzone.Accept>
									<CheckCircleIcon size={48} />
								</Dropzone.Accept>
								<Dropzone.Reject>
									<WarningCircleIcon size={48} />
								</Dropzone.Reject>
								<Dropzone.Idle>
									<UploadSimpleIcon size={48} />
								</Dropzone.Idle>
								<Stack gap={4} align="center">
									<Text size="lg" fw={500}>
										Arraste um XML ou clique para selecionar
									</Text>
									<Text size="sm" c="dimmed">
										Apenas um arquivo .xml
									</Text>
								</Stack>
							</Group>
						</Dropzone>

						{file && (
							<Card withBorder padding="md">
								<Group justify="space-between">
									<Group gap="sm">
										<FileIcon size={24} />
										<Text fw={500}>{file.name}</Text>
									</Group>
									<Button onClick={validate} loading={validating}>
										Validar
									</Button>
								</Group>
							</Card>
						)}

						{error && (
							<Alert
								color="var(--mantine-color-error)"
								title="Falha ao validar"
							>
								{error}
							</Alert>
						)}

						{result && (
							<Stack gap="md">
								<Alert
									color={result.valid ? "var(--mantine-color-success)" : "var(--mantine-color-error)"}
									title={result.valid ? "Documento aceito na validacao local" : "Documento rejeitado"}
									icon={result.valid ? <CheckCircleIcon /> : <WarningCircleIcon />}
								>
									{result.valid ? "Nenhuma rejeicao de entrada foi encontrada." : "Corrija as rejeicoes de entrada antes de submeter o documento."}
								</Alert>
								<SimpleGrid cols={{ base: 1, sm: 3 }}>
									<Card withBorder padding="sm"><Text size="xs" c="dimmed">Rejeicoes</Text><Text fw={700} size="xl">{result.summary.rejected}</Text></Card>
									<Card withBorder padding="sm"><Text size="xs" c="dimmed">Indicios</Text><Text fw={700} size="xl">{result.summary.indications}</Text></Card>
									<Card withBorder padding="sm"><Text size="xs" c="dimmed">Regras indisponiveis</Text><Text fw={700} size="xl">{result.summary.skipped}</Text></Card>
								</SimpleGrid>
								{result.issues.map((issue, index) => (
									<Alert key={`${issue.id}-${issue.xpath ?? ""}-${index}`} color={issue.outcome === "skipped" ? "yellow" : "red"} title={`${issue.id}${issue.elim ? ` / ${issue.elim}` : ""}`}>
										<Text>{issue.message}</Text>
										<Text size="xs" c="dimmed">{issue.outcome === "skipped" ? "Cobertura indisponivel" : "Rejeicao"}{issue.line ? ` | Linha ${issue.line}` : ""}{issue.xpath ? ` | ${issue.xpath}` : ""}{issue.missingDependencies?.length ? ` | Dependencia: ${issue.missingDependencies.join(", ")}` : ""}</Text>
									</Alert>
								))}
							</Stack>
						)}
					</Stack>
				</Container>
			</Box>
		</MantineProvider>
	);
}
