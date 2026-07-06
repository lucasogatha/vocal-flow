import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const TEACHER_ROUTES = ["/dashboard", "/students", "/lessons", "/exercises", "/homeworks", "/pricing"];
const STUDENT_ROUTES = ["/student-portal"];
const ADMIN_ROUTES = ["/admin"];
// Rotas do professor que exigem assinatura ativa. "/pricing" fica de fora
// de propósito: é para lá que redirecionamos quem está bloqueado, então
// incluí-la geraria um loop de redirecionamento.
const SUBSCRIPTION_GATED_ROUTES = ["/dashboard", "/students", "/lessons", "/exercises", "/homeworks"];

// Protege as rotas autenticadas, evita que um usuário logado acesse as
// telas de login/registro de novo, e garante que professor e aluno cada
// um fique restrito à sua própria área.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/register-student";

  const isTeacherRoute = TEACHER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isStudentRoute = STUDENT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = isTeacherRoute || isStudentRoute || isAdminRoute;

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    const role = user.user_metadata?.role;
    const homePath = role === "student" ? "/student-portal" : "/dashboard";

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    if (role === "student" && isTeacherRoute) {
      return NextResponse.redirect(new URL("/student-portal", request.url));
    }

    if (role !== "student" && isStudentRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Admin: checagem via banco (profiles.is_admin), nunca via
    // user_metadata — esse campo é editável pelo próprio usuário e não
    // pode decidir quem vê dados de todo mundo.
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL(homePath, request.url));
      }
    }

    // Assinatura: só bloqueia se EXISTIR uma assinatura com status
    // explicitamente não-ativo (cancelada, atrasada, incompleta). Se ainda
    // não existir nenhuma assinatura (professor recém-cadastrado, antes do
    // layout criar a Starter automaticamente), deixa passar — não há o
    // que bloquear ainda, e bloquear aqui criaria uma corrida com a
    // criação automática.
    const isSubscriptionGatedRoute = SUBSCRIPTION_GATED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (role !== "student" && isSubscriptionGatedRoute) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("teacher_id", user.id)
        .maybeSingle();

      if (subscription && subscription.status !== "active") {
        return NextResponse.redirect(new URL("/pricing", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/register-student",
    "/dashboard/:path*",
    "/students/:path*",
    "/lessons/:path*",
    "/exercises/:path*",
    "/homeworks/:path*",
    "/pricing/:path*",
    "/admin/:path*",
    "/student-portal/:path*",
  ],
};
