"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Calendar, List, BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 amharic-text">
              የተማሪ መመዝገቢያ እና መገኘት መቁጠሪያ ስርዓት
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 amharic-text">
              የእሁድ ትምህርት ቤት ተማሪዎች መመዝገቢያ እና መገኘት መከታተያ ስርዓት
            </p>
          </div>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/register">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <UserPlus className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                <CardTitle className="amharic-text dark:text-white">አዲስ ተማሪ መመዝገቢያ</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">አዲስ ተማሪ ለመመዝገብ</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/students">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 mb-2" />
                <CardTitle className="amharic-text dark:text-white">የተመዘገቡ ተማሪዎች</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">ሁሉንም ተማሪዎች ለማየት</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/attendance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                <CardTitle className="amharic-text dark:text-white">መገኘት መቁጠሪያ</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">የተማሪዎች መገኘት ለመቁጠር</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/groups">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <List className="w-12 h-12 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
                <CardTitle className="amharic-text dark:text-white">የእድሜ ቡድኖች</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">በእድሜ የተከፋፈሉ ቡድኖች</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/attendance-stats">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-2" />
                <CardTitle className="amharic-text dark:text-white">የመገኘት ስታቲስቲክስ</CardTitle>
                <CardDescription className="amharic-text dark:text-gray-300">የተማሪዎች መገኘት ትንተና</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 amharic-text dark:text-white">የእድሜ ቡድን ክፍፍል</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 amharic-text">ቡድን ሀ</h3>
              <p className="text-blue-600 dark:text-blue-400 amharic-text">4-6 ዓመት</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-300 amharic-text">ቡድን ለ</h3>
              <p className="text-green-600 dark:text-green-400 amharic-text">7-10 ዓመት</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border dark:border-purple-800">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 amharic-text">ቡድን ሐ</h3>
              <p className="text-purple-600 dark:text-purple-400 amharic-text">11-14 ዓመት</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border dark:border-orange-800">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300 amharic-text">ቡድን መ</h3>
              <p className="text-orange-600 dark:text-orange-400 amharic-text">15-18 ዓመት</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
