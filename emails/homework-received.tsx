import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type HomeworkReceivedEmailProps = {
  studentName: string;
  homeworkTitle: string;
  dueDateLabel: string;
  portalUrl: string;
};

export default function HomeworkReceivedEmail({
  studentName = "Alumno",
  homeworkTitle = "Nuevo entrenamiento",
  dueDateLabel = "Sin plazo definido",
  portalUrl = "https://app.vocalflow.com/student-portal",
}: HomeworkReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Recibiste un nuevo homework: {homeworkTitle}</Preview>
      <Tailwind
        config={{ theme: { extend: { colors: { accent: "#5E6AD2" } } } }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-xl bg-white p-8">
            <Text className="m-0 text-sm font-semibold text-accent">
              VocalFlow
            </Text>
            <Heading className="mt-3 text-xl font-semibold text-gray-900">
              ¡Nuevo homework para ti, {studentName}!
            </Heading>
            <Text className="text-sm text-gray-600">
              Tu profesor acaba de enviarte un nuevo entrenamiento:
            </Text>

            <Section className="my-4 rounded-lg bg-gray-50 p-4">
              <Text className="m-0 font-medium text-gray-900">
                {homeworkTitle}
              </Text>
              <Text className="m-0 mt-1 text-sm text-gray-500">
                Plazo: {dueDateLabel}
              </Text>
            </Section>

            <Button
              href={portalUrl}
              className="rounded-md bg-accent px-5 py-3 text-center text-sm font-medium text-white"
            >
              Abrir en VocalFlow
            </Button>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Recibiste este correo porque tu profesor usa VocalFlow para
              dar seguimiento a tus entrenamientos vocales.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
