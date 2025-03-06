'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const savedState = localStorage.getItem('speedRunState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setSpeedRunState(parsedState);
      if (parsedState.startTime && !parsedState.endTime) {
        // Resume timer if speed run was in progress
        const interval = setInterval(() => {
          setElapsedTime(Math.floor((Date.now() - parsedState.startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
    if (speedRunState) {
      localStorage.setItem('speedRunState', JSON.stringify(speedRunState));
    }
  }, [speedRunState]);

  useEffect(() => {
    if (speedRunState && speedRunState.startTime && !speedRunState.endTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - speedRunState.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
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
    setElapsedTime(0);
  };

  const selectRandomDrinks = (count: number): SpeedRunDrink[] => {
    // filter out syrups
    const filteredDrinks = drinks.filter(d => !d.tags.includes('syrup'));
    const shuffled = [...filteredDrinks].sort(() => 0.5 - Math.random());
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
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                  <p>Total Time: {formatTime(Math.floor(stats.totalTime / 1000))}</p>
                  <p>Completed Drinks: {stats.completedCount} / {stats.totalCount}</p>
                  <p>Average Time: {formatTime(Math.floor(stats.avg / 1000))}</p>
                  <p>75th Percentile: {formatTime(Math.floor(stats.p75 / 1000))}</p>
                  <p>90th Percentile: {formatTime(Math.floor(stats.p90 / 1000))}</p>
                  <p>95th Percentile: {formatTime(Math.floor(stats.p95 / 1000))}</p>
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
                    Elapsed: {formatTime(Math.floor((drink.finishedAt! - drink.startedAt!) / 1000))}
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
            <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            {speedRunState.drinks.map((drink, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-grow pr-4">
                    <CardTitle>
                      <Link target="_blank" href={`/recipes/${drink.drink.key}`}>
                        {drink.drink.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-gray-500">{drink.drink.description}</p>
                    {drink.finishedAt && (
                      <p className="text-sm font-semibold">
                        Elapsed: {formatTime(Math.floor((drink.finishedAt - (drink.startedAt || speedRunState.startTime!)) / 1000))}
                      </p>
                    )}
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