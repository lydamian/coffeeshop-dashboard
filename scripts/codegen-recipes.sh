#!/bin/bash

# Create a temporary file to store the drink data
cat << EOF > drinks_data.json
[
  {
    "name": "Cappuccino",
    "key": "cappuccino",
    "description": "Equal parts espresso, steamed milk, and milk foam, often dusted with cocoa powder",
    "ingredients": "Espresso, steamed milk, milk foam",
    "tags": ["frothy", "Italian", "breakfast"],
    "category": "Coffee"
  },
  {
    "name": "Latte",
    "key": "latte",
    "description": "Espresso with steamed milk and a small layer of milk foam on top",
    "ingredients": "Espresso, steamed milk, milk foam",
    "tags": ["creamy", "mild", "popular"],
    "category": "Coffee"
  },
  {
    "name": "Americano",
    "key": "americano",
    "description": "Espresso diluted with hot water, similar strength to drip coffee but different flavor profile",
    "ingredients": "Espresso, hot water",
    "tags": ["diluted", "smooth", "simple"],
    "category": "Coffee"
  },
  {
    "name": "Lychee Espresso Tonic",
    "key": "lychee-espresso-tonic",
    "description": "A refreshing blend of espresso, tonic water, and lychee syrup over ice",
    "ingredients": "Espresso, tonic water, lychee syrup, ice",
    "tags": ["refreshing", "unique", "summer"],
    "category": "Signature Drinks"
  },
  {
    "name": "Vanilla Latte",
    "key": "vanilla-latte",
    "description": "A latte flavored with vanilla syrup for a sweet and aromatic taste",
    "ingredients": "Espresso, steamed milk, vanilla syrup",
    "tags": ["sweet", "aromatic", "popular"],
    "category": "Signature Drinks"
  },
  {
    "name": "Black Sugar Latte",
    "key": "black-sugar-latte",
    "description": "A latte sweetened with black sugar syrup for a rich, caramel-like flavor",
    "ingredients": "Espresso, steamed milk, black sugar syrup",
    "tags": ["sweet", "rich", "caramel"],
    "category": "Signature Drinks"
  },
  {
    "name": "Tie Guan Yin Fruit Tea",
    "key": "tie-guan-yin-fruit-tea",
    "description": "Oolong tea infused with mixed fruits for a refreshing and fragrant drink",
    "ingredients": "Tie Guan Yin tea, mixed fruits, ice",
    "tags": ["refreshing", "fruity", "iced"],
    "category": "Non Coffee"
  },
  {
    "name": "Black Sugar Hojicha Latte",
    "key": "black-sugar-hojicha-latte",
    "description": "Roasted green tea latte sweetened with black sugar syrup",
    "ingredients": "Hojicha tea, steamed milk, black sugar syrup",
    "tags": ["roasted", "sweet", "Japanese-inspired"],
    "category": "Non Coffee"
  },
  {
    "name": "Berry Fizz",
    "key": "berry-fizz",
    "description": "A sparkling mixed berry drink, perfect for a refreshing non-caffeinated option",
    "ingredients": "Mixed berry syrup, soda water, ice",
    "tags": ["refreshing", "fruity", "sparkling"],
    "category": "Non Coffee"
  },
  {
    "name": "Matcha Latte",
    "key": "matcha-latte",
    "description": "Finely ground green tea whisked with steamed milk for a smooth, earthy drink",
    "ingredients": "Matcha powder, steamed milk",
    "tags": ["earthy", "Japanese", "antioxidant-rich"],
    "category": "Matcha"
  },
  {
    "name": "Zesty Matcha Latte",
    "key": "zesty-matcha-latte",
    "description": "Matcha latte with a hint of citrus zest for a bright, refreshing twist",
    "ingredients": "Matcha powder, steamed milk, citrus zest",
    "tags": ["zesty", "refreshing", "unique"],
    "category": "Matcha"
  },
  {
    "name": "Jasmine Matcha Latte",
    "key": "jasmine-matcha-latte",
    "description": "A fragrant blend of matcha and jasmine tea with steamed milk",
    "ingredients": "Matcha powder, jasmine tea, steamed milk",
    "tags": ["floral", "aromatic", "soothing"],
    "category": "Matcha"
  },
  {
    "name": "Tie Guan Yin",
    "key": "tie-guan-yin",
    "description": "A premium oolong tea known for its orchid-like aroma and smooth taste",
    "ingredients": "Tie Guan Yin tea leaves, hot water",
    "tags": ["oolong", "floral", "premium"],
    "category": "Loose leaf tea"
  },
  {
    "name": "Jasmine Jixuan",
    "key": "jasmine-jixuan",
    "description": "A delicate green tea scented with jasmine flowers",
    "ingredients": "Jasmine Jixuan tea leaves, hot water",
    "tags": ["floral", "aromatic", "soothing"],
    "category": "Loose leaf tea"
  },
  {
    "name": "High Mountain Oolong Tea",
    "key": "high-mountain-oolong-tea",
    "description": "A light, floral oolong tea grown at high altitudes for superior flavor",
    "ingredients": "High mountain oolong tea leaves, hot water",
    "tags": ["floral", "light", "premium"],
    "category": "Loose leaf tea"
  },
  {
    "name": "Banana Milk",
    "key": "banana-milk",
    "description": "A sweet and creamy banana-flavored milk drink, perfect for kids",
    "ingredients": "Milk, banana syrup",
    "tags": ["sweet", "creamy", "kid-friendly"],
    "category": "For kids"
  },
  {
    "name": "Strawberry Milk",
    "key": "strawberry-milk",
    "description": "A pink, fruity milk drink that's a favorite among children",
    "ingredients": "Milk, strawberry syrup",
    "tags": ["sweet", "fruity", "kid-friendly"],
    "category": "For kids"
  },
  {
    "name": "Milk",
    "key": "milk",
    "description": "Pure, cold milk served as a refreshing and nutritious drink",
    "ingredients": "Milk",
    "tags": ["simple", "nutritious", "kid-friendly"],
    "category": "For kids"
  }
]
EOF

# Function to create content.mdx file
create_content_mdx() {
  local name=$1
  local key=$2
  local description=$3
  local ingredients=$4
  local tags=$5
  local category=$6

  cat << EOF > "$key/content.mdx"
'use client';

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

# How to Prepare $name at RU Coffee Bar

$description

## $name Calculator

export const ${name}Calculator = () => {
  const [mainIngredient, setMainIngredient] = useState(30);
  const [secondaryIngredient, setSecondaryIngredient] = useState(30);
  const [totalVolume, setTotalVolume] = useState(60);

  useEffect(() => {
    setTotalVolume(mainIngredient + secondaryIngredient);
  }, [mainIngredient, secondaryIngredient]);

  const updateValues = (type, value) => {
    switch(type) {
      case 'main':
        setMainIngredient(value);
        setSecondaryIngredient(value);
        break;
      case 'secondary':
        setSecondaryIngredient(value);
        setMainIngredient(value);
        break;
    }
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>$name Recipe Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="main-input">Main Ingredient (g):</label>
            <Input 
              id="main-input"
              type="number" 
              value={mainIngredient} 
              onChange={(e) => updateValues('main', Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="secondary-input">Secondary Ingredient (g):</label>
            <Input 
              id="secondary-input"
              type="number" 
              value={secondaryIngredient} 
              onChange={(e) => updateValues('secondary', Number(e.target.value))}
            />
          </div>
        </div>
        <p className="mt-4">Total Volume: {totalVolume}ml</p>
      </CardContent>
    </Card>
  )
}

<${name}Calculator />

## Ingredients and Equipment

- $ingredients

## Steps to Prepare $name

1. **Prepare the main ingredient**
   - [Add specific steps here]

2. **Prepare the secondary ingredient**
   - [Add specific steps here]

3. **Combine and serve**
   - [Add specific steps here]

## Tips for the Perfect $name

1. **Ingredient quality**: Use high-quality ingredients for the best flavor
2. **Temperature**: Serve at the appropriate temperature for the best experience
3. **Consistency**: Practice to maintain a consistent ratio and texture

Remember, perfecting your $name is a journey. Keep experimenting and refining your technique!

</Card>
EOF
}

# Function to create page.tsx file
create_page_tsx() {
  local key=$1
  cat << EOF > "$key/page.tsx"
'use client';

import Content from './content.mdx';

export default function $(echo ${key^} | sed 's/-\\([a-z]\\)/\\U\\1/g')Page() {
  return (
    <div className="prose my-12 mx-auto">
      <Content />
    </div>
  );
}
EOF
}

# Main script
while IFS= read -r line; do
  if [[ $line =~ \"name\":\ \"([^\"]+)\" ]]; then
    name="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"key\":\ \"([^\"]+)\" ]]; then
    key="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"description\":\ \"([^\"]+)\" ]]; then
    description="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"ingredients\":\ \"([^\"]+)\" ]]; then
    ingredients="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"tags\":\ \[([^\]]+)\] ]]; then
    tags="${BASH_REMATCH[1]}"
  elif [[ $line =~ \"category\":\ \"([^\"]+)\" ]]; then
    category="${BASH_REMATCH[1]}"
    
    # Create directory and files
    mkdir -p "$key"
    create_content_mdx "$name" "$key" "$description" "$ingredients" "$tags" "$category"
    create_page_tsx "$key"
    
    # Reset variables
    name=""
    key=""
    description=""
    ingredients=""
    tags=""
    category=""
  fi
done < drinks_data.json

# Clean up temporary file
rm drinks_data.json

echo "Recipe pages generated successfully!"