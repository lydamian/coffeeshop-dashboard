# Brainstorm
Lets make a initial dashboard
then lets make a recipes/*
then lets make menu/*

then lets make a section for tools


## Install nextjs and tailwindcss and shadcdn
npx create-next-app@canary --tailwind --eslint --typescript --app


npx shadcn@canary init

npx shadcn@canary add

git remote add origin https://github.com/lydamian/coffeeshop-dashboard.git

Good online recipes https://us.jura.com/en/about-coffee/coffee-recipes

## Speed run flow prompt
so basically
inputs are
- timer
- how many drinks you want to practice - N
- when you click submit it selects N random drinks from the input above,
and creates a list view where it shows the drink it wants you to make and a check mark button
when you click a check mark button it means you finished it, and that state should be reflected in the UI, also after pressing the checkmark button it should show the elapsed time
since you made your last drink (the last checkmark) or when we started the timer if none

After selecting the last drink or clicking a Done button it will display an aggregrate of the results
- average time it took to make each drinks
- any drinks we were not able to make
- total time
- and a list of how long each drink it took to make

i am using tailwindcss, shadcdnui and nextjs.

given the below data help me generate the above code

## Create menu prompt

convert this list of drinks into a json in a array of objects format of
like

[
  {
    name: 'drink name',
    key: 'same as above but in kebab case, we will use this for the url',
    description: 'a short description of the drink',
    ingredients: 'what its made of'
    tags: ['an array of strings describing ways to describe this'],
    category: 'a drink can belong in many categories but only one should be selected
    that best describes it. We will use this in the menu to organize drinks under'
  }
]

valid categories should be:
'Coffee' | 'For kids', | 'Pourover' | 'Signature Drinks' | 'Non Coffee' | 'Matcha'
'Loose leaf tea'

for any fields that aren't filled in or provded from my content below, please
fill them in with your best guess as an LLM for what those values should be


Coffee
Espresso
Cortado
Cappuccino
Latte
Americano
Lychee Espresso Tonic

Pourover

Signature Drinks
Vanilla Latte
Black Sugar Latte


Non Coffee
Tie Guan Yin Fruit Tea
Black Sugar Hojicha Latte
Berry Fizz

Matcha
Matcha Latte
Zesty Matcha Latte
Jasmine Matcha Latte

Loose Leaf Tea
Tie Guan Yin
Jasmine Jixuan
High Mountain Oolong Tea

Kids
Banana Milk
Strawberry Milk
Milk


