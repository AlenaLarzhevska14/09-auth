import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { setAuthCookies } from "../../_utils/authCookies";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken && !cookieStore.get("accessToken")?.value) {
      return new NextResponse(null, { status: 200 });
    }

    const apiRes = await api.get("auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = apiRes.headers["set-cookie"];
    setAuthCookies(cookieStore, setCookie);

    if (!apiRes.data) {
      return new NextResponse(null, { status: 200 });
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return new NextResponse(null, { status: 200 });
    }
    logErrorResponse({ message: (error as Error).message });
    return new NextResponse(null, { status: 200 });
  }
}
