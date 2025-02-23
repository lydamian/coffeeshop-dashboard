'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface Ingredient {
  name: string;
  value: number;
  unit: string;
  ratio: number;
}

interface RatioCalculatorProps {
  title: string;
  ingredients: Ingredient[];
}

const RatioCalculator: React.FC<RatioCalculatorProps> = ({ title, ingredients }) => {
  const [values, setValues] = useState<{ [key: string]: number }>(
    ingredients.reduce((acc, ingredient) => ({ ...acc, [ingredient.name]: ingredient.value }), {})
  );

  const updateValues = (changedIngredient: string, newValue: number) => {
    const updatedValues = { ...values, [changedIngredient]: newValue };
    const baseIngredient = ingredients.find(i => i.name === changedIngredient);

    if (baseIngredient) {
      ingredients.forEach(ingredient => {
        if (ingredient.name !== changedIngredient) {
          updatedValues[ingredient.name] = (newValue / baseIngredient.ratio) * ingredient.ratio;
        }
      });
    }

    setValues(updatedValues);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map(ingredient => (
          <div key={ingredient.name}>
            <Label htmlFor={ingredient.name}>{ingredient.name}</Label>
            <Input
              id={ingredient.name}
              type="number"
              value={values[ingredient.name].toFixed(2)}
              onChange={e => updateValues(ingredient.name, parseFloat(e.target.value))}
              className="mt-1"
            />
            <span className="text-sm text-gray-500 ml-2">{ingredient.unit}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RatioCalculator;