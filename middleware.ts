import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/skin-type/")) {
    const matchCategory = url.pathname.match(
      /^\/skin-type\/([^/]+)\/category\/([^/]+)\/?$/
    );

    if (matchCategory) {
      const [, skinType, category] = matchCategory;
      url.pathname = `/skin-type-category/${skinType}/${category}`;
      return NextResponse.redirect(url);
    }

    const matchSkinType = url.pathname.match(/^\/skin-type\/([^/]+)\/?$/);
    if (matchSkinType) {
      const [, skinType] = matchSkinType;
      url.pathname = "/";
      url.hash = `data-haul-${skinType}`;
      return NextResponse.redirect(url);
    }
  }

  // // Redirect HTTP to HTTPS
  // if (url.protocol === 'http:') {
  //   url.protocol = 'https:';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
