"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi, attendanceApi, type Student, type AttendanceRecord } from "@/lib/api"

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<
    Record<string, { monday: boolean; wednesday: boolean; friday: boolean }>
  >({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendance()
    }
  }, [selectedDate, students])

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

  const fetchAttendance = async () => {
    try {
      const result = await attendanceApi.get({ date: selectedDate })
      if (result.success) {
        const attendanceMap: Record<string, { monday: boolean; wednesday: boolean; friday: boolean }> = {}

        // Initialize all students with false attendance
        students.forEach((student) => {
          attendanceMap[student.id] = { monday: false, wednesday: false, friday: false }
        })

        // Update with actual attendance data
        result.data.forEach((record: AttendanceRecord) => {
          if (attendanceMap[record.studentId]) {
            attendanceMap[record.studentId] = record.sessions
          }
        })

        setAttendance(attendanceMap)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const handleAttendanceChange = (studentId: string, session: "monday" | "wednesday" | "friday", checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [session]: checked,
      },
    }))
  }

  const handleSaveAttendance = async () => {
    try {
      setSaving(true)
      setMessage("")
      setError("")

      const attendanceRecords = Object.entries(attendance).map(([studentId, sessions]) => ({
        studentId,
        sessions,
      }))

      const result = await attendanceApi.saveBulk(selectedDate, attendanceRecords)

      if (result.success) {
        setMessage("መገኘት በተሳካ ሁኔታ ተመዝግቧል!")
      } else {
        setError("መገኘት መመዝገብ አልተሳካም።")
      }
    } catch (error) {
      console.error("Error saving attendance:", error)
      setError("መገኘት መመዝገብ አልተሳካም።")
    } finally {
      setSaving(false)
    }
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

  const getTotalAttendance = (studentId: string) => {
    const sessions = attendance[studentId] || { monday: false, wednesday: false, friday: false }
    return Object.values(sessions).filter(Boolean).length
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">መገኘት መመዝገቢያ</h1>
              <p className="text-gray-600 dark:text-gray-300 amharic-text">የተማሪዎች ዕለታዊ መገኘት ይመዝግቡ</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300 amharic-text">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300 amharic-text">{error}</AlertDescription>
          </Alert>
        )}

        {/* Date Selection */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="amharic-text dark:text-white">ቀን ይምረጡ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="date" className="amharic-text dark:text-gray-200">
                  የመገኘት ቀን
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300 amharic-text">
                  {new Date(selectedDate).toLocaleDateString("am-ET", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="amharic-text dark:text-white">የተማሪዎች መገኘት</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">ሰኞ፣ ረቡዕ እና ዓርብ ክፍለ ጊዜዎች</CardDescription>
              </div>
              <Button onClick={handleSaveAttendance} disabled={saving} className="amharic-text">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "እየተመዘገበ..." : "መገኘት መዝግብ"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">ተማሪ</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">
                      ቡድን
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">ሰኞ</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">
                      ረቡዕ
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">
                      ዓርብ
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white amharic-text">
                      ጠቅላላ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {student.photo ? (
                            <img
                              src={student.photo || "/placeholder.svg"}
                              alt={student.fullName}
                              className="w-8 h-8 rounded-full object-cover border dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                                {student.fullName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white amharic-text">
                              {student.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 amharic-text">
                              {student.spiritualName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={`amharic-text ${getGroupColor(student.group)}`}>{student.group}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={attendance[student.id]?.monday || false}
                          onCheckedChange={(checked) =>
                            handleAttendanceChange(student.id, "monday", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={attendance[student.id]?.wednesday || false}
                          onCheckedChange={(checked) =>
                            handleAttendanceChange(student.id, "wednesday", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox
                          checked={attendance[student.id]?.friday || false}
                          onCheckedChange={(checked) =>
                            handleAttendanceChange(student.id, "friday", checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {getTotalAttendance(student.id)}/3
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
