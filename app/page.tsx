"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Calendar, List } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 amharic-text">የተማሪ መመዝገቢያ እና መገኘት መቁጠሪያ ስርዓት</h1>
          <p className="text-lg text-gray-600 amharic-text">የእሁድ ትምህርት ቤት ተማሪዎች መመዝገቢያ እና መገኘት መከታተያ ስርዓት</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/register">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <UserPlus className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="amharic-text">አዲስ ተማሪ መመዝገቢያ</CardTitle>
                <CardDescription className="amharic-text">አዲስ ተማሪ ለመመዝገብ</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/students">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <CardTitle className="amharic-text">የተመዘገቡ ተማሪዎች</CardTitle>
                <CardDescription className="amharic-text">ሁሉንም ተማሪዎች ለማየት</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/attendance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                <CardTitle className="amharic-text">መገኘት መቁጠሪያ</CardTitle>
                <CardDescription className="amharic-text">የተማሪዎች መገኘት ለመቁጠር</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="text-center">
                <List className="w-12 h-12 mx-auto text-orange-600 mb-2" />
                <CardTitle className="amharic-text">የእድሜ ቡድኖች</CardTitle>
                <CardDescription className="amharic-text">በእድሜ የተከፋፈሉ ቡድኖች</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 amharic-text">የእድሜ ቡድን ክፍፍል</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 amharic-text">ቡድን ሀ</h3>
              <p className="text-blue-600 amharic-text">4-6 ዓመት</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 amharic-text">ቡድን ለ</h3>
              <p className="text-green-600 amharic-text">7-10 ዓመት</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 amharic-text">ቡድን ሐ</h3>
              <p className="text-purple-600 amharic-text">11-14 ዓመት</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 amharic-text">ቡድን መ</h3>
              <p className="text-orange-600 amharic-text">15-18 ዓመት</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
