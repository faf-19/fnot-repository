"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi, type Student } from "@/lib/api"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [selectedGroup, searchTerm])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (selectedGroup !== "all") params.group = selectedGroup
      if (searchTerm) params.search = searchTerm

      const result = await studentsApi.getAll(params)
      if (result.success) {
        setStudents(result.data)
        setFilteredStudents(result.data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedStudents = filteredStudents.reduce(
    (acc, student) => {
      if (!acc[student.group]) {
        acc[student.group] = []
      }
      acc[student.group].push(student)
      return acc
    },
    {} as Record<string, Student[]>,
  )

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የተመዘገቡ ተማሪዎች</h1>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              placeholder="በስም፣ በክርስትና ስም ወይም በክፍል ይፈልጉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
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
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400 amharic-text">ጠቅላላ ተማሪዎች: {filteredStudents.length}</span>
        </div>

        {Object.keys(groupedStudents).length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2 amharic-text">ተማሪ አልተገኘም</h3>
              <p className="text-gray-500 dark:text-gray-400 amharic-text">
                እስካሁን ምንም ተማሪ አልተመዘገበም ወይም የፍለጋ መስፈርትዎ ከማንኛውም ተማሪ ጋር አይዛመድም።
              </p>
              <Link href="/register">
                <Button className="mt-4 amharic-text">አዲስ ተማሪ መዝግብ</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedStudents).map(([group, groupStudents]) => (
              <div key={group}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white amharic-text">{group}</h2>
                  <Badge className={getGroupColor(group)}>{groupStudents.length} ተማሪዎች</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupStudents.map((student) => (
                    <Card
                      key={student._id}
                      className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                            {student.photo ? (
                              <img
                                src={student.photo || "/placeholder.svg"}
                                alt={student.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Users className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate amharic-text">
                              {student.fullName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate amharic-text">
                              {student.spiritualName}
                            </p>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400 amharic-text">
                                እድሜ: {student.age} ዓመት
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 amharic-text">
                                ክፍል: {student.class}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 amharic-text">
                                የወላጅ ስም: {student.familyName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
