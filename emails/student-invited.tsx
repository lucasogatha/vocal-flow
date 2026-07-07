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

type StudentInvitedEmailProps = {
  studentName: string;
  teacherName: string;
  activationUrl: string;
};

export default function StudentInvitedEmail({
  studentName = "Alumno",
  teacherName = "Tu profesor",
  activationUrl = "https://app.vocalflow.com/register-student",
}: StudentInvitedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{teacherName} te invitó a VocalFlow</Preview>
      <Tailwind
        config={{ theme: { extend: { colors: { accent: "#5E6AD2" } } } }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-xl bg-white p-8">
            <Text className="m-0 text-sm font-semibold text-accent">
              VocalFlow
            </Text>
            <Heading className="mt-3 text-xl font-semibold text-gray-900">
              ¡Bienvenido a VocalFlow, {studentName}!
            </Heading>

            <Text className="text-sm text-gray-600">
              Tu profesor, <strong>{teacherName}</strong>, te registró en
              VocalFlow para dar seguimiento a tus entrenamientos vocales
              entre una clase y otra.
            </Text>

            <Section className="my-4 rounded-lg bg-gray-50 p-4">
              <Text className="m-0 text-sm text-gray-700">
                Para activar tu cuenta, crea una contraseña usando este
                mismo correo electrónico. Después de eso, ya podrás ver los
                homeworks que tu profesor te envíe.
              </Text>
            </Section>

            <Button
              href={activationUrl}
              className="rounded-md bg-accent px-5 py-3 text-center text-sm font-medium text-white"
            >
              Activar mi cuenta
            </Button>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Recibiste este correo porque tu profesor te registró en
              VocalFlow.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
