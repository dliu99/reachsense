import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return NextResponse.json({ status: "completed", url: "/report.pdf" })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}


