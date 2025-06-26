"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Users } from "lucide-react"

interface Student {
  id: string
  fullName: string
  spiritualName: string
  sex: string
  age: number
  class: string
  familyName: string
  phone: string
  address: string
  photo?: string
  group: string
  registrationDate: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
    setStudents(savedStudents)
    setFilteredStudents(savedStudents)
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.spiritualName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGroup !== "all") {
      filtered = filtered.filter((student) => student.group === selectedGroup)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, selectedGroup])

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
        return "bg-blue-100 text-blue-800"
      case "ቡድን ለ":
        return "bg-green-100 text-green-800"
      case "ቡድን ሐ":
        return "bg-purple-100 text-purple-800"
      case "ቡድን መ":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="amharic-text">ወደ ቤት ገጽ</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 amharic-text">የተመዘገቡ ተማሪዎች</h1>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="በስም፣ በመንፈሳዊ ስም ወይም በክፍል ይፈልጉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 amharic-text"
            />
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-48 amharic-text">
              <SelectValue placeholder="ቡድን ይምረጡ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="amharic-text">
                ሁሉም ቡድኖች
              </SelectItem>
              <SelectItem value="ቡድን ሀ" className="amharic-text">
                ቡድን ሀ (4-6 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ለ" className="amharic-text">
                ቡድን ለ (7-10 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን ሐ" className="amharic-text">
                ቡድን ሐ (11-14 ዓመት)
              </SelectItem>
              <SelectItem value="ቡድን መ" className="amharic-text">
                ቡድን መ (15-18 ዓመት)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600 amharic-text">ጠቅላላ ተማሪዎች: {filteredStudents.length}</span>
        </div>

        {Object.keys(groupedStudents).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2 amharic-text">ተማሪ አልተገኘም</h3>
              <p className="text-gray-500 amharic-text">እስካሁን ምንም ተማሪ አልተመዘገበም ወይም የፍለጋ መስፈርትዎ ከማንኛውም ተማሪ ጋር አይዛመድም።</p>
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
                  <h2 className="text-2xl font-semibold text-gray-800 amharic-text">{group}</h2>
                  <Badge className={getGroupColor(group)}>{groupStudents.length} ተማሪዎች</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                            <h3 className="font-semibold text-gray-900 truncate amharic-text">{student.fullName}</h3>
                            <p className="text-sm text-gray-600 truncate amharic-text">{student.spiritualName}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-gray-500 amharic-text">እድሜ: {student.age} ዓመት</p>
                              <p className="text-xs text-gray-500 amharic-text">ክፍል: {student.class}</p>
                              <p className="text-xs text-gray-500 amharic-text">የአባት ስም: {student.familyName}</p>
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
