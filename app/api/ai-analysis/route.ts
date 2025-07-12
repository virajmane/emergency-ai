import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { emergency, location } = await request.json()

    const prompt = `You are an emergency response AI assistant. Analyze this emergency situation and provide:

1. Emergency type classification (medical-cardiac, medical-trauma, fire, police, general)
2. Immediate action steps
3. Urgency level (critical, urgent, standard)
4. Recommended emergency services to search for

Emergency description: "${emergency}"
Location: ${location?.latitude}, ${location?.longitude}

Respond in JSON format with: emergencyType, immediateActions (array), urgencyLevel, recommendedServices, aiResponse (user-friendly explanation)`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      maxTokens: 500,
    })

    // Parse AI response
    let analysis
    try {
      analysis = JSON.parse(text)
    } catch {
      // Fallback if JSON parsing fails
      analysis = {
        emergencyType: "general",
        immediateActions: ["Call 911 if life-threatening", "Stay calm", "Provide clear location"],
        urgencyLevel: "urgent",
        recommendedServices: "hospital",
        aiResponse:
          "I've analyzed your emergency. Please call 911 for immediate assistance if this is life-threatening.",
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("AI Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze emergency",
        fallback: {
          emergencyType: "general",
          aiResponse: "Unable to analyze at this time. For life-threatening emergencies, call 911 immediately.",
        },
      },
      { status: 500 },
    )
  }
}
