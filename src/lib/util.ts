import { useState } from "react"

interface ViolationData {
  statusCode: number
  statusMessage: string
  civilId: string
  publicOrgNumber: string
  userId: string
  totalViolationAmount: number
  totalTicketsCount: number
  personalViolationsData: PersonalViolation[]
}

interface PersonalViolation {
  violationTransaction: string
  violationYear: string
  violationTicketNumber: string
  violationType: string
  violationDate: string
  violationTime: string
  violationPlace: string
  violationPublicOrgNumber: string
  violationBookNumber: string
  violationAmount: number
  vehiclePlateCode: string
  vehiclePlateNumber: string
}

export const useFetchViolationData = () => {
  const [violationData, setViolationData] = useState<ViolationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchViolationData = async (idv: string) => {
    setIsLoading(true)
    setError(null)

    const proxyUrl = "https://api.allorigins.win/get?url="
    const targetUrl = `https://www.moi.gov.kw/mfservices/traffic-violation/${idv}`

    try {
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl))
      const data = await response.json()

      if (data.contents) {
        const parsedData: ViolationData = JSON.parse(data.contents)
        setViolationData(parsedData)
        console.log("Parsed Data:", parsedData)
      } else {
        throw new Error("No data received from the API")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch violation data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { violationData, isLoading, error, fetchViolationData }
}

