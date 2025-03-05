'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import drinks from '@/data/drinks.json';

interface Drink {
  name: string;
  key: string;
  description: string;
  ingredients: string;
  tags: string[];
  category: string;
  icon: string;
}

interface SpeedRunDrink {
  drink: Drink;
  startedAt: number | null;
  finishedAt: number | null;
}

interface Barista {
  name: string;
  timer: number;
}

interface SpeedRunState {
  drinks: SpeedRunDrink[];
  baristas: Barista[];
  startTime: number | null;
  endTime: number | null;
}

export default function SpeedRun() {
  const [numDrinks, setNumDrinks] = useState(5);
  const [baristaNames, setBaristaNames] = useState('');
  const [speedRunState, setSpeedRunState] = useState<SpeedRunState | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('speedRunState');
    if (savedState) {
      setSpeedRunState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    if (speedRunState) {
      localStorage.setItem('speedRunState', JSON.stringify(speedRunState));
    }
  }, [speedRunState]);

  const startSpeedRun = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDrinks = selectRandomDrinks(numDrinks);
    const baristas = baristaNames.split(',').map(name => ({ name: name.trim(), timer: 0 }));
    const newState: SpeedRunState = {
      drinks: selectedDrinks,
      baristas,
      startTime: Date.now(),
      endTime: null,
    };
    setSpeedRunState(newState);
  };

  const selectRandomDrinks = (count: number): SpeedRunDrink[] => {
    const shuffled = [...drinks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(drink => ({
      drink,
      startedAt: null,
      finishedAt: null,
    }));
  };

  const markDrinkAsFinished = (index: number) => {
    if (!speedRunState) return;

    const updatedDrinks = [...speedRunState.drinks];
    const lastFinishedDrink = updatedDrinks.reduce((latest, drink) => 
      drink.finishedAt && (!latest || drink.finishedAt > latest.finishedAt) ? drink : latest
    , null as SpeedRunDrink | null);

    const now = Date.now();
    updatedDrinks[index] = {
      ...updatedDrinks[index],
      startedAt: lastFinishedDrink ? lastFinishedDrink.finishedAt : speedRunState.startTime,
      finishedAt: now,
    };

    setSpeedRunState({
      ...speedRunState,
      drinks: updatedDrinks,
    });
  };

  const unmarkDrinkAsFinished = (index: number) => {
    if (!speedRunState) return;

    const updatedDrinks = [...speedRunState.drinks];
    updatedDrinks[index] = {
      ...updatedDrinks[index],
      startedAt: null,
      finishedAt: null,
    };

    setSpeedRunState({
      ...speedRunState,
      drinks: updatedDrinks,
    });
  };

  const finishSpeedRun = () => {
    if (!speedRunState) return;

    setSpeedRunState({
      ...speedRunState,
      endTime: Date.now(),
    });
  };

  const calculateStats = (state: SpeedRunState) => {
    const finishedDrinks = state.drinks.filter(d => d.finishedAt);
    const totalTime = state.endTime! - state.startTime!;
    const completedCount = finishedDrinks.length;
    const totalCount = state.drinks.length;

    const elapsedTimes = finishedDrinks.map(d => d.finishedAt! - d.startedAt!).sort((a, b) => a - b);
    const avg = elapsedTimes.reduce((sum, time) => sum + time, 0) / elapsedTimes.length;
    const p75 = elapsedTimes[Math.floor(elapsedTimes.length * 0.75)];
    const p90 = elapsedTimes[Math.floor(elapsedTimes.length * 0.90)];
    const p95 = elapsedTimes[Math.floor(elapsedTimes.length * 0.95)];

    return { totalTime, completedCount, totalCount, avg, p75, p90, p95 };
  };

  const resetSpeedRun = () => {
    setSpeedRunState(null);
    setNumDrinks(5);
    setBaristaNames('');
  };

  return (
    <div className="container mx-auto p-4">
      {!speedRunState ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Speed Run</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={startSpeedRun} className="space-y-4">
              <Input
                type="number"
                value={numDrinks}
                onChange={(e) => setNumDrinks(parseInt(e.target.value))}
                placeholder="Number of drinks"
              />
              <Input
                value={baristaNames}
                onChange={(e) => setBaristaNames(e.target.value)}
                placeholder="Barista names (comma-separated)"
              />
              <Button type="submit">Start Speed Run</Button>
            </form>
          </CardContent>
        </Card>
      ) : speedRunState.endTime ? (
        <Card>
          <CardHeader>
            <CardTitle>Speed Run Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const stats = calculateStats(speedRunState);
              return (
                <div>
                  <p>Total Time: {(stats.totalTime / 1000).toFixed(2)} seconds</p>
                  <p>Completed Drinks: {stats.completedCount} / {stats.totalCount}</p>
                  <p>Average Time: {(stats.avg / 1000).toFixed(2)} seconds</p>
                  <p>75th Percentile: {(stats.p75 / 1000).toFixed(2)} seconds</p>
                  <p>90th Percentile: {(stats.p90 / 1000).toFixed(2)} seconds</p>
                  <p>95th Percentile: {(stats.p95 / 1000).toFixed(2)} seconds</p>
                </div>
              );
            })()}
            <h3 className="text-xl font-bold">Drink Details</h3>
            <ul className="space-y-2">
              {speedRunState.drinks
                .filter(d => d.finishedAt)
                .sort((a, b) => a.finishedAt! - b.finishedAt!)
                .map((drink, index) => (
                  <li key={index}>
                    {drink.drink.name} - Started: {new Date(drink.startedAt!).toLocaleTimeString()}, 
                    Finished: {new Date(drink.finishedAt!).toLocaleTimeString()}, 
                    Elapsed: {((drink.finishedAt! - drink.startedAt!) / 1000).toFixed(2)} seconds
                  </li>
                ))}
            </ul>
            <Button onClick={resetSpeedRun}>Start New Speed Run</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Active Speed Run</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {speedRunState.drinks.map((drink, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-grow pr-4">
                    <CardTitle>{drink.drink.name}</CardTitle>
                    <p className="text-sm text-gray-500">{drink.drink.description}</p>
                  </div>
                  <div
                    className="flex-shrink-0 w-16 h-16 flex items-center justify-center cursor-pointer"
                    onClick={() => drink.finishedAt ? unmarkDrinkAsFinished(index) : markDrinkAsFinished(index)}
                  >
                    {drink.finishedAt ? 
                      <CheckCircleIcon className="w-12 h-12 text-green-500" /> : 
                      <ClockIcon className="w-12 h-12 text-blue-500" />
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button onClick={finishSpeedRun}>Finish Speed Run</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}