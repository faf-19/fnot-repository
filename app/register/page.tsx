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
import { ThemeToggle } from "@/components/theme-toggle"
import { studentsApi } from "@/lib/api"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWarning("")
    setIsSubmitting(true)

    try {
      const studentData = {
        ...formData,
        age: Number.parseInt(formData.age),
      }

      const result = await studentsApi.create(studentData)

      if (result.success) {
        router.push("/students")
      } else {
        setWarning(result.error || "የተማሪ መመዝገቢያ ሂደት አልተሳካም።")
      }
    } catch (error) {
      console.error("Error creating student:", error)
      setWarning("የተማሪ መመዝገቢያ ሂደት አልተሳካም። እባክዎ እንደገና ይሞክሩ።")
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="amharic-text">ወደ ቤት ገጽ</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white amharic-text">አዲስ ተማሪ መመዝገቢያ ቅፅ</h1>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="amharic-text dark:text-white">የተማሪ መረጃ</CardTitle>
            <CardDescription className="amharic-text dark:text-gray-300">እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ</CardDescription>
          </CardHeader>
          <CardContent>
            {warning && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-300 amharic-text">{warning}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="amharic-text dark:text-gray-200">
                    ስም *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="ሙሉ ስም ያስገቡ"
                    className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spiritualName" className="amharic-text dark:text-gray-200">
                    የክርስትና ስም *
                  </Label>
                  <Input
                    id="spiritualName"
                    value={formData.spiritualName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, spiritualName: e.target.value }))}
                    placeholder="የክርስትና ስም ያስገቡ"
                    className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex" className="amharic-text dark:text-gray-200">
                    ፆታ *
                  </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                  >
                    <SelectTrigger className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="ፆታ ይምረጡ" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="ወንድ" className="amharic-text dark:text-white">
                        ወንድ
                      </SelectItem>
                      <SelectItem value="ሴት" className="amharic-text dark:text-white">
                        ሴት
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="amharic-text dark:text-gray-200">
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
                    className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class" className="amharic-text dark:text-gray-200">
                    ክፍል *
                  </Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
                    placeholder="ክፍል ያስገቡ"
                    className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyName" className="amharic-text dark:text-gray-200">
                    የወላጅ ስም *
                  </Label>
                  <Input
                    id="familyName"
                    value={formData.familyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, familyName: e.target.value }))}
                    placeholder="የወላጅ ስም ያስገቡ"
                    className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="amharic-text dark:text-gray-200">
                  ስልክ ቁጥር *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="ስልክ ቁጥር ያስገቡ"
                  className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="amharic-text dark:text-gray-200">
                  አድራሻ *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="አድራሻ ያስገቡ"
                  className="amharic-text dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo" className="amharic-text dark:text-gray-200">
                  ፎቶ
                </Label>
                <div className="flex items-center space-x-4">
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className="amharic-text dark:border-gray-600 dark:text-gray-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    ፎቶ ይምረጡ
                  </Button>
                  {formData.photo && (
                    <img
                      src={formData.photo || "/placeholder.svg"}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border dark:border-gray-600"
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
