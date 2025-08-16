import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dealId } = body || {}
    const text = `Research Summary for Deal ${dealId ?? "unknown"}:\n- Company overview\n- Key stakeholders\n- Competitive landscape\n- Risks and opportunities`
    return NextResponse.json({ status: "completed", text })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}


