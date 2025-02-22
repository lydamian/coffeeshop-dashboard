
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Belleza, Inter } from 'next/font/google'
import drinksData from '@/data/drinks.json';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const belleza = Belleza({
  weight: '400',
  subsets: ['latin'],
})

const Menu: React.FC = () => {
  const categories = drinksData.reduce((acc, item) => {
    if (!acc.includes(item.category.toLowerCase())) {
      acc.push(item.category.toLowerCase());
    }
    return acc;
  }, [] as string[]);

  return (
    <div className={`bg-[#d6d3cd] text-[#483017] min-h-screen p-8 ${inter.className}`}>
      <header className="mb-12 text-center">
        <Image
          src="/ru-logo.png"
          alt="ru. Coffee Bar"
          width={100}
          height={50}
          className="mx-auto mb-2"
        />
        <h1 className={`text-xl ${belleza.className}`}>COFFEE BAR</h1>
      </header>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className={`text-4xl font-bold mb-4 ${belleza.className}`}>{category}</h2>
            {drinksData
              .filter(item => item.category.toLowerCase() === category)
              .map(item => (
                <div key={item.key} className="mb-4">
                  <h3 className={`text-base font-semibold ${inter.className}`}>{item.name}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="">
      <Menu />
    </div>
    );
}
