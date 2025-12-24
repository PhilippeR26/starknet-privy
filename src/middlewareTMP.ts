

import { NextRequest, NextResponse } from 'next/server';
import { getPrivyClientServer } from './app/server/privyClient';

export async function middleware(req: NextRequest) {
  try {
    const header = (req.headers.get("authorization") as string) || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    console.log("middleware- jwt=", token);
    if (!token) return NextResponse.next();
    try {
      const privy = getPrivyClientServer();
      const claims = await privy.verifyAuthToken(token);
    console.log("middleware- token validated=", claims);
      const res = NextResponse.next();
      res.headers.set('auth', JSON.stringify({ ...claims, token }));
      res.headers.set("tmp","test");
      return res;
    } catch {
      // non-fatal
    }
    return NextResponse.next();
  } catch (e: any) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/'],  // Apply middleware only to /dashboard routes
};
