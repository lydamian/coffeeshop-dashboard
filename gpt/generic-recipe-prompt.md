Hi I am using nextjs, typescript, tailwindcss, shadcdnui, mdx
for an internal tools app for training barista's in a specialty coffee shop
called ru coffee bar.

But please make the default values, the normal values for a specialty coffee shop in America.

Help me create a mdx file for:

I want the flow of the page to be like so..

add the header as just the 
<drink name>

then i want you to

Then add some context on the drink, feel free to add whatever you think is important for a barista to know
- but for sure include
a short description on this drink
and a tiny bit of its history for context
the ingredients that make this up
and the flavor profile
and a popularity statistic

keep this short, it should take no more than a short paragraph total

then i want you to include a calculator UI where we can see all the inputs to outputs in a ratio.
Any changes to one input should automatically trigger changes to the variables in the ratio
This is our generic component logic

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

so you can just use it like so

example!!!!
import RatioCalculator from '@/components/ratio-calculator.tsx';

export const Calculator = () => {
  const espressoRecipe = {
    title: "Espresso Recipe",
    ingredients: [
      { name: "Coffee", value: 18, unit: "g", ratio: 1 },
      { name: "Water", value: 36, unit: "ml", ratio: 2 },
      { name: "Yield", value: 30, unit: "ml", ratio: 1.67 },
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <RatioCalculator {...espressoRecipe} />
    </div>
  );
};

<Calculator />

@TODO: the actual variables are:

then I want you to include a list of all Ingredients and Equipment

then include the steps to actually make the drink


then include any common troubleshooting steps