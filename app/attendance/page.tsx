"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Save, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi, attendanceApi, type Student, type AttendanceRecord } from "@/lib/api"

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedGroup, setSelectedGroup] = useState("ቡድን ሀ")
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [selectedGroup])

  useEffect(() => {
    fetchAttendance()
  }, [currentDate, students])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const result = await studentsApi.getAll({ group: selectedGroup })
      if (result.success) {
        setStudents(result.data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    if (students.length === 0) return

    try {
      const result = await attendanceApi.get({ date: currentDate })
      if (result.success) {
        const attendanceMap: Record<string, AttendanceRecord> = {}
        result.data.forEach((record: AttendanceRecord) => {
          const key = `${record.studentId}-${currentDate}`
          attendanceMap[key] = record
        })
        setAttendance(attendanceMap)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    }
  }

  const filteredStudents = students.filter((student) => student.group === selectedGroup)

  const getAttendanceKey = (studentId: string, date: string) => `${studentId}-${date}`

  const updateAttendance = (studentId: string, session: "monday" | "wednesday" | "friday", checked: boolean) => {
    const key = getAttendanceKey(studentId, currentDate)
    setAttendance((prev) => ({
      ...prev,
      [key]: {
        studentId,
        date: currentDate,
        sessions: {
          ...(prev[key]?.sessions || { monday: false, wednesday: false, friday: false }),
          [session]: checked,
        },
      },
    }))
  }

  const saveAttendance = async () => {
    setIsSaving(true)
    try {
      const attendanceRecords = Object.values(attendance)
        .filter((record) => record.date === currentDate)
        .map((record) => ({
          studentId: record.studentId,
          sessions: record.sessions,
        }))

      const result = await attendanceApi.saveBulk(currentDate, attendanceRecords)

      if (result.success) {
        // Show success message or toast
        console.log("Attendance saved successfully")
      }
    } catch (error) {
      console.error("Error saving attendance:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getSessionAttendance = (studentId: string, session: "monday" | "wednesday" | "friday") => {
    const key = getAttendanceKey(studentId, currentDate)
    return attendance[key]?.sessions[session] || false
  }

  const getGroupColor = (group: string) => {
    switch (group) {
      case "ቡድን ሀ":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "ቡድን ለ":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "ቡድን ሐ":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
      case "ቡድን መ":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg amharic-text dark:text-white">እየጫነ ነው...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="amharic-text">ወደ ቤት ገጽ</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የተማሪ መገኘት መቁጠሪያ</h1>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-64 amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="ቡድን ይምረጡ" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="ቡድን ሀ" className="amharic-text dark:text-white">
                ቡድን ሀ (4-6 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ለ" className="amharic-text dark:text-white">
                ቡድን ለ (7-10 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ሐ" className="amharic-text dark:text-white">
                ቡድን ሐ (11-14 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን መ" className="amharic-text dark:text-white">
                ቡድን መ (15-18 ዓመት)
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button onClick={saveAttendance} disabled={isSaving} className="amharic-text">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "እየተቀመጠ..." : "መገኘት ቀምጥ"}
          </Button>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="amharic-text dark:text-white">{selectedGroup}</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">
                  {new Date(currentDate).toLocaleDateString("am-ET", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <Badge className={getGroupColor(selectedGroup)}>{filteredStudents.length} ተማሪዎች</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2 amharic-text">
                  በዚህ ቡድን ውስጥ ተማሪ የለም
                </h3>
                <p className="text-gray-500 dark:text-gray-400 amharic-text">በመጀመሪያ ተማሪዎችን ማስመዝገብ ያስፈልጋል።</p>
                <Link href="/register">
                  <Button className="mt-4 amharic-text">አዲስ ተማሪ መዝግብ</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-600">
                      <th className="text-left py-3 px-2 amharic-text dark:text-white">ተማሪ</th>
                      <th className="text-center py-3 px-2 amharic-text dark:text-white">ሰኞ</th>
                      <th className="text-center py-3 px-2 amharic-text dark:text-white">እሮብ</th>
                      <th className="text-center py-3 px-2 amharic-text dark:text-white">አርብ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                              {student.photo ? (
                                <img
                                  src={student.photo || "/placeholder.svg"}
                                  alt={student.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Users className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white amharic-text">
                                {student.fullName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 amharic-text">
                                {student.spiritualName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student._id!, "monday")}
                            onCheckedChange={(checked) => updateAttendance(student._id!, "monday", checked as boolean)}
                          />
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student._id!, "wednesday")}
                            onCheckedChange={(checked) =>
                              updateAttendance(student._id!, "wednesday", checked as boolean)
                            }
                          />
                        </td>
                        <td className="text-center py-4 px-2">
                          <Checkbox
                            checked={getSessionAttendance(student._id!, "friday")}
                            onCheckedChange={(checked) => updateAttendance(student._id!, "friday", checked as boolean)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
