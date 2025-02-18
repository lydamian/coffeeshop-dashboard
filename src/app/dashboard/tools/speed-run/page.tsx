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

const feedbackMessages = [
  {
    type: 'excellent',
    message: "Outstanding job! You completed all drinks quickly and efficiently. Your speed and consistency are impressive!"
  },
  {
    type: 'veryGood',
    message: "Great work! You maintained a solid pace throughout the speedrun. Keep up the good work!"
  },
  {
    type: 'good',
    message: "Good job! You completed all drinks in a timely manner. There's still room for improvement, but you're doing well."
  },
  {
    type: 'average',
    message: "Not bad! You completed the speedrun, but there's definitely room for improvement. Focus on maintaining a consistent pace."
  },
  {
    type: 'slowStart',
    message: "You had a slow start, but picked up the pace towards the end. Try to maintain that energy throughout next time!"
  },
  {
    type: 'slowFinish',
    message: "You started strong but slowed down towards the end. Work on maintaining your initial pace throughout the entire speedrun."
  },
  {
    type: 'inconsistent',
    message: "Your pace was quite inconsistent. Try to find a rhythm and stick to it for better overall performance."
  },
  {
    type: 'incomplete',
    message: "You didn't complete all the drinks. Remember, speed is important, but so is finishing each task. Keep practicing!"
  },
  {
    type: 'slow',
    message: "You struggled and took too long. Focus on working a bit faster and try to complete each drink more efficiently."
  }
];

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
  };

  const finishSpeedrun = () => {
    const unfinishedDrinks = state.selectedDrinks.filter((_, index) => !state.completedDrinks[index]);
    const newResults = [
      ...state.results,
      ...unfinishedDrinks.map(drink => ({ name: drink.name, timeTaken: state.timer }))
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

  const getFeedback = (results: DrinkResult[], totalTime: number, numDrinks: number) => {
    const completedDrinks = results.filter(r => r.timeTaken < totalTime);
    const averageTime = totalTime / numDrinks;
    const standardDeviation = Math.sqrt(results.reduce((sum, r) => sum + Math.pow(r.timeTaken - averageTime, 2), 0) / numDrinks);

    if (completedDrinks.length < numDrinks) {
      return feedbackMessages.find(f => f.type === 'incomplete')!.message;
    }

    if (averageTime < 30 && standardDeviation < 5) {
      return feedbackMessages.find(f => f.type === 'excellent')!.message;
    }

    if (averageTime < 45 && standardDeviation < 10) {
      return feedbackMessages.find(f => f.type === 'veryGood')!.message;
    }

    if (averageTime < 60) {
      return feedbackMessages.find(f => f.type === 'good')!.message;
    }

    if (standardDeviation > 20) {
      return feedbackMessages.find(f => f.type === 'inconsistent')!.message;
    }

    const firstHalfAvg = results.slice(0, Math.floor(numDrinks / 2)).reduce((sum, r) => sum + r.timeTaken, 0) / Math.floor(numDrinks / 2);
    const secondHalfAvg = results.slice(Math.floor(numDrinks / 2)).reduce((sum, r) => sum + r.timeTaken, 0) / (numDrinks - Math.floor(numDrinks / 2));

    if (firstHalfAvg > secondHalfAvg * 1.3) {
      return feedbackMessages.find(f => f.type === 'slowStart')!.message;
    }

    if (secondHalfAvg > firstHalfAvg * 1.3) {
      return feedbackMessages.find(f => f.type === 'slowFinish')!.message;
    }

    if (averageTime < 90) {
      return feedbackMessages.find(f => f.type === 'average')!.message;
    }

    return feedbackMessages.find(f => f.type === 'slow')!.message;
  };

  const calculateResults = () => {
    const totalTime = state.timer;
    const averageTime = totalTime / state.numDrinks;
    const feedback = getFeedback(state.results, totalTime, state.numDrinks);

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-lg mb-4">{feedback}</p>
          <p>Total Time: {formatTime(totalTime)}</p>
          <p>Average Time per Drink: {formatTime(Math.round(averageTime))}</p>
          <h3 className="font-bold mt-2">Time per Drink:</h3>
          <ul>
            {state.results.map((result, index) => (
              <li key={index}>
                {result.name}: {result.timeTaken === state.timer ? 'Not completed' : formatTime(result.timeTaken)}
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