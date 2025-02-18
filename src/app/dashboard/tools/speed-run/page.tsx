'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react';
import drinksData from '@/data/drinks.json';

interface Drink {
  name: string;
  key: string;
  description: string;
  ingredients: string;
  tags: string[];
  category: string;
}

interface DrinkResult {
  name: string;
  timeTaken: number;
}

interface SpeedrunState {
  timer: number;
  numDrinks: number;
  selectedDrinks: Drink[];
  completedDrinks: boolean[];
  isRunning: boolean;
  lastCheckTime: number;
  results: DrinkResult[];
}

const STORAGE_KEY = 'drinkSpeedrunState';

const DrinkSpeedrun: React.FC = () => {
  const [state, setState] = useState<SpeedrunState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
    return {
      timer: 0,
      numDrinks: 5,
      selectedDrinks: [],
      completedDrinks: [],
      isRunning: false,
      lastCheckTime: 0,
      results: [],
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRunning) {
      interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timer: prevState.timer + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const startSpeedrun = () => {
    const shuffled = [...drinksData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, state.numDrinks);
    setState({
      ...state,
      selectedDrinks: selected,
      completedDrinks: new Array(selected.length).fill(false),
      isRunning: true,
      timer: 0,
      lastCheckTime: 0,
      results: [],
    });
  };

  const checkDrink = (index: number) => {
    if (state.completedDrinks[index]) return;

    const timeTaken = state.timer - state.lastCheckTime;
    const newResults = [...state.results, { name: state.selectedDrinks[index].name, timeTaken }];
    const newCompletedDrinks = [...state.completedDrinks];
    newCompletedDrinks[index] = true;

    setState({
      ...state,
      results: newResults,
      completedDrinks: newCompletedDrinks,
      lastCheckTime: state.timer,
    });

    if (newResults.length === state.selectedDrinks.length) {
      setState(prevState => ({ ...prevState, isRunning: false }));
    }
  };

  const finishSpeedrun = () => {
    const unfinishedDrinks = state.selectedDrinks.filter((_, index) => !state.completedDrinks[index]);
    const newResults = [
      ...state.results,
      ...unfinishedDrinks.map(drink => ({ name: drink.name, timeTaken: 0 }))
    ];

    setState(prevState => ({
      ...prevState,
      isRunning: false,
      results: newResults,
      completedDrinks: new Array(prevState.selectedDrinks.length).fill(true),
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    const totalTime = state.results.reduce((sum, result) => sum + result.timeTaken, 0);
    const averageTime = totalTime / state.results.length;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Time: {formatTime(totalTime)}</p>
          <p>Average Time per Drink: {formatTime(Math.round(averageTime))}</p>
          <h3 className="font-bold mt-2">Time per Drink:</h3>
          <ul>
            {state.results.map((result, index) => (
              <li key={index}>
                {result.name}: {result.timeTaken === 0 ? 'Not completed' : formatTime(result.timeTaken)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const resetSpeedrun = () => {
    setState({
      timer: 0,
      numDrinks: 5,
      selectedDrinks: [],
      completedDrinks: [],
      isRunning: false,
      lastCheckTime: 0,
      results: [],
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drink Speedrun</h1>
      {!state.isRunning && state.results.length === 0 && (
        <div className="mb-4">
          <Input
            type="number"
            value={state.numDrinks}
            onChange={(e) => setState({...state, numDrinks: Math.max(1, Math.min(20, parseInt(e.target.value)))})}
            placeholder="Number of drinks"
            className="mb-2"
          />
          <Button onClick={startSpeedrun} className="mr-2">Start Speedrun</Button>
          <Button onClick={resetSpeedrun} variant="outline">Clear State</Button>
        </div>
      )}
      {state.isRunning && (
        <div>
          <p className="mb-2">Time: {formatTime(state.timer)}</p>
          <p className="mb-4">Time since last drink: {formatTime(state.timer - state.lastCheckTime)}</p>
          {state.selectedDrinks.map((drink, index) => (
            <Card key={drink.key} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {drink.name}
                  {state.completedDrinks[index] && <CheckCircle className="text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{drink.description}</p>
                <Button 
                  onClick={() => checkDrink(index)} 
                  className="mt-2" 
                  disabled={state.completedDrinks[index]}
                >
                  Complete
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button onClick={finishSpeedrun} className="mt-4">Finish Speedrun</Button>
        </div>
      )}
      {!state.isRunning && state.results.length > 0 && (
        <>
          {calculateResults()}
          <Button onClick={resetSpeedrun} className="mt-4">Start New Speedrun</Button>
        </>
      )}
    </div>
  );
};

export default DrinkSpeedrun;