import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      mode = "draft",
      subtype = "custom",
      dealId,
      subject,
      body: content,
      notes,
      clientName,
      company,
      dealTitle,
      lastContact,
    } = body || {}

    if (mode === "send") {
      // Pretend to send the email
      return NextResponse.json({ status: "sent", dealId, subtype, subject, body: content })
    }

    const subjectBase =
      subtype === "schedule"
        ? "Scheduling an appointment"
        : subtype === "followup"
        ? "Following up on our conversation"
        : "Regarding your inquiry"

    // If an API key is present, use Gemini to generate a subject/body; otherwise fall back
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        // Dynamically import to avoid type errors when pkg isn't installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { GoogleGenAI, Type } = require("@google/genai")
        const ai = new GoogleGenAI({ apiKey })
        const config = {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["subject", "contents"],
            properties: {
              subject: { type: Type.STRING },
              contents: { type: Type.STRING },
            },
          },
        } as const
        const model = "gemini-2.5-flash-lite"
        const promptNotes = notes ?? "No additional notes provided."
        const contextLines = [
          clientName ? `Client name: ${clientName}` : null,
          company ? `Company: ${company}` : null,
          dealTitle ? `Deal title: ${dealTitle}` : null,
          lastContact ? `Last contact date: ${lastContact}` : null,
          `Subtype: ${subtype}`,
          `Deal ID: ${dealId ?? "n/a"}`,
        ].filter(Boolean).join("\n")
        const contents = [
          {
            role: "user",
            parts: [
              {
                text: `You are Ayush Rane from ReachSense. Compose a concise, professional ${subtype} email. Use the context below and the notes. Return JSON {\"subject\", \"contents\"} only.\n\nContext:\n${contextLines}\n\nNotes:\n${promptNotes}`,
              },
            ],
          },
        ]

        let textOutput = ""
        let response: any
        try {
          response = await (ai as any).models.generateContent({ model, config, contents })
        } catch (err) {
          return NextResponse.json({ error: "Gemini API call failed", details: err instanceof Error ? err.message : String(err) }, { status: 500 })
        }
        if (response?.text) {
          textOutput = typeof response.text === "function" ? await response.text() : response.text
        } else if (response?.output_text) {
          textOutput = response.output_text
        }
        if (!textOutput) {
          return NextResponse.json({ error: "Gemini response missing text output", details: response }, { status: 500 })
        }
        let parsed
        try {
          parsed = JSON.parse(textOutput)
        } catch (err) {
          return NextResponse.json({ error: "Failed to parse Gemini response as JSON", details: textOutput }, { status: 500 })
        }
        const generatedSubject = subject ?? parsed.subject ?? subjectBase
        const generatedBody = content ?? parsed.contents
        return NextResponse.json({ subject: generatedSubject, body: generatedBody })
      } catch (err) {
        return NextResponse.json({ error: "Unexpected Gemini error", details: err instanceof Error ? err.message : String(err) }, { status: 500 })
      }
    }

    const generatedSubject = subject ?? subjectBase
    const generatedBody =
      content ?? `Hi there,\n\nI wanted to reach out about next steps for our ${subtype} request. Let me know a good time to connect.\n\nBest regards,\nYour Name`

    return NextResponse.json({ subject: generatedSubject, body: generatedBody })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}


