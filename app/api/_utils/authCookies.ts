type CookieOptions = {
  expires?: Date;
  path?: string;
  maxAge?: number;
};

type CookieStore = {
  set: (name: string, value: string, options?: CookieOptions) => void;
};

type ParsedSetCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

function parseSetCookie(cookieStr: string): ParsedSetCookie | null {
  const [cookiePair, ...attributes] = cookieStr.split(";").map((part) => part.trim());
  const separatorIndex = cookiePair.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const options: CookieOptions = {};

  for (const attribute of attributes) {
    const attributeSeparatorIndex = attribute.indexOf("=");

    if (attributeSeparatorIndex === -1) {
      continue;
    }

    const key = attribute.slice(0, attributeSeparatorIndex).toLowerCase();
    const value = attribute.slice(attributeSeparatorIndex + 1);

    if (key === "path") {
      options.path = value;
    }

    if (key === "max-age") {
      const maxAge = Number(value);
      if (Number.isFinite(maxAge)) {
        options.maxAge = maxAge;
      }
    }

    if (key === "expires") {
      const expires = new Date(value);
      if (!Number.isNaN(expires.getTime())) {
        options.expires = expires;
      }
    }
  }

  return {
    name: cookiePair.slice(0, separatorIndex),
    value: cookiePair.slice(separatorIndex + 1),
    options,
  };
}

export function setAuthCookies(
  cookieStore: CookieStore,
  setCookie: string | string[] | undefined
): boolean {
  if (!setCookie) {
    return false;
  }

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  let hasAuthCookie = false;

  for (const cookieStr of cookieArray) {
    const parsed = parseSetCookie(cookieStr);

    if (!parsed) {
      continue;
    }

    if (parsed.name === "accessToken" || parsed.name === "refreshToken") {
      cookieStore.set(parsed.name, parsed.value, parsed.options);
      hasAuthCookie = true;
    }
  }

  return hasAuthCookie;
}
