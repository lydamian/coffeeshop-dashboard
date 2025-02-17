'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Assume this is imported from a separate file
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
  currentDrinkIndex: number;
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
      currentDrinkIndex: 0,
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
    setState({
      ...state,
      selectedDrinks: shuffled.slice(0, state.numDrinks),
      isRunning: true,
      currentDrinkIndex: 0,
      timer: 0,
      lastCheckTime: 0,
      results: [],
    });
  };

  const checkDrink = () => {
    const timeTaken = state.timer - state.lastCheckTime;
    const newResults = [...state.results, { name: state.selectedDrinks[state.currentDrinkIndex].name, timeTaken }];
    if (state.currentDrinkIndex < state.selectedDrinks.length - 1) {
      setState({
        ...state,
        results: newResults,
        lastCheckTime: state.timer,
        currentDrinkIndex: state.currentDrinkIndex + 1,
      });
    } else {
      setState({
        ...state,
        results: newResults,
        isRunning: false,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    const totalTime = state.results.reduce((sum, result) => sum + result.timeTaken, 0);
    const averageTime = totalTime / state.results.length;
    const unfinishedDrinks = state.selectedDrinks.slice(state.results.length);

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
              <li key={index}>{result.name}: {formatTime(result.timeTaken)}</li>
            ))}
          </ul>
          {unfinishedDrinks.length > 0 && (
            <>
              <h3 className="font-bold mt-2">Unfinished Drinks:</h3>
              <ul>
                {unfinishedDrinks.map((drink, index) => (
                  <li key={index}>{drink.name}</li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const resetSpeedrun = () => {
    setState({
      timer: 0,
      numDrinks: 5,
      selectedDrinks: [],
      currentDrinkIndex: 0,
      isRunning: false,
      lastCheckTime: 0,
      results: [],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drink Speedrun</h1>
      {!state.isRunning && state.results.length === 0 && (
        <div className="mb-4">
          <Input
            type="number"
            value={state.numDrinks}
            onChange={(e) => setState({...state, numDrinks: parseInt(e.target.value)})}
            placeholder="Number of drinks"
            className="mb-2"
          />
          <Button onClick={startSpeedrun}>Start Speedrun</Button>
        </div>
      )}
      {state.isRunning && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{state.selectedDrinks[state.currentDrinkIndex].name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{state.selectedDrinks[state.currentDrinkIndex].description}</p>
            <p className="mt-2">Time: {formatTime(state.timer)}</p>
            <p>Time since last drink: {formatTime(state.timer - state.lastCheckTime)}</p>
            <Button onClick={checkDrink} className="mt-2">Complete</Button>
          </CardContent>
        </Card>
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