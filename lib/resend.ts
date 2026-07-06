import { Resend } from "resend";

// Instanciado sob demanda (não no topo do módulo) para que a ausência da
// env var não quebre o build nem o boot da aplicação — só o envio de
// e-mails fica desativado, com um aviso no log.
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

// "onboarding@resend.dev" é o domínio de teste do próprio Resend — funciona
// sem verificação de domínio, mas só envia para o e-mail da conta Resend
// usada. Configure RESEND_FROM_EMAIL com um domínio verificado antes de ir
// para produção de fato.
export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL ?? "VocalFlow <onboarding@resend.dev>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
