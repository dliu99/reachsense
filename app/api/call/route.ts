import { NextResponse } from "next/server"
import { VapiClient } from "@vapi-ai/server-sdk"

const vapi = new VapiClient({
  token: process.env.VAPI_API_TOKEN as string,
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type CallRequestBody = {
  businessNumber?: string
  serviceDesc?: string
  timeWindow?: string
  name?: string
  email?: string
  callbackNumber?: string
  outgoingNumberId?: string
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json()

    // Always perform a Vapi call for the supplied fields

    const {
      businessNumber,
      serviceDesc,
      timeWindow,
      name,
      email,
      callbackNumber,
      outgoingNumberId,
    } = body as CallRequestBody
    const targetPhoneNumber = businessNumber ?? process.env.PHONE_NUMBER
    if (!targetPhoneNumber) {
      return NextResponse.json(
        { error: "Missing target phone number" },
        { status: 400 }
      )
    }

    if (!businessNumber && !process.env.PHONE_NUMBER) {
      return NextResponse.json(
        { error: "Missing required fields: businessNumber or PHONE_NUMBER env" },
        { status: 400 }
      )
    }

    if (!process.env.VAPI_API_TOKEN) {
      return NextResponse.json(
        { error: "Server missing VAPI credentials" },
        { status: 500 }
      )
    }

    const phoneNumberId =
      outgoingNumberId || process.env.VAPI_PHONE_NUMBER_ID

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: "No outgoing phone number configured" },
        { status: 400 }
      )
    }

    const assistantId = process.env.VAPI_ASSISTANT_ID
    if (!assistantId) {
      return NextResponse.json(
        { error: "No assistant configured" },
        { status: 400 }
      )
    }

    // Create the call and pass any useful variables to the assistant
    const call: any = await vapi.calls.create({
      assistantId,
      phoneNumberId,
      customer: { number: targetPhoneNumber },
      assistantOverrides: {
        variableValues: {
          serviceDesc,
          timeWindow,
          name,
          email,
          callbackNumber,
        },
      },
    })

    // Poll until call has ended or failed
    let finalStatus: any
    while (true) {
      finalStatus = await vapi.calls.get(call.id)
      if (["ended", "failed"].includes(finalStatus.status)) break
      await sleep(3000)
    }

    const summary = finalStatus.analysis?.summary
    const transcript = finalStatus.transcript

    return NextResponse.json(
      {
        success: true,
        callId: call.id,
        status: finalStatus.status,
        summary,
        transcript,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("API /call error:", err)
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    )
  }
}

