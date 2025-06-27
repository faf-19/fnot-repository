"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, BookOpen, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi, type Student } from "@/lib/api"

export default function GroupsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const result = await studentsApi.getAll()
      if (result.success) {
        setStudents(result.data)
      } else {
        setError("የተማሪዎች ዝርዝር ማምጣት አልተሳካም።")
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      setError("የተማሪዎች ዝርዝር ማምጣት አልተሳካም።")
    } finally {
      setLoading(false)
    }
  }

  const groupStudents = () => {
    const groups = students.reduce(
      (acc, student) => {
        if (!acc[student.group]) {
          acc[student.group] = []
        }
        acc[student.group].push(student)
        return acc
      },
      {} as Record<string, Student[]>,
    )

    return groups
  }

  const getGroupColor = (group: string) => {
    switch (group) {
      case "ቡድን ሀ":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "ቡድን ለ":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "ቡድን ሐ":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "ቡድን መ":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getGroupDescription = (group: string) => {
    switch (group) {
      case "ቡድን ሀ":
        return "4-6 ዓመት"
      case "ቡድን ለ":
        return "7-10 ዓመት"
      case "ቡድን ሐ":
        return "11-14 ዓመት"
      case "ቡድን መ":
        return "15-18 ዓመት"
      default:
        return "ሌላ እድሜ"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 amharic-text">እየጠበቅ ነው...</p>
        </div>
      </div>
    )
  }

  const groupedStudents = groupStudents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="amharic-text">ወደ ቤት ገጽ</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የእድሜ ቡድኖች</h1>
              <p className="text-gray-600 dark:text-gray-300 amharic-text">ተማሪዎች በእድሜ ቡድን የተከፋፈሉበት ሁኔታ</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300 amharic-text">{error}</AlertDescription>
          </Alert>
        )}

        {/* Groups */}
        {Object.keys(groupedStudents).length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 amharic-text text-lg">ተማሪ አልተገኘም።</p>
              <Link href="/register">
                <Button className="mt-4 amharic-text">አዲስ ተማሪ መዝግብ</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedStudents).map(([group, groupStudents]) => (
              <Card key={group} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <CardTitle className="amharic-text dark:text-white">{group}</CardTitle>
                        <CardDescription className="amharic-text dark:text-gray-300">
                          {getGroupDescription(group)} - {groupStudents.length} ተማሪዎች
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`amharic-text ${getGroupColor(group)}`}>{groupStudents.length} ተማሪዎች</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupStudents.map((student) => (
                      <div
                        key={student.id}
                        className="border rounded-lg p-4 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          {student.photo ? (
                            <img
                              src={student.photo || "/placeholder.svg"}
                              alt={student.fullName}
                              className="w-10 h-10 rounded-full object-cover border dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 font-semibold">
                                {student.fullName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white amharic-text">
                              {student.fullName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 amharic-text">
                              {student.spiritualName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                                {student.age} ዓመት
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs amharic-text dark:border-gray-600 dark:text-gray-300"
                              >
                                {student.sex}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
