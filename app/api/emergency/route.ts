import { type NextRequest, NextResponse } from "next/server"

// This would integrate with Foursquare Places API
export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, emergencyType } = await request.json()

    // Foursquare Places API integration
    const foursquareApiKey =  process.env.FOURSQUARE_API_KEY

    if (!foursquareApiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Determine search categories based on emergency type
    let categories = "15014" // Hospitals by default
    let query = "hospital"

    switch (emergencyType) {
      case "fire":
        categories = "15015" // Fire stations
        query = "fire station"
        break
      case "police":
        categories = "15016" // Police stations
        query = "police station"
        break
      case "medical":
        categories = "15014,15013" // Hospitals and urgent care
        query = "hospital emergency room"
        break
    }

    // Foursquare Places Search API call
    const searchUrl = `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latitude},${longitude}&categories=${categories}&limit=10&sort=DISTANCE`

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: foursquareApiKey,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Foursquare API error")
    }

    const data = await response.json()

    // Transform Foursquare data to our format
    const services =
      data.results?.map((place: any) => ({
        id: place.fsq_id,
        name: place.name,
        category: place.categories?.[0]?.name || "Emergency Service",
        address: place.location?.formatted_address || "Address not available",
        distance: place.distance ? (place.distance / 1609.34).toFixed(1) : "Unknown", // Convert meters to miles
        phone: place.tel,
        hours: place.hours?.display || "Hours not available",
        specialties: place.categories?.map((cat: any) => cat.name) || [],
        urgencyLevel: determineUrgencyLevel(place.categories?.[0]?.name),
      })) || []

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Emergency API error:", error)
    return NextResponse.json({ error: "Failed to fetch emergency services" }, { status: 500 })
  }
}

function determineUrgencyLevel(category: string): "critical" | "urgent" | "standard" {
  if (category?.toLowerCase().includes("hospital") || category?.toLowerCase().includes("emergency")) {
    return "critical"
  } else if (category?.toLowerCase().includes("urgent care")) {
    return "urgent"
  }
  return "standard"
}
