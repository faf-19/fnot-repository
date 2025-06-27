"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, TrendingUp, Users, BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { attendanceApi, type AttendanceStats } from "@/lib/api"

export default function AttendanceStatsPage() {
  const [stats, setStats] = useState<AttendanceStats[]>([])
  const [overallStats, setOverallStats] = useState<any>(null)
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [selectedGroup, startDate, endDate])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (selectedGroup !== "all") params.group = selectedGroup
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const result = await attendanceApi.getStats(params)
      if (result.success) {
        setStats(result.data.students)
        setOverallStats(result.data.overall)
      }
    } catch (error) {
      console.error("Error fetching attendance stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የመገኘት ስታቲስቲክስ</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 amharic-text">የተማሪዎች መገኘት ዝርዝር እና ትንተና</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-48 amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="ቡድን ይምረጡ" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all" className="amharic-text dark:text-white">
                ሁሉም ቡድኖች
              </SelectItem>
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="ከ ቀን"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <span className="text-gray-500 dark:text-gray-400 amharic-text">እስከ</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="እስከ ቀን"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Overall Statistics */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalStudents}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 amharic-text">ጠቅላላ ተማሪዎች</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallStats.totalDaysWithAttendance}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 amharic-text">የመገኘት ቀናት</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(overallStats.averageAttendanceRate)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 amharic-text">አማካይ መገኘት</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallStats.totalAttendedSessions}/{overallStats.totalSessions}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 amharic-text">ጠቅላላ ክፍለ ጊዜዎች</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Statistics */}
        <div className="space-y-4">
          {stats.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2 amharic-text">
                  የመገኘት መረጃ አልተገኘም
                </h3>
                <p className="text-gray-500 dark:text-gray-400 amharic-text">በተመረጠው ቀን ክልል ውስጥ የመገኘት መረጃ አልተገኘም።</p>
              </CardContent>
            </Card>
          ) : (
            stats.map((studentStat) => (
              <Card key={studentStat.student._id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                        {studentStat.student.photo ? (
                          <img
                            src={studentStat.student.photo || "/placeholder.svg"}
                            alt={studentStat.student.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="amharic-text dark:text-white">{studentStat.student.fullName}</CardTitle>
                        <CardDescription className="amharic-text dark:text-gray-300">
                          {studentStat.student.spiritualName} • {studentStat.student.class}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getGroupColor(studentStat.student.group)}>{studentStat.student.group}</Badge>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getAttendanceColor(studentStat.attendancePercentage)}`}>
                          {studentStat.attendancePercentage}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 amharic-text">አጠቃላይ መገኘት</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Progress */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium amharic-text dark:text-gray-300">አጠቃላይ መገኘት</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {studentStat.attendedSessions}/{studentStat.totalSessions}
                          </span>
                        </div>
                        <Progress value={studentStat.attendancePercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {studentStat.totalDays}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 amharic-text">የመገኘት ቀናት</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {studentStat.attendedSessions}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 amharic-text">የተገኙ ክፍለ ጊዜዎች</div>
                        </div>
                      </div>
                    </div>

                    {/* Session Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-medium amharic-text dark:text-white">በክፍለ ጊዜ መገኘት</h4>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm amharic-text dark:text-gray-300">ሰኞ</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {studentStat.sessionStats.monday.attended}/{studentStat.sessionStats.monday.total} (
                            {studentStat.sessionStats.monday.percentage}%)
                          </span>
                        </div>
                        <Progress value={studentStat.sessionStats.monday.percentage} className="h-1" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm amharic-text dark:text-gray-300">እሮብ</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {studentStat.sessionStats.wednesday.attended}/{studentStat.sessionStats.wednesday.total} (
                            {studentStat.sessionStats.wednesday.percentage}%)
                          </span>
                        </div>
                        <Progress value={studentStat.sessionStats.wednesday.percentage} className="h-1" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm amharic-text dark:text-gray-300">አርብ</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {studentStat.sessionStats.friday.attended}/{studentStat.sessionStats.friday.total} (
                            {studentStat.sessionStats.friday.percentage}%)
                          </span>
                        </div>
                        <Progress value={studentStat.sessionStats.friday.percentage} className="h-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
