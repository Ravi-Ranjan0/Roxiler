"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"
import { getStoreRatingsService } from "@/services/rating.service"

type RatingEntry = {
  id: number
  rating: number
  userId: number
  storeId: number
  createdAt: string
  updatedAt: string
  user: {
    id: number
    name: string
    email: string
  }
}

const Dashboard = () => {
  const storeId = 41

  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratings, setRatings] = useState<RatingEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true)
        const res = await getStoreRatingsService(storeId)
        const data = res.data
        console.log("Fetched ratings:", data);

        setRatings(data.ratings)
        setAverageRating(data.averageRating ?? 0)
      } catch (error) {
        console.error("Failed to fetch store ratings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRatings()
  }, [storeId])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Store Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-yellow-500 text-xl">
            <Star className="w-6 h-6 fill-current" />
            {isLoading ? "Loading..." : `${averageRating.toFixed(1)} / 5`}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users Rated</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold text-muted-foreground">
            {isLoading ? "Loading..." : `${ratings.length} Users`}
          </CardContent>
        </Card>
      </div>

      {/* Ratings Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading ratings...</p>
          ) : ratings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratings.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.user.name}</TableCell>
                    <TableCell>{r.user.email}</TableCell>
                    <TableCell className="text-yellow-600 font-medium">{r.rating} ★</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
