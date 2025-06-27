"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Calendar, BarChart3, BookOpen, GraduationCap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { statsApi } from "@/lib/api"

export default function HomePage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await statsApi.get()
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white amharic-text mb-2">
              የተማሪዎች መመዝገቢያ እና ክትትል ስርዓት
            </h1>
            <p className="text-gray-600 dark:text-gray-300 amharic-text">ተማሪዎችን ማስመዝገብ፣ መከታተል እና የመገኘት ሪፖርት ማዘጋጀት</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Statistics Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">ጠቅላላ ተማሪዎች</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.students?.total || 0}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="amharic-text">
                    ወንድ: {stats.students?.male || 0}
                  </Badge>
                  <Badge variant="outline" className="amharic-text">
                    ሴት: {stats.students?.female || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">የዛሬ መገኘት</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.attendance?.today || 0}</div>
                <p className="text-xs text-muted-foreground amharic-text">የዛሬ ተሳታፊዎች</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">የእድሜ ቡድኖች</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stats.students?.byGroup?.length || 0}</div>
                <p className="text-xs text-muted-foreground amharic-text">ተለያዩ ቡድኖች</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium amharic-text dark:text-gray-200">ስርዓት ሁኔታ</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">ንቁ</div>
                <p className="text-xs text-muted-foreground amharic-text">ሁሉም ስርዓቶች እየሰሩ ነው</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/register">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="amharic-text dark:text-white">አዲስ ተማሪ መመዝገቢያ</CardTitle>
                </div>
                <CardDescription className="amharic-text dark:text-gray-300">አዲስ ተማሪዎችን ወደ ስርዓቱ ያስመዝግቡ</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full amharic-text">ተማሪ መዝግብ</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/students">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <CardTitle className="amharic-text dark:text-white">የተማሪዎች ዝርዝር</CardTitle>
                </div>
                <CardDescription className="amharic-text dark:text-gray-300">
                  የተመዘገቡ ተማሪዎችን ይመልከቱ እና ያስተዳድሩ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full amharic-text dark:border-gray-600 dark:text-gray-300 bg-transparent"
                >
                  ተማሪዎችን ይመልከቱ
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/attendance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="amharic-text dark:text-white">መገኘት መመዝገቢያ</CardTitle>
                </div>
                <CardDescription className="amharic-text dark:text-gray-300">
                  የተማሪዎች መገኘት ይመዝግቡ እና ያስተዳድሩ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full amharic-text dark:border-gray-600 dark:text-gray-300 bg-transparent"
                >
                  መገኘት መዝግብ
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="amharic-text dark:text-white">የእድሜ ቡድኖች</CardTitle>
                </div>
                <CardDescription className="amharic-text dark:text-gray-300">ተማሪዎችን በእድሜ ቡድን ይመልከቱ</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full amharic-text dark:border-gray-600 dark:text-gray-300 bg-transparent"
                >
                  ቡድኖችን ይመልከቱ
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/attendance-stats">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <CardTitle className="amharic-text dark:text-white">የመገኘት ስታቲስቲክስ</CardTitle>
                </div>
                <CardDescription className="amharic-text dark:text-gray-300">የተማሪዎች መገኘት ሪፖርት እና ትንተና</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full amharic-text dark:border-gray-600 dark:text-gray-300 bg-transparent"
                >
                  ሪፖርት ይመልከቱ
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="amharic-text dark:text-white">ስርዓት መረጃ</CardTitle>
              </div>
              <CardDescription className="amharic-text dark:text-gray-300">የስርዓቱ አጠቃላይ መረጃ እና ሁኔታ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm amharic-text dark:text-gray-300">ስሪት:</span>
                  <span className="text-sm font-medium dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm amharic-text dark:text-gray-300">ሁኔታ:</span>
                  <Badge variant="default" className="amharic-text">
                    ንቁ
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Group Statistics */}
        {!loading && stats?.students?.byGroup && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="amharic-text dark:text-white">የቡድን ስታቲስቲክስ</CardTitle>
              <CardDescription className="amharic-text dark:text-gray-300">ተማሪዎች በእድሜ ቡድን የተከፋፈሉበት ሁኔታ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.students.byGroup.map((group: any) => (
                  <div key={group._id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{group.count}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 amharic-text">{group._id}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
