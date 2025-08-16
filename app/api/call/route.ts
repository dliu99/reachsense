import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode = "start", subtype = "custom", callId } = body || {}

    if (mode === "complete") {
      return NextResponse.json({
        status: "completed",
        transcript:
          "Agent: Thanks for your time today.\nClient: Likewise.\nAgent: We'll follow up with the proposal.\nClient: Sounds good.",
      })
    }

    return NextResponse.json({ status: "in-progress", callId: callId ?? "call_" + Math.random().toString(36).slice(2, 8), subtype })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}


