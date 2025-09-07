// This file contains functions to enhance the Tidio chatbot integration
// with recipe data and improve user experience

/**
 * Tidio Chatbot Enhancement Module
 * 
 * This module provides functionality to improve the Tidio chatbot experience
 * by adding recipe data, training responses, and customizing appearance.
 */

// Common recipe data that can be used by the chatbot
const recipeData = {
  // Breakfast recipes
  "avocado toast": {
    pl: "Tost z awokado: rozgnieć dojrzałe awokado, dopraw sokiem z cytryny, solą i pieprzem. Rozsmaruj na opieczonej grzance i udekoruj mikroziołami.",
    en: "Avocado toast: mash ripe avocado, season with lemon juice, salt and pepper. Spread on toasted bread and garnish with microgreens."
  },
  "pancakes": {
    pl: "Naleśniki: wymieszaj 1 szklankę mąki, 2 jajka, 1 szklankę mleka i 2 łyżki rozpuszczonego masła. Smaż na patelni po 2 minuty z każdej strony.",
    en: "Pancakes: mix 1 cup flour, 2 eggs, 1 cup milk, and 2 tbsp melted butter. Cook in a pan for 2 minutes each side."
  },
  
  // Main course recipes
  "risotto": {
    pl: "Risotto grzybowe: podsmaż cebulę i czosnek, dodaj ryż arborio, podlej bulionem stopniowo mieszając, dodaj podsmażone grzyby i parmezan na koniec.",
    en: "Mushroom risotto: sauté onion and garlic, add arborio rice, gradually add broth while stirring, add sautéed mushrooms and parmesan at the end."
  },
  "pasta": {
    pl: "Domowy makaron: wymieszaj 2 szklanki mąki z 3 jajkami i szczyptą soli, wyrób ciasto, rozwałkuj i pokrój w pożądany kształt. Gotuj 2-3 minuty.",
    en: "Homemade pasta: mix 2 cups flour with 3 eggs and a pinch of salt, knead the dough, roll out and cut into desired shape. Cook for 2-3 minutes."
  },
  
  // Dessert recipes
  "cheesecake": {
    pl: "Sernik: zmiksuj 1kg twarogu z 1 szklanką cukru i 4 jajkami, wylej na spód z pokruszonych ciastek, piecz w 160°C przez 50 minut.",
    en: "Cheesecake: mix 2lb cream cheese with 1 cup sugar and 4 eggs, pour over a cookie crumb base, bake at 320°F for 50 minutes."
  },
  "brownies": {
    pl: "Brownie czekoladowe: rozpuść 200g czekolady z 150g masła, wymieszaj z 200g cukru i 3 jajkami, dodaj 100g mąki, piecz 25 minut w 180°C.",
    en: "Chocolate brownies: melt 7oz chocolate with 5oz butter, mix with 7oz sugar and 3 eggs, add 3.5oz flour, bake for 25 minutes at 350°F."
  }
};

// Common cooking questions and answers
const cookingFAQ = {
  "how to store herbs": {
    pl: "Świeże zioła najlepiej przechowywać w lodówce zawinięte w wilgotny ręcznik papierowy lub w szklance z wodą jak bukiet.",
    en: "Fresh herbs are best stored in the refrigerator wrapped in a damp paper towel or in a glass of water like a bouquet."
  },
  "meat temperature": {
    pl: "Temperatury mięs: wołowina (rare: 52°C, medium: 60°C, well-done: 71°C), drób (75°C), wieprzowina (63°C).",
    en: "Meat temperatures: beef (rare: 125°F, medium: 140°F, well-done: 160°F), poultry (165°F), pork (145°F)."
  },
  "substitute for eggs": {
    pl: "Zamienniki jajek: 1/4 szklanki jogurtu lub 1/4 szklanki musu jabłkowego na 1 jajko (w wypiekach).",
    en: "Egg substitutes: 1/4 cup yogurt or 1/4 cup applesauce per egg (in baking)."
  }
};

// This function would be used to train the chatbot with recipe data
function trainChatbotWithRecipes(language) {
  // This would integrate with Tidio's API if they provide programmatic training
  console.log(`Chatbot trained with ${Object.keys(recipeData).length} recipes in ${language}`);
  
  // For demonstration purposes, this just logs the data that would be used
  return {
    recipes: recipeData,
    faq: cookingFAQ
  };
}

// Export functionality if using as a module
if (typeof module !== 'undefined') {
  module.exports = {
    recipeData,
    cookingFAQ,
    trainChatbotWithRecipes
  };
}
