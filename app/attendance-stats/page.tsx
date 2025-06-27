"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BarChart3, Calendar, Users, TrendingUp, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { attendanceApi, type AttendanceStats } from "@/lib/api"

export default function AttendanceStatsPage() {
  const [stats, setStats] = useState<{ students: AttendanceStats[]; overall: any } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [selectedGroup, startDate, endDate])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError("")

      const filters: any = {}
      if (selectedGroup !== "all") filters.group = selectedGroup
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate

      const result = await attendanceApi.getStats(filters)

      if (result.success) {
        setStats(result.data)
      } else {
        setError("የመገኘት ስታቲስቲክስ ማምጣት አልተሳካም።")
      }
    } catch (error) {
      console.error("Error fetching attendance stats:", error)
      setError("የመገኘት ስታቲስቲክስ ማምጣት አልተሳካም።")
    } finally {
      setLoading(false)
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

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400"
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የመገኘት ስታቲስቲክስ</h1>
              <p className="text-gray-600 dark:text-gray-300 amharic-text">የተማሪዎች መገኘት ሪፖርት እና ትንተና</p>
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

        {/* Filters */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="amharic-text dark:text-white">ፍልተር</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="group" className="amharic-text dark:text-gray-200">
                  ቡድን
                </Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
                    <SelectItem value="ሌላ" className="amharic-text dark:text-white">
                      ሌላ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="amharic-text dark:text-gray-200">
                  ከ ቀን
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="amharic-text dark:text-gray-200">
                  እስከ ቀን
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics */}
        {stats?.overall && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">ጠቅላላ ተማሪዎች</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.overall.totalStudents}</div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">የመገኘት ቀናት</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.overall.totalDaysWithAttendance}</div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">አማካይ መገኘት</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">
                  {stats.overall.averageAttendanceRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">ጠቅላላ ክፍለ ጊዜዎች</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">
                  {stats.overall.totalAttendedSessions}/{stats.overall.totalSessions}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Statistics */}
        {stats?.students && stats.students.length > 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="amharic-text dark:text-white">የተማሪዎች መገኘት ዝርዝር</CardTitle>
              <CardDescription className="amharic-text dark:text-gray-300">
                እያንዳንዱ ተማሪ የመገኘት ሁኔታ እና ስታቲስቲክስ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.students.map((studentStat) => (
                  <div
                    key={studentStat.student.id}
                    className="border rounded-lg p-4 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {studentStat.student.photo ? (
                          <img
                            src={studentStat.student.photo || "/placeholder.svg"}
                            alt={studentStat.student.fullName}
                            className="w-10 h-10 rounded-full object-cover border dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 font-semibold">
                              {studentStat.student.fullName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white amharic-text">
                            {studentStat.student.fullName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 amharic-text">
                            {studentStat.student.spiritualName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`amharic-text ${getGroupColor(studentStat.student.group)}`}>
                          {studentStat.student.group}
                        </Badge>
                        <div className={`text-2xl font-bold ${getAttendanceColor(studentStat.attendancePercentage)}`}>
                          {studentStat.attendancePercentage}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 amharic-text">ጠቅላላ ቀናት:</span>
                          <span className="font-medium dark:text-white">{studentStat.totalDays}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 amharic-text">የተሳተፉ ክፍለ ጊዜዎች:</span>
                          <span className="font-medium dark:text-white">
                            {studentStat.attendedSessions}/{studentStat.totalSessions}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 amharic-text">ሰኞ:</span>
                          <span className="font-medium dark:text-white">
                            {studentStat.sessionStats.monday.attended}/{studentStat.sessionStats.monday.total} (
                            {studentStat.sessionStats.monday.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 amharic-text">ረቡዕ:</span>
                          <span className="font-medium dark:text-white">
                            {studentStat.sessionStats.wednesday.attended}/{studentStat.sessionStats.wednesday.total} (
                            {studentStat.sessionStats.wednesday.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 amharic-text">ዓርብ:</span>
                          <span className="font-medium dark:text-white">
                            {studentStat.sessionStats.friday.attended}/{studentStat.sessionStats.friday.total} (
                            {studentStat.sessionStats.friday.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 amharic-text">አጠቃላይ መገኘት:</span>
                        <span className={`font-medium ${getAttendanceColor(studentStat.attendancePercentage)}`}>
                          {studentStat.attendancePercentage}%
                        </span>
                      </div>
                      <Progress value={studentStat.attendancePercentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 amharic-text text-lg">
                በተመረጠው ቀን ክልል ውስጥ የመገኘት መረጃ አልተገኘም።
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
