export const dynamic = 'force-dynamic'
export const runtime = 'edge'
export const preferredRegion = 'auto'

export async function GET() {
  return Response.json({ dynamic: true })
} 