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

then i want you to include a calculator UI where we can see all the inputs to outputs in a ratio.
Any changes to one input should automatically trigger changes to the variables in the ratio
This is our generic component logic

so you can just use it like so

example!!!!
import RatioCalculator from '@/components/ratio-calculator.tsx';

const CoffeeRecipePage = () => {
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

export default CoffeeRecipePage;

then I want you to include a list of all Ingredients and Equipment

then include the steps to actually make the drink


then include any common troubleshooting steps