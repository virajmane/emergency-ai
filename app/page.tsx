"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MapPin, Clock, Navigation, AlertTriangle, Heart, Shield, Flame } from "lucide-react"

interface EmergencyService {
  id: string
  name: string
  category: string
  address: string
  distance: number
  phone?: string
  hours?: string
  specialties?: string[]
  urgencyLevel: "critical" | "urgent" | "standard"
}

interface LocationData {
  latitude: number
  longitude: number
}

export default function EmergencyAI() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [emergency, setEmergency] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [emergencyType, setEmergencyType] = useState<string | null>(null)
  const [services, setServices] = useState<EmergencyService[]>([])
  const [aiResponse, setAiResponse] = useState("")

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Location error:", error)
          // Fallback to default location (NYC)
          setLocation({ latitude: 40.7128, longitude: -74.006 })
        },
      )
    }
  }, [])

  const analyzeEmergency = async () => {
    if (!emergency.trim() || !location) return

    setIsAnalyzing(true)

    try {
      // Simulate AI analysis and Foursquare API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Determine emergency type based on input
      const input = emergency.toLowerCase()
      let type = "general"
      let searchQuery = "hospital"

      if (input.includes("heart") || input.includes("chest pain") || input.includes("cardiac")) {
        type = "medical-cardiac"
        searchQuery = "hospital"
      } else if (input.includes("fire") || input.includes("smoke") || input.includes("burning")) {
        type = "fire"
        searchQuery = "fire station"
      } else if (input.includes("crime") || input.includes("theft") || input.includes("assault")) {
        type = "police"
        searchQuery = "police station"
      } else if (input.includes("accident") || input.includes("injury") || input.includes("bleeding")) {
        type = "medical-trauma"
        searchQuery = "hospital"
      }

      setEmergencyType(type)

      // Mock Foursquare Places API response
      const mockServices: EmergencyService[] = [
        {
          id: "1",
          name: "Mount Sinai Hospital",
          category: "Hospital",
          address: "1 Gustave L. Levy Pl, New York, NY 10029",
          distance: 0.8,
          phone: "+1-212-241-6500",
          hours: "24/7",
          specialties: ["Emergency Medicine", "Cardiology", "Trauma Center"],
          urgencyLevel: "critical",
        },
        {
          id: "2",
          name: "NewYork-Presbyterian Hospital",
          category: "Hospital",
          address: "525 E 68th St, New York, NY 10065",
          distance: 1.2,
          phone: "+1-212-746-5454",
          hours: "24/7",
          specialties: ["Emergency Medicine", "Cardiac Surgery", "Level 1 Trauma"],
          urgencyLevel: "critical",
        },
        {
          id: "3",
          name: "Lenox Health Greenwich Village",
          category: "Urgent Care",
          address: "30 7th Ave, New York, NY 10011",
          distance: 2.1,
          phone: "+1-212-434-6000",
          hours: "6 AM - 12 AM",
          specialties: ["Urgent Care", "Emergency Medicine"],
          urgencyLevel: "urgent",
        },
      ]

      setServices(mockServices)

      // Generate AI response based on emergency type
      let response = ""
      switch (type) {
        case "medical-cardiac":
          response =
            "🚨 CARDIAC EMERGENCY DETECTED\n\nImmediate actions:\n1. Call 911 immediately if severe\n2. Have patient sit down and rest\n3. If prescribed, take nitroglycerin\n4. Chew aspirin if not allergic\n\nI've found the nearest cardiac-capable hospitals. Mount Sinai Hospital (0.8 miles) has excellent cardiology services and is closest."
          break
        case "fire":
          response =
            "🔥 FIRE EMERGENCY DETECTED\n\nImmediate actions:\n1. Call 911 immediately\n2. Evacuate the building safely\n3. Stay low if there's smoke\n4. Don't use elevators\n5. Meet at designated assembly point\n\nNearest fire station located. Do not re-enter building until cleared by fire department."
          break
        case "medical-trauma":
          response =
            "🩹 TRAUMA EMERGENCY DETECTED\n\nImmediate actions:\n1. Call 911 for severe injuries\n2. Apply direct pressure to bleeding\n3. Don't move patient unless necessary\n4. Keep patient warm and calm\n\nMount Sinai Hospital (0.8 miles) is a Level 1 Trauma Center - best option for serious injuries."
          break
        default:
          response =
            "I've analyzed your emergency situation. Based on your location, I've found the nearest appropriate emergency services. For life-threatening emergencies, always call 911 first."
      }

      setAiResponse(response)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "urgent":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "medical-cardiac":
      case "medical-trauma":
        return <Heart className="h-5 w-5" />
      case "fire":
        return <Flame className="h-5 w-5" />
      case "police":
        return <Shield className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">EmergencyAI</h1>
          </div>
          <p className="text-lg text-gray-600">AI-Powered Emergency Response Assistant</p>
          {location && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>
                Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* Emergency Input */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Describe Your Emergency</CardTitle>
            <CardDescription>
              Tell me what's happening. I'll analyze the situation and find the best help nearby.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'Chest pain and difficulty breathing' or 'House fire on 2nd floor'"
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={analyzeEmergency}
                disabled={!emergency.trim() || !location || isAnalyzing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isAnalyzing ? "Analyzing..." : "Get Help"}
              </Button>
            </div>

            {/* Quick Emergency Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergency("Severe chest pain and shortness of breath")}
                className="text-red-600 border-red-200"
              >
                <Heart className="h-4 w-4 mr-1" />
                Heart Attack
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergency("Car accident with injuries")}
                className="text-orange-600 border-orange-200"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Accident
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergency("House fire spreading quickly")}
                className="text-red-600 border-red-200"
              >
                <Flame className="h-4 w-4 mr-1" />
                Fire
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergency("Break-in in progress")}
                className="text-blue-600 border-blue-200"
              >
                <Shield className="h-4 w-4 mr-1" />
                Crime
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Response */}
        {aiResponse && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line font-medium">{aiResponse}</AlertDescription>
          </Alert>
        )}

        {/* Emergency Services */}
        {services.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {emergencyType && getEmergencyIcon(emergencyType)}
              Nearest Emergency Services
            </h2>

            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600">{service.category}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{service.address}</span>
                        </div>
                      </div>
                      <Badge className={`${getUrgencyColor(service.urgencyLevel)} text-white`}>
                        {service.distance} miles
                      </Badge>
                    </div>

                    {service.specialties && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                      {service.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{service.phone}</span>
                        </div>
                      )}
                      {service.hours && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.hours}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {service.phone && (
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => window.open(`tel:${service.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(service.address)}`)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Protocols */}
        {emergencyType && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Emergency Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-red-600">🚨 For Life-Threatening Emergencies: Call 911 Immediately</p>
                <p>• Stay calm and speak clearly</p>
                <p>• Provide your exact location</p>
                <p>• Describe the emergency clearly</p>
                <p>• Follow dispatcher instructions</p>
                <p>• Stay on the line until help arrives</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
