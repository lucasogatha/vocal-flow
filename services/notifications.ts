import { getResendClient, EMAIL_FROM, SITE_URL } from "@/lib/resend";
import HomeworkReceivedEmail from "@/emails/homework-received";
import HomeworkCompletedEmail from "@/emails/homework-completed";

// Todas as funções deste arquivo NUNCA lançam erro para quem as chama —
// falha de e-mail (chave ausente, Resend fora do ar, etc.) não pode
// quebrar o cadastro de aluno, o envio de homework ou a conclusão de um
// treino. O máximo que acontece é um log de erro.

export async function sendHomeworkReceivedEmail(params: {
  to: string;
  studentName: string;
  homeworkTitle: string;
  dueDateLabel: string;
}): Promise<void> {
  const resend = getResendClient();

  if (!resend) {
    console.warn(
      "RESEND_API_KEY não configurada — e-mail de homework recebido não enviado."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Novo homework: ${params.homeworkTitle}`,
      react: HomeworkReceivedEmail({
        studentName: params.studentName,
        homeworkTitle: params.homeworkTitle,
        dueDateLabel: params.dueDateLabel,
        portalUrl: `${SITE_URL}/student-portal`,
      }),
    });
  } catch (error) {
    console.error("Falha ao enviar e-mail de homework recebido:", error);
  }
}

export async function sendHomeworkCompletedEmail(params: {
  to: string;
  teacherName: string;
  studentName: string;
  homeworkTitle: string;
}): Promise<void> {
  const resend = getResendClient();

  if (!resend) {
    console.warn(
      "RESEND_API_KEY não configurada — e-mail de conclusão não enviado."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `${params.studentName} concluiu: ${params.homeworkTitle}`,
      react: HomeworkCompletedEmail({
        teacherName: params.teacherName,
        studentName: params.studentName,
        homeworkTitle: params.homeworkTitle,
        dashboardUrl: `${SITE_URL}/dashboard`,
      }),
    });
  } catch (error) {
    console.error("Falha ao enviar e-mail de conclusão:", error);
  }
}
