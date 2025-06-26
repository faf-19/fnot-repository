"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users } from "lucide-react"

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

export default function GroupsPage() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
    setStudents(savedStudents)
  }, [])

  const groupedStudents = students.reduce(
    (acc, student) => {
      if (!acc[student.group]) {
        acc[student.group] = []
      }
      acc[student.group].push(student)
      return acc
    },
    {} as Record<string, Student[]>,
  )

  const groups = [
    { name: "ቡድን ሀ", ageRange: "4-6 ዓመት", color: "bg-blue-100 text-blue-800", bgColor: "bg-blue-50" },
    { name: "ቡድን ለ", ageRange: "7-10 ዓመት", color: "bg-green-100 text-green-800", bgColor: "bg-green-50" },
    { name: "ቡድን ሐ", ageRange: "11-14 ዓመት", color: "bg-purple-100 text-purple-800", bgColor: "bg-purple-50" },
    { name: "ቡድን መ", ageRange: "15-18 ዓመት", color: "bg-orange-100 text-orange-800", bgColor: "bg-orange-50" },
  ]

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
          <h1 className="text-3xl font-bold text-gray-900 amharic-text">የእድሜ ቡድኖች</h1>
          <p className="text-gray-600 mt-2 amharic-text">ተማሪዎች በእድሜ ቡድን የተከፋፈሉበት ዝርዝር</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group) => {
            const studentsInGroup = groupedStudents[group.name] || []
            return (
              <Card key={group.name} className={`${group.bgColor} border-0`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="amharic-text text-xl">{group.name}</CardTitle>
                      <CardDescription className="amharic-text text-gray-600">{group.ageRange}</CardDescription>
                    </div>
                    <Badge className={group.color}>{studentsInGroup.length} ተማሪዎች</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {studentsInGroup.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 amharic-text">በዚህ ቡድን ውስጥ ተማሪ የለም</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentsInGroup.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
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
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate amharic-text">{student.fullName}</p>
                            <p className="text-sm text-gray-600 truncate amharic-text">
                              {student.spiritualName} • {student.age} ዓመት
                            </p>
                          </div>
                        </div>
                      ))}
                      {studentsInGroup.length > 5 && (
                        <div className="text-center py-2">
                          <p className="text-sm text-gray-600 amharic-text">
                            እና {studentsInGroup.length - 5} ተጨማሪ ተማሪዎች...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/30">
                    <div className="flex justify-between items-center">
                      <Link href={`/students?group=${encodeURIComponent(group.name)}`}>
                        <Button variant="outline" size="sm" className="amharic-text bg-white/50">
                          ሁሉንም ተማሪዎች ይመልከቱ
                        </Button>
                      </Link>
                      <Link href={`/attendance?group=${encodeURIComponent(group.name)}`}>
                        <Button size="sm" className="amharic-text">
                          መገኘት ይቁጠሩ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 amharic-text">አጠቃላይ ስታቲስቲክስ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-sm text-gray-600 amharic-text">ጠቅላላ ተማሪዎች</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{students.filter((s) => s.sex === "ወንድ").length}</div>
              <div className="text-sm text-gray-600 amharic-text">ወንድ ተማሪዎች</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{students.filter((s) => s.sex === "ሴት").length}</div>
              <div className="text-sm text-gray-600 amharic-text">ሴት ተማሪዎች</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600 amharic-text">የእድሜ ቡድኖች</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
