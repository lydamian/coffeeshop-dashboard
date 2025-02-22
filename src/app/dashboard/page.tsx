import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import {
  navMain 
} from "@/app/dashboard/app-sidebar"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to the Dashboard
      </h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {navMain.map((navLink, index) => (
            <div className="rounded-xl" key={index}>
              <Link href={navLink?.href ?? '#'}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{navLink.name}</CardTitle>
                    <CardDescription>{''}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          ))}
        </div>
        <div className="w-full h-full rounded-xl m-auto">
            <video 
              playsInline 
              autoPlay 
              controls 
              preload="metadata" 
              // poster="//rucoffeebar.com/cdn/shop/files/preview_images/Screenshot_2025-01-22_at_2.01.55_PM_1100x.png?v=1737576225"
            >
              <source src="//rucoffeebar.com/cdn/shop/videos/c/vp/fb44df615b4e40f7bfe8d917bcd3e11e/fb44df615b4e40f7bfe8d917bcd3e11e.HD-1080p-2.5Mbps-41412523.mp4?v=0" type="video/mp4" />
              {/* <img src="//rucoffeebar.com/cdn/shop/files/preview_images/Screenshot_2025-01-22_at_2.01.55_PM_1100x.png?v=1737576225" alt="Video poster" /> */}
            </video>
          </div>
    </div>
  )
}