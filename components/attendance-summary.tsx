"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users } from "lucide-react"
import { attendanceApi, type AttendanceStats } from "@/lib/api"

interface AttendanceSummaryProps {
  studentId?: string
  group?: string
  limit?: number
}

export function AttendanceSummary({ studentId, group, limit = 5 }: AttendanceSummaryProps) {
  const [stats, setStats] = useState<AttendanceStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [studentId, group])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (studentId) params.studentId = studentId
      if (group && group !== "all") params.group = group

      const result = await attendanceApi.getStats(params)
      if (result.success) {
        const studentsData = studentId ? [result.data] : result.data.students
        setStats(studentsData.slice(0, limit))
      }
    } catch (error) {
      console.error("Error fetching attendance summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  if (loading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="text-center amharic-text dark:text-white">እየጫነ ነው...</div>
        </CardContent>
      </Card>
    )
  }

  if (stats.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 amharic-text">የመገኘት መረጃ አልተገኘም</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {stats.map((studentStat) => (
        <Card key={studentStat.student._id} className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                  {studentStat.student.photo ? (
                    <img
                      src={studentStat.student.photo || "/placeholder.svg"}
                      alt={studentStat.student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg amharic-text dark:text-white">{studentStat.student.fullName}</CardTitle>
                  <CardDescription className="amharic-text dark:text-gray-300">
                    {studentStat.student.spiritualName}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${getAttendanceColor(studentStat.attendancePercentage)}`}>
                  {studentStat.attendancePercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 amharic-text">መገኘት</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="amharic-text dark:text-gray-300">አጠቃላይ መገኘት</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {studentStat.attendedSessions}/{studentStat.totalSessions} ክፍለ ጊዜዎች
                </span>
              </div>
              <Progress value={studentStat.attendancePercentage} className="h-2" />

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium dark:text-white">{studentStat.sessionStats.monday.percentage}%</div>
                  <div className="text-gray-500 dark:text-gray-400 amharic-text">ሰኞ</div>
                </div>
                <div className="text-center">
                  <div className="font-medium dark:text-white">{studentStat.sessionStats.wednesday.percentage}%</div>
                  <div className="text-gray-500 dark:text-gray-400 amharic-text">እሮብ</div>
                </div>
                <div className="text-center">
                  <div className="font-medium dark:text-white">{studentStat.sessionStats.friday.percentage}%</div>
                  <div className="text-gray-500 dark:text-gray-400 amharic-text">አርብ</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
