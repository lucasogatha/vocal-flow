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

type HomeworkCompletedEmailProps = {
  teacherName: string;
  studentName: string;
  homeworkTitle: string;
  dashboardUrl: string;
};

export default function HomeworkCompletedEmail({
  teacherName = "Profesor",
  studentName = "Alumno",
  homeworkTitle = "Entrenamiento",
  dashboardUrl = "https://app.vocalflow.com/dashboard",
}: HomeworkCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {studentName} completó: {homeworkTitle}
      </Preview>
      <Tailwind
        config={{ theme: { extend: { colors: { accent: "#5E6AD2" } } } }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-xl bg-white p-8">
            <Text className="m-0 text-sm font-semibold text-accent">
              VocalFlow
            </Text>
            <Heading className="mt-3 text-xl font-semibold text-gray-900">
              ¡{studentName} completó un homework!
            </Heading>

            <Section className="my-4 rounded-lg bg-green-50 p-4">
              <Text className="m-0 font-medium text-gray-900">
                {homeworkTitle}
              </Text>
              <Text className="m-0 mt-1 text-sm font-medium text-green-700">
                ✓ Completado
              </Text>
            </Section>

            <Text className="text-sm text-gray-600">
              Hola {teacherName}, tu alumno acaba de terminar ese
              entrenamiento. Da seguimiento al progreso completo en tu panel.
            </Text>

            <Button
              href={dashboardUrl}
              className="rounded-md bg-accent px-5 py-3 text-center text-sm font-medium text-white"
            >
              Ver en el Dashboard
            </Button>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Recibiste este correo porque eres profesor en VocalFlow.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
