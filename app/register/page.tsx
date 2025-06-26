"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, AlertTriangle } from "lucide-react"

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

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    spiritualName: "",
    sex: "",
    age: "",
    class: "",
    familyName: "",
    phone: "",
    address: "",
    photo: "",
  })
  const [warning, setWarning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getAgeGroup = (age: number): string => {
    if (age >= 4 && age <= 6) return "ቡድን ሀ"
    if (age >= 7 && age <= 10) return "ቡድን ለ"
    if (age >= 11 && age <= 14) return "ቡድን ሐ"
    if (age >= 15 && age <= 18) return "ቡድን መ"
    return "ሌላ"
  }

  const checkDuplicate = (): boolean => {
    const existingStudents = JSON.parse(localStorage.getItem("students") || "[]")
    const duplicate = existingStudents.find(
      (student: Student) =>
        (student.fullName === formData.fullName &&
          student.spiritualName === formData.spiritualName &&
          student.age === Number.parseInt(formData.age)) ||
        student.phone === formData.phone,
    )

    if (duplicate) {
      setWarning("ይህ ተማሪ አስቀድሞ ተመዝግቧል።")
      return true
    }
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setWarning("")

    if (checkDuplicate()) {
      return
    }

    setIsSubmitting(true)

    const newStudent: Student = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      spiritualName: formData.spiritualName,
      sex: formData.sex,
      age: Number.parseInt(formData.age),
      class: formData.class,
      familyName: formData.familyName,
      phone: formData.phone,
      address: formData.address,
      photo: formData.photo,
      group: getAgeGroup(Number.parseInt(formData.age)),
      registrationDate: new Date().toISOString(),
    }

    const existingStudents = JSON.parse(localStorage.getItem("students") || "[]")
    existingStudents.push(newStudent)
    localStorage.setItem("students", JSON.stringify(existingStudents))

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/students")
    }, 1000)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, photo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="amharic-text">ወደ ቤት ገጽ</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 amharic-text">አዲስ ተማሪ መመዝገቢያ ቅፅ</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="amharic-text">የተማሪ መረጃ</CardTitle>
            <CardDescription className="amharic-text">እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ</CardDescription>
          </CardHeader>
          <CardContent>
            {warning && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 amharic-text">{warning}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="amharic-text">
                    ስም *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="ሙሉ ስም ያስገቡ"
                    className="amharic-text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spiritualName" className="amharic-text">
                    የመንፈሳዊ ስም *
                  </Label>
                  <Input
                    id="spiritualName"
                    value={formData.spiritualName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, spiritualName: e.target.value }))}
                    placeholder="የመንፈሳዊ ስም ያስገቡ"
                    className="amharic-text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex" className="amharic-text">
                    ፆታ *
                  </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                  >
                    <SelectTrigger className="amharic-text">
                      <SelectValue placeholder="ፆታ ይምረጡ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ወንድ" className="amharic-text">
                        ወንድ
                      </SelectItem>
                      <SelectItem value="ሴት" className="amharic-text">
                        ሴት
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="amharic-text">
                    እድሜ *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="4"
                    max="18"
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder="እድሜ ያስገቡ"
                    className="amharic-text"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class" className="amharic-text">
                    ክፍል *
                  </Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
                    placeholder="ክፍል ያስገቡ"
                    className="amharic-text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyName" className="amharic-text">
                    የአባት ስም *
                  </Label>
                  <Input
                    id="familyName"
                    value={formData.familyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, familyName: e.target.value }))}
                    placeholder="የአባት ስም ያስገቡ"
                    className="amharic-text"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="amharic-text">
                  ስልክ ቁጥር *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="ስልክ ቁጥር ያስገቡ"
                  className="amharic-text"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="amharic-text">
                  አድራሻ *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="አድራሻ ያስገቡ"
                  className="amharic-text"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="amharic-text">
                  ፎቶ
                </Label>
                <div className="flex items-center space-x-4">
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="amharic-text"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    ፎቶ ይምረጡ
                  </Button>
                  {formData.photo && (
                    <img
                      src={formData.photo || "/placeholder.svg"}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="amharic-text">እየተመዘገበ ነው...</span>
                ) : (
                  <span className="amharic-text">ተማሪ መዝግብ</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
