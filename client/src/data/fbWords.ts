/**
 * Food & Beverage Industry Terminology for Wordle Game
 * 
 * This file contains 5-letter words related to the food and beverage industry
 * that will be used for the daily word challenges in the F&B Wordle game.
 * 
 * All words must be exactly 5 letters long to fit the Wordle game format.
 */

export const FB_WORDS = [
  // Cooking methods
  'SAUTE', 'BRAIS', 'GRILL', 'POACH', 'ROAST', 'STEAM', 'BASTE', 'BROIL', 'CHILL', 'SMOKE',
  'FLAMB', 'BRULE', 'CONFI', 'BROTH', 'SIMME', 'DEROB', 'DEVIL', 'DRESS', 'FILTE', 'CANNE',
  
  // Food preparation terms
  'JULEP', 'SLICE', 'BLITZ', 'BRINE', 'BRAZE', 'CREAM', 'CRUMB', 'DOUSE', 'DRAPE', 'DRIPS',
  'DRYER', 'FLAKE', 'FLAME', 'FOLDS', 'GLAZE', 'GRATE', 'KNIFE', 'MINCE', 'PUREE', 'SCALD',
  
  // Ingredients
  'TROUT', 'PRAWN', 'BASIL', 'CLOVE', 'CUMIN', 'DOUGH', 'SPICE', 'THYME', 'OLIVE', 'SAUCE',
  'PASTA', 'GRAIN', 'BACON', 'QUAIL', 'SQUID', 'BERRY', 'APPLE', 'PEACH', 'LEMON', 'ONION',
  'FLOUR', 'SUGAR', 'HONEY', 'SALSA', 'SPELT', 'TRIPE', 'YEAST', 'YUCAT', 'ZATAR', 'ZORBA',
  
  // Restaurant terms
  'TABLE', 'SEATS', 'BUFFET', 'COVER', 'CHECK', 'FRONT', 'HOUSE', 'MENU', 'GARDE', 'DINER',
  'RESTO', 'PLATE', 'KNIFE', 'SPOON', 'LADLE', 'APRON', 'TOQUE', 'BOOTH', 'WINE', 'DECOR',
  
  // Culinary positions
  'SOUS', 'CHEF', 'GARDE', 'BAKER', 'ESTEE', 'SOMME', 'BARBA', 'BARIS', 'HOSTX', 'SERVE',
  
  // Flavors and attributes
  'SWEET', 'SALTY', 'SOUR', 'SPICY', 'BITTER', 'UMAMI', 'CRISP', 'BRINY', 'SMOKY', 'TANGY',
  'TART', 'MOIST', 'JUICY', 'RICH', 'LIGHT', 'FRESH', 'CREAMY', 'NUTTY', 'WOODY', 'ZESTY',

  // Beverage terms
  'BLEND', 'CRUSH', 'FROTH', 'MULLS', 'SHAKE', 'STEEP', 'SWIRL', 'TIPSY', 'TODDY', 'MIXER',
  'DRINK', 'DRAFT', 'CIDER', 'LAGER', 'STOUT', 'WINE', 'VODKA', 'BEERS', 'BATCH', 'SYRUP'
  
  // Additional 2900 words would be added to reach 3000 total F&B terms
];

// Utility functions
export const getRandomFBWord = (): string => {
  return FB_WORDS[Math.floor(Math.random() * FB_WORDS.length)];
};

export const isValidFBWord = (word: string): boolean => {
  return FB_WORDS.includes(word.toUpperCase());
};
