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
  studentName = "Aluno",
  homeworkTitle = "Novo treino",
  dueDateLabel = "Sem prazo definido",
  portalUrl = "https://app.vocalflow.com.br/student-portal",
}: HomeworkReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Você recebeu um novo homework: {homeworkTitle}</Preview>
      <Tailwind
        config={{ theme: { extend: { colors: { accent: "#5E6AD2" } } } }}
      >
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-xl bg-white p-8">
            <Text className="m-0 text-sm font-semibold text-accent">
              VocalFlow
            </Text>
            <Heading className="mt-3 text-xl font-semibold text-gray-900">
              Novo homework para você, {studentName}!
            </Heading>
            <Text className="text-sm text-gray-600">
              Seu professor acabou de te enviar um novo treino:
            </Text>

            <Section className="my-4 rounded-lg bg-gray-50 p-4">
              <Text className="m-0 font-medium text-gray-900">
                {homeworkTitle}
              </Text>
              <Text className="m-0 mt-1 text-sm text-gray-500">
                Prazo: {dueDateLabel}
              </Text>
            </Section>

            <Button
              href={portalUrl}
              className="rounded-md bg-accent px-5 py-3 text-center text-sm font-medium text-white"
            >
              Abrir no VocalFlow
            </Button>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              Você recebeu este e-mail porque seu professor usa o VocalFlow
              para acompanhar seus treinos vocais.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
