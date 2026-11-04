export async function GET() {
  return new Response('google-site-verification: google17acf709bf29d8aa.html\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
