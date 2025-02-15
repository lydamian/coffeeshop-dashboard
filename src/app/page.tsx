import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brown-100 to-brown-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brown-800 mb-2">ru coffee bar</h1>
          <p className="text-xl text-brown-600">Internal Tools. Manage your coffee shop with ease.</p>
        </header>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome, Barista!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              You're all set up and ready to go. Click the button below to get started.
            </p>
            <div className="flex justify-center">
              <Link href="dashboard">
                <Button className="">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-brown-700">
          <p>&copy; 2025 ru coffee bar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}