"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, UserPlus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi, type Student } from "@/lib/api"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedGroup])

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

  const filterStudents = () => {
    let filtered = students

    if (selectedGroup !== "all") {
      filtered = filtered.filter((student) => student.group === selectedGroup)
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(search) ||
          student.spiritualName.toLowerCase().includes(search) ||
          student.class.toLowerCase().includes(search),
      )
    }

    setFilteredStudents(filtered)
  }

  const handleDeleteStudent = async (id: string) => {
    if (confirm("እርግጠኛ ነዎት ይህን ተማሪ መሰረዝ ይፈልጋሉ?")) {
      try {
        const result = await studentsApi.delete(id)
        if (result.success) {
          await fetchStudents()
        } else {
          setError("ተማሪ መሰረዝ አልተሳካም።")
        }
      } catch (error) {
        console.error("Error deleting student:", error)
        setError("ተማሪ መሰረዝ አልተሳካም።")
      }
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">የተማሪዎች ዝርዝር</h1>
              <p className="text-gray-600 dark:text-gray-300 amharic-text">ጠቅላላ {filteredStudents.length} ተማሪዎች</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/register">
              <Button className="amharic-text">
                <UserPlus className="w-4 h-4 mr-2" />
                አዲስ ተማሪ
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300 amharic-text">{error}</AlertDescription>
          </Alert>
        )}
>>>>>>> d37a7066ac091c047b0f420882037e57987ac597

        {/* Filters */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="amharic-text dark:text-white">ፍልተር እና ፍለጋ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ስም፣ የመንፈሳዊ ስም ወይም ክፍል ይፈልጉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
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
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 amharic-text text-lg">ተማሪ አልተገኘም።</p>
              <Link href="/register">
                <Button className="mt-4 amharic-text">
                  <UserPlus className="w-4 h-4 mr-2" />
                  አዲስ ተማሪ መዝግብ
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
<<<<<<< HEAD
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
=======
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {student.photo ? (
                        <img
                          src={student.photo || "/placeholder.svg"}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 font-semibold">
                            {student.fullName.charAt(0)}
                          </span>
>>>>>>> d37a7066ac091c047b0f420882037e57987ac597
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg amharic-text dark:text-white">{student.fullName}</CardTitle>
                        <CardDescription className="amharic-text dark:text-gray-300">
                          {student.spiritualName}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`amharic-text ${getGroupColor(student.group)}`}>{student.group}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 amharic-text">እድሜ:</span>
                      <span className="font-medium dark:text-white">{student.age} ዓመት</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 amharic-text">ፆታ:</span>
                      <span className="font-medium dark:text-white amharic-text">{student.sex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 amharic-text">ክፍል:</span>
                      <span className="font-medium dark:text-white amharic-text">{student.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 amharic-text">ስልክ:</span>
                      <span className="font-medium dark:text-white">{student.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 amharic-text">አድራሻ:</span>
                      <span className="font-medium dark:text-white amharic-text">{student.address}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t dark:border-gray-600">
                    <Button
                      variant="outline"
                      size="sm"
                      className="amharic-text dark:border-gray-600 dark:text-gray-300 bg-transparent"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      ማስተካከል
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 amharic-text"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      ሰረዝ
                    </Button>
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
