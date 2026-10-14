import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Memperbarui token sesi Supabase dan memproteksi rute privat /admin
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Proteksi Header No-Index untuk semua rute /admin
  if (pathname.startsWith("/admin")) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Ambil user yang sedang aktif
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

  // Jika pengunjung belum login dan mencoba masuk ke rute /admin selain /admin/login
  if (isAdminRoute && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Jika user sudah login dan berada di halaman /admin/login, alihkan ke dashboard admin
  if (isLoginPage && user) {
    const redirectUrl = new URL("/admin", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
