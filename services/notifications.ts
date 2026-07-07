import { getResendClient, EMAIL_FROM, SITE_URL } from "@/lib/resend";
import HomeworkReceivedEmail from "@/emails/homework-received";
import HomeworkCompletedEmail from "@/emails/homework-completed";
import StudentInvitedEmail from "@/emails/student-invited";

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
      "RESEND_API_KEY no configurada — correo de homework recibido no enviado."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `Nuevo homework: ${params.homeworkTitle}`,
      react: HomeworkReceivedEmail({
        studentName: params.studentName,
        homeworkTitle: params.homeworkTitle,
        dueDateLabel: params.dueDateLabel,
        portalUrl: `${SITE_URL}/student-portal`,
      }),
    });
  } catch (error) {
    console.error("Fallo al enviar correo de homework recibido:", error);
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
      "RESEND_API_KEY no configurada — correo de finalización no enviado."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `${params.studentName} completó: ${params.homeworkTitle}`,
      react: HomeworkCompletedEmail({
        teacherName: params.teacherName,
        studentName: params.studentName,
        homeworkTitle: params.homeworkTitle,
        dashboardUrl: `${SITE_URL}/dashboard`,
      }),
    });
  } catch (error) {
    console.error("Fallo al enviar correo de finalización:", error);
  }
}

// Enviado quando um professor cadastra um novo aluno — convida o aluno a
// ativar a própria conta em /register-student, usando o mesmo e-mail.
export async function sendStudentInvitedEmail(params: {
  to: string;
  studentName: string;
  teacherName: string;
}): Promise<void> {
  const resend = getResendClient();

  if (!resend) {
    console.warn(
      "RESEND_API_KEY no configurada — correo de invitación no enviado."
    );
    return;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: `${params.teacherName} te invitó a VocalFlow`,
      react: StudentInvitedEmail({
        studentName: params.studentName,
        teacherName: params.teacherName,
        activationUrl: `${SITE_URL}/register-student`,
      }),
    });
  } catch (error) {
    console.error("Fallo al enviar correo de invitación:", error);
  }
}
