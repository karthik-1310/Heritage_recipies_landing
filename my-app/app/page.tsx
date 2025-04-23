"use client"

import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
    Star, Clock, Users, ChefHat, BookOpen, MapPin, Calendar, X, Filter, Check, RefreshCw, MessageSquare, Bookmark, Share2, ArrowUp, ChevronUp, Link, Mail, Copy, Send, ChevronRight, Share // Added necessary icons
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Nunito_Sans } from 'next/font/google';

// --- Font Setup ---
const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-playfair',
});

const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-nunito-sans',
});

// --- Interfaces ---
interface Recipe { /* ... Interface definition ... */
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    difficulty: "Easy" | "Medium" | "Hard";
    diet: string[];
    image: string;
    story: string;
    culture: string;
    author: { name: string; image: string; };
    createdAt: string;
}

interface Review { /* ... Interface definition ... */
    id: string;
    recipeId: string;
    rating: number;
    comment: string;
    author: { name: string; image: string; };
    createdAt: string;
}

interface Comment { /* ... Interface definition ... */
    id: string;
    recipeId: string;
    text: string;
    author: { name: string; image: string; };
    createdAt: string;
    replies: Comment[];
}


// --- Mock Data ---
// Assuming recipeData, reviewsData, commentsData are defined as in the first code block
const recipeData: Recipe[] = [
    {
        id: "chana-masala",
        title: "Authentic Punjabi Chana Masala",
        description: "A rich and flavorful North Indian curry made with chickpeas in a spiced tomato-based gravy.",
        ingredients: [
            "2 cups dried chickpeas, soaked overnight (or 3 cans, drained)",
            "2 medium onions, finely chopped",
            "3 medium tomatoes, pureed",
            "2 tbsp ginger-garlic paste",
            "2-3 green chilies, chopped (adjust to taste)",
            "2 tbsp cooking oil or ghee",
            "1 tsp cumin seeds",
            "1 bay leaf",
            "2 tsp coriander powder",
            "1 tsp cumin powder",
            "1/2 tsp turmeric powder",
            "1 tsp red chili powder (adjust to taste)",
            "1 tsp garam masala",
            "1 tsp dried mango powder (amchur) or lemon juice",
            "Salt to taste",
            "Fresh cilantro leaves, chopped for garnish",
            "1 tsp dried fenugreek leaves (kasoori methi), crushed"
        ],
        instructions: [
            "If using dried chickpeas, soak them overnight. Drain, add fresh water and pressure cook until soft, or simmer for about 1.5 hours until tender.",
            "Heat oil or ghee in a large pot. Add cumin seeds and bay leaf, letting them sizzle for 30 seconds.",
            "Add chopped onions and sauté until golden brown, about 5-7 minutes.",
            "Add ginger-garlic paste and green chilies, cooking for another 2 minutes until aromatic.",
            "Add all dry spices (except garam masala and dried fenugreek) and stir continuously for 30 seconds.",
            "Pour in tomato puree and cook for 8-10 minutes until oil starts to separate from the masala.",
            "Add cooked chickpeas and 1 cup of water (or reserved chickpea cooking liquid), salt to taste.",
            "Simmer for 15-20 minutes, mashing some chickpeas against the side of the pot to thicken the gravy.",
            "Stir in garam masala and dried fenugreek leaves.",
            "Garnish with fresh cilantro and serve hot with rice or Indian bread."
        ],
        prepTime: "15 min (plus overnight soaking)",
        cookTime: "45 min",
        totalTime: "1 hour",
        servings: "4-6",
        difficulty: "Medium",
        diet: ["Vegetarian", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop",
        story: "Chana Masala is a beloved staple dish from Punjab in Northern India. It's a hearty vegetarian dish with deep roots in Indian culinary tradition, often served at festivals and family gatherings. The unique combination of spices creates a complex flavor profile that's both comforting and exciting. In many Punjabi households, special family variations of this recipe are passed down through generations, with each family adding their own signature touch.",
        culture: "Punjabi",
        author: { name: "Ramesh Kumar", image: "https://randomuser.me/api/portraits/men/75.jpg" },
        createdAt: "2024-09-16T10:30:00Z"
    },
    {
        id: "injera",
        title: "Traditional Ethiopian Injera",
        description: "A sourdough flatbread made from teff flour, with a slightly tangy flavor and spongy texture.",
        ingredients: [
            "2 cups teff flour (or 1 cup teff + 1 cup all-purpose flour for a milder taste)",
            "2 1/2 cups water, room temperature",
            "1/4 tsp active dry yeast (optional, for quicker fermentation)",
            "1/2 tsp salt",
            "Vegetable oil or ghee for cooking"
        ],
        instructions: [
            "In a large bowl, combine teff flour (and all-purpose flour if using) with water. Mix well until smooth with no lumps.",
            "Cover the bowl with a clean cloth and let it ferment at room temperature for 2-3 days, stirring once daily. The mixture will become bubbly and develop a sour aroma.",
            "If using yeast to speed the process, add it at the beginning and ferment for just 24 hours.",
            "After fermentation, stir in salt and add a little water if needed to achieve a thin, pourable batter consistency.",
            "Heat a non-stick skillet or traditional mitad over medium heat. Lightly oil the surface.",
            "Pour about 1/2 cup of batter onto the skillet in a spiral, starting from the outside working inward, creating a thin layer.",
            "Cover and cook for 2-3 minutes until bubbles form on the surface and the edges begin to lift.",
            "Injera is traditionally cooked only on one side - do not flip. It's done when the top is dry and the edges are fully cooked.",
            "Gently remove and place on a cloth to cool slightly before serving or stacking.",
            "Repeat with remaining batter, adding a small amount of oil between each injera if needed."
        ],
        prepTime: "15 min (plus 2-3 days fermentation)",
        cookTime: "5 min per injera",
        totalTime: "2-3 days",
        servings: "8-10 injeras",
        difficulty: "Medium",
        diet: ["Vegan", "Gluten-Free"],
        image: "https://images.unsplash.com/photo-1535400255456-984233c0b584?q=80&w=2070&auto=format&fit=crop",
        story: "Injera is the foundation of Ethiopian cuisine, serving not just as food but also as a utensil. This fermented flatbread has been a staple for centuries, with techniques passed down through generations. The unique sourdough fermentation process creates both the distinctive tangy flavor and the spongy texture with characteristic 'eyes' that perfectly absorb the rich sauces and stews of Ethiopian meals. In Ethiopian culture, sharing injera from a common plate symbolizes community and friendship.",
        culture: "Ethiopian",
        author: { name: "Alemitu Tesfaye", image: "https://randomuser.me/api/portraits/women/68.jpg" },
        createdAt: "2024-09-15T14:20:00Z"
    },
    {
        id: "spanakopita",
        title: "Classic Greek Spanakopita",
        description: "A savory pastry filled with spinach, feta cheese, and herbs, wrapped in flaky phyllo dough.",
        ingredients: [
            "1 package (16 oz) phyllo dough, thawed according to package directions",
            "2 lbs fresh spinach, washed and chopped (or 2 packages frozen spinach, thawed and drained)",
            "1 large onion, finely chopped",
            "4 cloves garlic, minced",
            "1/4 cup fresh dill, chopped",
            "1/4 cup fresh parsley, chopped",
            "2 tablespoons fresh mint, chopped (optional)",
            "1 cup feta cheese, crumbled",
            "1/2 cup ricotta or cottage cheese",
            "3 large eggs, lightly beaten",
            "1/4 teaspoon ground nutmeg",
            "Salt and freshly ground black pepper to taste",
            "1/2 cup olive oil",
            "1/4 cup butter, melted and mixed with olive oil for brushing"
        ],
        instructions: [
            "If using fresh spinach, blanch it briefly in boiling water, drain well, and squeeze out excess moisture. If using frozen spinach, thaw completely and squeeze out all excess moisture.",
            "Heat olive oil in a large skillet over medium heat. Add onions and sauté until soft and translucent, about 5 minutes.",
            "Add garlic and cook for another minute until fragrant.",
            "Add spinach, dill, parsley, and mint (if using). Cook for 2-3 minutes to combine flavors. Remove from heat and let cool slightly.",
            "In a large bowl, combine the spinach mixture with feta, ricotta/cottage cheese, beaten eggs, nutmeg, salt, and pepper. Mix well.",
            "Preheat oven to 350°F (175°C). Brush a 9x13 inch baking dish with the oil-butter mixture.",
            "Carefully unroll phyllo dough. Keep it covered with a damp cloth while working to prevent drying out.",
            "Layer half the phyllo sheets in the baking dish, brushing each sheet with the oil-butter mixture before adding the next.",
            "Spread the spinach and cheese filling evenly over the phyllo layers.",
            "Layer the remaining phyllo sheets on top, brushing each with the oil-butter mixture.",
            "Before baking, score the top layers with a sharp knife into desired serving pieces (this makes it easier to cut later).",
            "Bake for 45-50 minutes until golden brown and crisp.",
            "Let cool for 10-15 minutes before serving to allow the filling to set."
        ],
        prepTime: "45 min",
        cookTime: "50 min",
        totalTime: "1 hour 35 min",
        servings: "8-10 pieces",
        difficulty: "Hard",
        diet: ["Vegetarian"],
        image: "https://images.unsplash.com/photo-1632459394522-1c63dba6abde?q=80&w=2069&auto=format&fit=crop",
        story: "Spanakopita has been a treasured part of Greek cuisine for generations. This savory pie appears in Greek literature dating back to antiquity and remains a staple in modern Greek households. Often prepared for special occasions and family gatherings, spanakopita showcases the Greek culinary philosophy of combining simple, fresh ingredients to create something extraordinary. The delicate layers of phyllo represent the artistry and patience central to traditional Greek cooking.",
        culture: "Greek",
        author: { name: "Maria Papadopoulos", image: "https://randomuser.me/api/portraits/women/55.jpg" },
        createdAt: "2024-09-14T09:15:00Z"
    }
];
const reviewsData: { [key: string]: Review[] } = {
    "chana-masala": [
        { id: "review-1", recipeId: "chana-masala", rating: 4.5, comment: "Delicious and authentic! The spice blend is perfect and reminds me of my grandmother's cooking.", author: { name: "Ananya S.", image: "https://randomuser.me/api/portraits/women/32.jpg" }, createdAt: "2024-09-16T14:30:00Z" },
        { id: "review-2", recipeId: "chana-masala", rating: 4.0, comment: "Great recipe! I added a bit more chili for extra heat and it worked wonderfully.", author: { name: "Rohan M.", image: "https://randomuser.me/api/portraits/men/45.jpg" }, createdAt: "2024-09-16T10:15:00Z" }
    ],
    "injera": [
        { id: "review-3", recipeId: "injera", rating: 4.8, comment: "Perfect tangy flavor! I've tried many injera recipes and this one nails the authentic taste.", author: { name: "Nardos T.", image: "https://randomuser.me/api/portraits/women/68.jpg" }, createdAt: "2024-09-15T16:45:00Z" }
    ],
    "spanakopita": [
        { id: "review-4", recipeId: "spanakopita", rating: 4.6, comment: "Amazing! The phyllo was perfectly crispy and the filling had wonderful balance. Will definitely make again.", author: { name: "Elena P.", image: "https://randomuser.me/api/portraits/women/55.jpg" }, createdAt: "2024-09-14T11:20:00Z" }
    ]
};
const commentsData: { [key: string]: Comment[] } = {
    "chana-masala": [
        { id: "comment-1", recipeId: "chana-masala", text: "This looks amazing! Can't wait to try it for our family dinner.", author: { name: "Priya S.", image: "https://randomuser.me/api/portraits/women/78.jpg" }, createdAt: "2024-09-16T15:45:00Z", replies: [] },
        { id: "comment-2", recipeId: "chana-masala", text: "Made it last night and my family loved it! The dried fenugreek leaves really make a difference.", author: { name: "Amit K.", image: "https://randomuser.me/api/portraits/men/62.jpg" }, createdAt: "2024-09-16T09:30:00Z", replies: [] }
    ],
    "injera": [
        { id: "comment-3", recipeId: "injera", text: "Is it possible to shorten the fermentation time? Eager to try this!", author: { name: "Sam J.", image: "https://randomuser.me/api/portraits/men/22.jpg" }, createdAt: "2024-09-15T18:30:00Z", replies: [] }
    ],
    "spanakopita": [
        { id: "comment-4", recipeId: "spanakopita", text: "Can I prepare this ahead and freeze it?", author: { name: "Sophia K.", image: "https://randomuser.me/api/portraits/women/33.jpg" }, createdAt: "2024-09-14T14:25:00Z", replies: [] }
    ]
};


// --- UI Styling Helpers ---
const colors = { // Retained from original
    primary: { light: 'amber-600', dark: 'amber-700', gradient: 'from-amber-600 to-amber-700' },
    secondary: { light: 'teal-600', dark: 'teal-700', gradient: 'from-teal-600 to-teal-700' },
    accent: { light: 'rose-500', dark: 'rose-600', gradient: 'from-rose-500 to-rose-600' },
    neutral: { bg: '#fcf9f5', card: '#ffffff', light: '#f3f0ea', dark: '#2d2a26' },
    text: { primary: '#362f2d', secondary: '#615954', light: '#8b8178' },
    badge: {
        punjabi: 'bg-red-100 text-red-800 border border-red-300',
        ethiopian: 'bg-orange-100 text-orange-800 border border-orange-300',
        greek: 'bg-blue-100 text-blue-800 border border-blue-300',
        vegetarian: 'bg-green-100 text-green-800 border border-green-300',
        vegan: 'bg-purple-100 text-purple-800 border border-purple-300',
        glutenfree: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        easy: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        medium: 'bg-amber-100 text-amber-800 border border-amber-300',
        hard: 'bg-rose-100 text-rose-800 border border-rose-300',
    },
    difficulty: {
        Easy: 'text-emerald-600', Medium: 'text-amber-600', Hard: 'text-rose-600',
        easyBg: 'bg-emerald-600', mediumBg: 'bg-amber-600', hardBg: 'bg-rose-600', // For filter buttons
    },
     difficultyColors: { // For the animated badge component
        Easy: 'bg-emerald-100 text-emerald-800',
        Medium: 'bg-amber-100 text-amber-800',
        Hard: 'bg-rose-100 text-rose-800'
    }
};

// --- Helper Functions ---
const getBadgeClass = (type: string, category: 'culture' | 'diet' | 'difficulty'): string => { /* ... as before ... */
    const key = type.toLowerCase().replace(/[\s-]/g, '');
    const categoryBadges = colors.badge as any;
    return categoryBadges[key] || 'bg-gray-100 text-gray-800 border border-gray-300';
};
const getDifficultyBgClass = (difficulty: "Easy" | "Medium" | "Hard"): string => { /* ... as before ... */
    const key = difficulty.toLowerCase() + 'Bg';
    return (colors.difficulty as any)[key] || 'bg-gray-600';
};
const calculateAverageRating = (reviews: Review[]): number => { // Simplified for RecipeCard
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
};
const calculateAverageRatingGlobal = (recipeId: string, reviews: { [key: string]: Review[] }): { avg: number | string, count: number } => { // Renamed for global use
    const relevantReviews = reviews[recipeId] || [];
    const count = relevantReviews.length;
    if (count === 0) return { avg: "N/A", count: 0 };
    const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
    return { avg: (sum / count).toFixed(1), count };
};
const formatDate = (dateString: string): string => { /* ... as before ... */
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
const getDifficultyColorClass = (difficulty: "Easy" | "Medium" | "Hard"): string => {
    return (colors.difficultyColors as any)[difficulty] || 'bg-gray-100 text-gray-800';
};


// --- Filter Types ---
interface FilterOptions { difficulties: string[]; diets: string[]; cultures: string[]; }
interface ActiveFilters { difficulty: string[]; diet: string[]; culture: string[]; }

// --- Consolidated Animations Object ---
const animations = {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } },
    fadeInUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } },
    popIn: { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, transition: { type: "spring", stiffness: 400, damping: 30 } },
    stagger: {
        container: { initial: {}, animate: { transition: { staggerChildren: 0.07 } } }, // Adjusted stagger time
        item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } }
    }
};


// --- Badge Component with Animation ---
interface BadgeProps { label: string; category: 'difficulty' | 'diet' | 'culture'; size?: 'sm' | 'md'; }
const Badge: React.FC<BadgeProps> = ({ label, category, size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

    let colorClasses = '';
    if (category === 'difficulty') {
        colorClasses = getDifficultyColorClass(label as "Easy" | "Medium" | "Hard");
    } else if (category === 'diet') {
        // Use the original getBadgeClass for diet/culture for consistency with filter colors
        colorClasses = getBadgeClass(label, category).split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ');
    } else if (category === 'culture') {
        colorClasses = getBadgeClass(label, category).split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ');
    } else {
         colorClasses = 'bg-gray-100 text-gray-800';
    }


    return (
        <motion.span
            className={`inline-block rounded-full font-medium ${sizeClasses} ${colorClasses} border border-black/10`} // Added subtle border
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {label}
        </motion.span>
    );
};


// --- Featured Recipe Component ---
interface FeaturedRecipeProps { recipe: Recipe; onSelect: (recipe: Recipe) => void; }
const FeaturedRecipe: React.FC<FeaturedRecipeProps> = ({ recipe, onSelect }) => {
    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-lg mb-12 border border-slate-200 hover:shadow-xl transition-shadow duration-300" // Enhanced shadow
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} // Trigger sooner
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="md:flex">
                <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                    <motion.img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                         whileHover={{ scale: 1.05 }}
                         transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-4 left-4">
                         <motion.span
                            className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                         >
                            Featured Recipe
                        </motion.span>
                    </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                     <motion.div
                        className="flex items-center gap-2 mb-3"
                        variants={animations.stagger.container} initial="initial" animate="animate"
                     >
                         <motion.div variants={animations.stagger.item}><Badge label={recipe.culture} category="culture" size="md" /></motion.div>
                         <motion.div variants={animations.stagger.item}><Badge label={recipe.difficulty} category="difficulty" size="md" /></motion.div>
                     </motion.div>

                    <motion.h2
                        className={`text-2xl md:text-3xl font-bold text-slate-800 mb-3 ${playfair.className}`}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 }}
                    >
                        {recipe.title}
                    </motion.h2>

                     <motion.p
                        className="text-slate-600 mb-6 flex-grow line-clamp-4"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.2 }}
                     >
                        {recipe.description}
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        variants={animations.stagger.container} initial="initial" animate="animate"
                    >
                        {recipe.diet.map(diet => (
                           <motion.div key={diet} variants={animations.stagger.item}> <Badge label={diet} category="diet" /></motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                         className="flex items-center justify-between mb-6 text-sm text-slate-600"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-1.5"> <Clock className="w-4 h-4" /> <span>{recipe.totalTime}</span> </div>
                        <div className="flex items-center gap-1.5"> <Users className="w-4 h-4" /> <span>Serves {recipe.servings}</span> </div>
                    </motion.div>

                    <motion.button
                        onClick={() => onSelect(recipe)}
                        className="mt-auto bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow hover:shadow-md"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.4 }}
                    >
                        <BookOpen className="w-5 h-5" />
                        View Recipe
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};


// --- Recipe Card Component (Enhanced with Microanimations) ---
interface RecipeCardProps {
    recipe: Recipe;
    reviews: { [key: string]: Review[] };
    comments: { [key: string]: Comment[] };
    onSelect: (recipe: Recipe) => void;
    savedRecipes: string[];
    onToggleSave: (recipeId: string) => void;
    onShareRecipe: (recipe: Recipe) => void;
}
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, reviews, comments, onSelect, savedRecipes, onToggleSave, onShareRecipe }) => {
    const reviewsForRecipe = reviews[recipe.id] || [];
    const commentsForRecipe = comments[recipe.id] || [];
    const avgRating = calculateAverageRating(reviewsForRecipe); // Use the simplified helper
    const isSaved = savedRecipes?.includes(recipe.id) || false;

    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 flex flex-col h-full cursor-pointer group" // Lighter border, added group
            layout // Enable layout animation
            variants={animations.stagger.item} // Use stagger item variant
            whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)" }} // Subtle hover shadow
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => onSelect(recipe)}
        >
            <div className="relative overflow-hidden"> {/* Added overflow hidden here */}
                <motion.img
                    src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" // Group hover scale
                 />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                     <Badge label={recipe.culture} category="culture" />
                     <Badge label={recipe.difficulty} category="difficulty" />
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                        onClick={(e) => { e.stopPropagation(); onToggleSave?.(recipe.id); }}
                        className={`p-2 rounded-full ${isSaved ? 'bg-amber-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'} shadow-md backdrop-blur-sm transition-colors duration-200`}
                        whileHover={{ scale: 1.15, rotate: isSaved ? 0 : 5 }} // Slightly more hover scale and rotate
                        whileTap={{ scale: 0.9 }}
                        aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                        key={isSaved ? "saved" : "unsaved"} // Key change for animation
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0.7 }}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                        onClick={(e) => { e.stopPropagation(); onShareRecipe?.(recipe); }}
                        className="p-2 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-md backdrop-blur-sm transition-colors duration-200"
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Share recipe"
                    >
                        <Share2 className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            <div className="p-4 md:p-5 flex-grow flex flex-col"> {/* Adjusted padding */}
                 <h3 className={`text-lg md:text-xl font-semibold mb-2 text-slate-800 group-hover:text-amber-700 transition-colors duration-200 ${playfair.className}`}>{recipe.title}</h3>
                 <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">{recipe.description}</p> {/* Use flex-grow here */}

                 <div className="flex flex-wrap gap-1.5 mb-4"> {/* Smaller gap */}
                    {recipe.diet.slice(0, 2).map(diet => ( // Show fewer initially
                        <span key={diet} className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-medium">
                            {diet}
                        </span>
                    ))}
                    {recipe.diet.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-xs font-medium">
                            +{recipe.diet.length - 2} more
                        </span>
                    )}
                </div>

                 <div className="flex items-center text-sm text-slate-500 mb-4 mt-auto pt-3 border-t border-slate-100"> {/* Moved time/servings here */}
                    <div className="flex items-center mr-3"> <Clock className="w-4 h-4 mr-1 text-slate-400" /> {recipe.totalTime} </div>
                    <div className="flex items-center"> <Users className="w-4 h-4 mr-1 text-slate-400" /> {recipe.servings} servings</div>
                     <div className="ml-auto flex items-center" title={`Rating: ${avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}`}>
                        <Star className={`w-4 h-4 ${avgRating > 0 ? 'text-amber-400 fill-current' : 'text-slate-300'} mr-1`} />
                        <span className="font-medium text-slate-600">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</span>
                    </div>
                </div>


                <motion.button
                    onClick={() => onSelect(recipe)} // Let parent div handle click if preferred
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-1 group" // Added group for arrow animation
                     whileHover={{ scale: 1.03 }} // Subtle hover scale
                     whileTap={{ scale: 0.98 }}
                >
                    View Recipe
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Recipe Detail Modal Component ---
// (Keep the previously combined version - no major animation changes requested here)
interface RecipeDetailModalProps {
    recipe: Recipe;
    initialReviews: Review[];
    initialComments: Comment[];
    onClose: () => void;
    onReviewSubmit: (newReview: Review) => void;
    onCommentSubmit: (newComment: Comment) => void;
}
const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, initialReviews, initialComments, onClose, onReviewSubmit, onCommentSubmit }) => {
    const [userRating, setUserRating] = useState<number>(0);
    const [userReview, setUserReview] = useState<string>("");
    const [userComment, setUserComment] = useState<string>("");
    const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false); // Separate submitting states
    const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'instructions' | 'reviews'>('story');
    const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
    const [comments, setComments] = useState<Comment[]>(initialComments || []);

    const { avg: avgRating, count: reviewCount } = useMemo(() => calculateAverageRatingGlobal(recipe.id, { [recipe.id]: reviews }), [recipe.id, reviews]); // Recalculate based on local state

    useEffect(() => {
        setReviews(initialReviews || []);
        setComments(initialComments || []);
    }, [initialReviews, initialComments]);


    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating === 0 || userReview.trim() === "") return;
        setIsSubmittingReview(true);
        setTimeout(() => {
            const newReview: Review = { id: `review-${Date.now()}`, recipeId: recipe.id, rating: userRating, comment: userReview, author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" }, createdAt: new Date().toISOString() };
            onReviewSubmit(newReview); // Inform parent
            setReviews(prev => [newReview, ...prev]); // Optimistic UI update
            setUserRating(0);
            setUserReview("");
            setIsSubmittingReview(false);
        }, 500);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userComment.trim() === "") return;
        setIsSubmittingComment(true);
        setTimeout(() => {
            const newComment: Comment = { id: `comment-${Date.now()}`, recipeId: recipe.id, text: userComment, author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" }, createdAt: new Date().toISOString(), replies: [] };
            onCommentSubmit(newComment); // Inform parent
            setComments(prev => [newComment, ...prev]); // Optimistic UI update
            setUserComment("");
            setIsSubmittingComment(false);
        }, 500);
    };

    // Star rating component (slightly enhanced)
    const renderStarRating = (rating: number, interactive = false, size = 5) => {
        const starSizeClass = `w-${size} h-${size}`;
        return (
            <div className="flex items-center space-x-0.5"> {/* Added space */}
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        type="button"
                        onClick={interactive ? () => setUserRating(star) : undefined}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer' : ''} ${star <= (interactive ? userRating : rating) ? 'text-amber-500' : 'text-gray-300 hover:text-gray-400'}`}
                        aria-label={`Rate ${star} out of 5 stars`}
                        whileHover={interactive ? { scale: 1.2, y: -1 } : {}}
                        whileTap={interactive ? { scale: 0.9 } : {}}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Star className={`${starSizeClass} ${star <= (interactive ? userRating : rating) ? 'fill-current' : ''}`} />
                    </motion.button>
                ))}
            </div>
        );
    };

    // Render the modal structure (mostly unchanged, focus was on other components)
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden p-4" onClick={onClose}>
             <motion.div
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col" // Added flex flex-col
                onClick={(e) => e.stopPropagation()}
                variants={animations.popIn}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ fontFamily: nunitoSans.style.fontFamily }}
            >
                 {/* Close Button */}
                 <button
                    className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                    onClick={onClose} aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Hero Image */}
                 <div className="relative h-64 md:h-80 w-full overflow-hidden flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge label={recipe.culture} category="culture" size="md" />
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow">
                                <Clock className="w-3.5 h-3.5" /> {recipe.totalTime}
                            </span>
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${playfair.className}`}>
                            {recipe.title}
                        </h1>
                         <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
                            <div className="flex items-center gap-2">
                                {renderStarRating(Number(avgRating), false, 4)}
                                <span>{avgRating} ({reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5"> <ChefHat className="w-4 h-4" /> <span>{recipe.difficulty}</span> </div>
                            <div className="flex items-center gap-1.5"> <Users className="w-4 h-4" /> <span>Serves {recipe.servings}</span> </div>
                        </div>
                    </div>
                </div>

                 {/* Content Area */}
                 <div className="flex flex-col md:flex-row flex-grow overflow-hidden"> {/* Added flex-grow and overflow-hidden */}
                     {/* Main Content */}
                     <div className="flex-grow p-6 md:p-8 overflow-y-auto"> {/* Allow main content to scroll */}
                         {/* Tab Navigation */}
                         <div className="flex border-b border-gray-200 mb-6 sticky top-0 bg-white z-10 -mt-6 pt-4 -mx-6 px-6 md:-mt-8 md:pt-6 md:-mx-8 md:px-8 pb-1"> {/* Added pb-1 */}
                            {(['story', 'ingredients', 'instructions', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    className={`relative px-4 py-3 font-semibold capitalize transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-t-md
                                        ${activeTab === tab ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'story' ? 'About' : tab}
                                    {tab === 'reviews' && reviews.length > 0 && (<span className="ml-1.5 text-xs font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full align-middle">{reviews.length}</span>)}
                                     {/* Animated underline */}
                                     {activeTab === tab && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"
                                            layoutId="underline" // layoutId enables animation between tabs
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                         {/* Tab Content */}
                         <div className="pb-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                     {/* Story Tab */}
                                     {activeTab === 'story' && (
                                        <div>
                                            <p className="text-gray-700 leading-relaxed mb-6">{recipe.description}</p>
                                            <h3 className={`text-lg font-semibold text-slate-800 mb-3 ${playfair.className}`}>The Story Behind the Dish</h3>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">{recipe.story}</p>
                                            <div className="flex items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <img src={recipe.author.image} alt={recipe.author.name} className="w-12 h-12 rounded-full object-cover mr-4 shadow" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{recipe.author.name}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1"> <Calendar className="w-3.5 h-3.5" /> Shared on: {formatDate(recipe.createdAt)} </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Ingredients Tab */}
                                    {activeTab === 'ingredients' && (
                                        <ul className="space-y-3">
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <motion.li
                                                    key={index} className="flex items-start border-b border-gray-100 pb-3"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0 shadow-sm"> {index + 1} </span>
                                                    <span className="text-gray-700">{ingredient}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Instructions Tab */}
                                    {activeTab === 'instructions' && (
                                        <ol className="space-y-6">
                                            {recipe.instructions.map((instruction, index) => (
                                                <motion.li
                                                    key={index} className="flex"
                                                     initial={{ opacity: 0, y: 15 }}
                                                     animate={{ opacity: 1, y: 0 }}
                                                     transition={{ delay: index * 0.08 }}
                                                >
                                                    <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold mr-4 mt-0.5 shrink-0 shadow"> {index + 1} </div>
                                                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                                                </motion.li>
                                            ))}
                                        </ol>
                                    )}

                                     {/* Reviews Tab */}
                                     {activeTab === 'reviews' && (
                                        <div>
                                            <div className="mb-8 p-5 bg-slate-50 rounded-lg border border-slate-200">
                                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${playfair.className}`}>Share Your Experience</h3>
                                                <form onSubmit={handleReviewSubmit}>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                                                        <div className="flex items-center gap-2">
                                                            {renderStarRating(0, true)}
                                                            {userRating > 0 && (<span className="text-sm text-amber-600 font-medium">{userRating}/5</span>)}
                                                        </div>
                                                         {userRating === 0 && <p className="text-xs text-red-500 mt-1 animate-pulse">Please select a rating.</p>} {/* Added pulse */}
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                                                        <textarea id="review" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="How was it? Did you make any changes?" value={userReview} onChange={(e) => setUserReview(e.target.value)} required></textarea>
                                                    </div>
                                                    <motion.button type="submit" disabled={isSubmittingReview || userRating === 0 || userReview.trim() === ""} className={`px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                                         {isSubmittingReview ? (
                                                            <> <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting... </>
                                                        ) : 'Submit Review'}
                                                    </motion.button>
                                                </form>
                                            </div>
                                            <div>
                                                 <h3 className={`text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2 ${playfair.className}`}> <BookOpen className="w-5 h-5" /> All Reviews ({reviews.length}) </h3>
                                                {reviews.length > 0 ? (
                                                    <div className="space-y-6">
                                                        {reviews.map((review) => (
                                                            <motion.div key={review.id} className="border-b border-gray-100 pb-5 last:border-b-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                                                <div className="flex items-start mb-2">
                                                                    <img src={review.author.image} alt={review.author.name} className="w-9 h-9 rounded-full object-cover mr-3 shadow" />
                                                                    <div>
                                                                        <p className="font-semibold text-gray-800">{review.author.name}</p>
                                                                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                                                    </div>
                                                                    <div className="ml-auto">{renderStarRating(review.rating, false, 4)}</div>
                                                                </div>
                                                                <p className="text-gray-700 pl-12 text-sm">{review.comment}</p>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : ( <div className="text-center py-8 text-gray-500">No reviews yet. Be the first!</div> )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar */}
                     <div className="md:w-1/3 md:min-w-[320px] bg-slate-50 md:border-l border-t md:border-t-0 border-slate-200 p-6 flex-shrink-0 overflow-y-auto"> {/* Allow sidebar scroll */}
                        <div className="sticky top-6">
                            {/* Details */}
                            <div className="bg-white rounded-lg p-5 mb-6 border border-slate-200 shadow-sm">
                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${playfair.className}`}>At a Glance</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> Prep Time</span><span className="font-medium text-slate-800">{recipe.prepTime}</span></div>
                                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> Cook Time</span><span className="font-medium text-slate-800">{recipe.cookTime}</span></div>
                                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> Total Time</span><span className="font-medium text-slate-800">{recipe.totalTime}</span></div>
                                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600 flex items-center gap-2"><Users className="w-4 h-4" /> Servings</span><span className="font-medium text-slate-800">{recipe.servings}</span></div>
                                    <div className="flex justify-between py-2"><span className="text-slate-600 flex items-center gap-2"><ChefHat className="w-4 h-4" /> Difficulty</span><span className={`font-medium ${colors.difficulty[recipe.difficulty]}`}>{recipe.difficulty}</span></div>
                                </div>
                            </div>
                             {/* Comments */}
                             <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 ${playfair.className}`}> <MessageSquare className="w-5 h-5" /> Comments ({comments.length}) </h3>
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="mb-3">
                                        <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="Ask a question or add a comment..." value={userComment} onChange={(e) => setUserComment(e.target.value)} required></textarea>
                                    </div>
                                    <motion.button type="submit" disabled={isSubmittingComment || userComment.trim() === ""} className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                        {isSubmittingComment ? (
                                            <> <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* SVG Spinner */></svg> Posting... </>
                                        ) : 'Post Comment'}
                                    </motion.button>
                                </form>
                                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"> {/* Added scrollbar styling class */}
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <motion.div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                                <div className="flex items-start mb-2">
                                                    <img src={comment.author.image} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover mr-2 shadow" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm">{comment.author.name}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm pl-10">{comment.text}</p>
                                            </motion.div>
                                        ))
                                    ) : (<div className="text-center py-4 text-gray-500 text-sm">No comments yet.</div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


// --- Back to Top Button Component (Enhanced with Animations) ---
const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-amber-600 text-white rounded-full shadow-lg z-40 hover:bg-amber-700" // Added hover color
                    aria-label="Back to top"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }} // Faster exit
                    whileHover={{ scale: 1.1, y: -2 }} // Add y-offset on hover
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }} // Spring animation
                >
                    <motion.div
                        animate={{ y: [0, -3, 0] }} // Bouncing arrow
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronUp className="w-5 h-5" />
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};


// --- Share Modal Component (Enhanced with Tabs and Animations) ---
interface ShareModalProps { recipe: Recipe; onClose: () => void; }
const ShareModal: React.FC<ShareModalProps> = ({ recipe, onClose }) => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/recipe/${recipe.id}` : `https://heritage-recipes.example.com/recipe/${recipe.id}`;
    const [copied, setCopied] = useState(false);
    const [shareOption, setShareOption] = useState<'link' | 'social' | 'email'>('link'); // Default to link tab

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { console.error('Failed to copy: ', err); }
    };

    // Social share handlers
    const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this amazing recipe: ${recipe.title}`)}`, '_blank');
    const shareOnWhatsapp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this amazing recipe: ${recipe.title} - ${shareUrl}`)}`, '_blank');
    const shareOnPinterest = () => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(recipe.image)}&description=${encodeURIComponent(recipe.title)}`, '_blank');

    // Email share state and handler
    const [emailTo, setEmailTo] = useState('');
    const [emailMessage, setEmailMessage] = useState(`I found this amazing recipe for ${recipe.title} and thought you might enjoy it!\n\n${shareUrl}`);
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleEmailShare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailTo || !/\S+@\S+\.\S+/.test(emailTo)) { // Basic email validation
             alert("Please enter a valid recipient email address.");
             return;
        }
        setIsSending(true);
        setTimeout(() => { // Simulate sending
            setIsSending(false);
            setEmailSent(true);
            setEmailTo(''); // Optionally clear form
            // setEmailMessage(`I found this amazing recipe for ${recipe.title}...`); // Optionally reset message
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                className="bg-white rounded-xl p-6 max-w-md w-full mx-auto overflow-hidden" // Added overflow-hidden
                onClick={(e) => e.stopPropagation()}
                variants={animations.popIn} initial="initial" animate="animate" exit="exit"
            >
                <div className="flex justify-between items-center mb-4">
                    <motion.h3 className={`text-xl font-semibold ${playfair.className}`} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}> Share Recipe </motion.h3>
                    <motion.button onClick={onClose} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close share modal" whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}> <X className="w-5 h-5" /> </motion.button>
                </div>

                <motion.div className="mb-5" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                    <p className="text-slate-600 mb-3 text-sm">Share this delicious "{recipe.title}" recipe!</p>
                    <motion.div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200" whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                        <img src={recipe.image} alt={recipe.title} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-slate-800 leading-tight">{recipe.title}</h4>
                            <p className="text-xs text-slate-500">{recipe.culture} Cuisine</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Share Options Tabs */}
                 <motion.div className="flex border-b border-slate-200 mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    {(['link', 'social', 'email'] as const).map((option) => (
                        <button key={option} className={`relative px-4 py-2 font-medium capitalize transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 rounded-t-md text-sm ${shareOption === option ? 'text-amber-700' : 'text-gray-500 hover:text-amber-600'}`} onClick={() => setShareOption(option)}>
                            <span className="flex items-center gap-1.5">
                                {option === 'link' && <Link className="w-4 h-4" />}
                                {option === 'social' && <Share className="w-4 h-4" />}
                                {option === 'email' && <Mail className="w-4 h-4" />}
                                {option}
                            </span>
                             {shareOption === option && (
                                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" layoutId="share-underline" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                            )}
                        </button>
                    ))}
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Content based on selected tab */}
                    <motion.div
                        key={shareOption} // Key change triggers animation
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {shareOption === 'link' && (
                            <div className="flex items-center mb-4">
                                <input type="text" value={shareUrl} readOnly className="flex-grow px-3 py-2 border border-slate-300 rounded-l-md bg-slate-100 text-sm truncate" />
                                <motion.button onClick={copyToClipboard} className={`${copied ? 'bg-green-600' : 'bg-amber-600 hover:bg-amber-700'} text-white px-4 py-2 rounded-r-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 flex items-center gap-1.5 min-w-[90px] justify-center`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    {copied ? (<><Check className="w-4 h-4" />Copied!</>) : (<><Copy className="w-4 h-4" />Copy</>)}
                                </motion.button>
                            </div>
                        )}

                        {shareOption === 'social' && (
                             <div className="flex justify-center flex-wrap gap-3 mb-4"> {/* Use flex-wrap */}
                                {[
                                    { handler: shareOnFacebook, title: "Facebook", color: "bg-blue-600 hover:bg-blue-700", icon: <svg/> }, // Replace with actual icons
                                    { handler: shareOnTwitter, title: "Twitter", color: "bg-sky-500 hover:bg-sky-600", icon: <svg/> },
                                    { handler: shareOnWhatsapp, title: "WhatsApp", color: "bg-green-600 hover:bg-green-700", icon: <svg/> },
                                    { handler: shareOnPinterest, title: "Pinterest", color: "bg-red-600 hover:bg-red-700", icon: <svg/> },
                                ].map((social, index) => (
                                     <motion.button key={social.title} onClick={social.handler} title={`Share on ${social.title}`} className={`p-3 ${social.color} text-white rounded-full transition-colors shadow-sm flex items-center justify-center w-11 h-11`} whileHover={{ scale: 1.15, rotate: (index % 2 === 0 ? 5 : -5) }} whileTap={{ scale: 0.9 }}>
                                        {/* Placeholder Icon - Use your icon library */}
                                        {social.title.charAt(0)}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {shareOption === 'email' && (
                             <div>
                                {!emailSent ? (
                                    <form onSubmit={handleEmailShare} className="space-y-3 mb-4">
                                        <div>
                                            <label htmlFor="emailTo" className="sr-only">Recipient Email</label>
                                            <input type="email" id="emailTo" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="Recipient's email *" required />
                                        </div>
                                        <div>
                                             <label htmlFor="emailMessage" className="sr-only">Message</label>
                                            <textarea id="emailMessage" rows={3} value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" required></textarea>
                                        </div>
                                        <motion.button type="submit" className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70" disabled={isSending || !emailTo} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            {isSending ? (<><svg className="animate-spin h-4 w-4 mr-1" /* Spinner SVG */></svg> Sending...</>) : (<><Send className="w-4 h-4" /> Send Email</>)}
                                        </motion.button>
                                    </form>
                                ) : (
                                     <motion.div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                        <div className="flex justify-center mb-2"><div className="bg-green-100 p-2 rounded-full"><Check className="w-6 h-6 text-green-600" /></div></div>
                                        <h4 className="text-green-800 font-medium mb-1">Email Sent!</h4>
                                        <p className="text-green-700 text-sm mb-3">Your friend will receive the recipe shortly.</p>
                                        <motion.button onClick={() => setEmailSent(false)} className="text-sm text-green-700 hover:text-green-900 font-medium underline" whileHover={{ scale: 1.05 }}> Send another </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <motion.div className="text-center text-xs text-slate-500 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}> Sharing is caring! </motion.div>
            </motion.div>
        </div>
    );
};


// --- Main App Component ---
const HeritageRecipes: React.FC = () => {
    // ... (State variables including new ones: isSubscribed, email, isSubmittingEmail, showNotification, notificationMessage, notificationType)
    const [recipes, setRecipes] = useState<Recipe[]>(recipeData);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [allReviews, setAllReviews] = useState<{ [key: string]: Review[] }>(reviewsData);
    const [allComments, setAllComments] = useState<{ [key: string]: Comment[] }>(commentsData);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ difficulty: [], diet: [], culture: [] });
    const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
    const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
    const [recipeToShare, setRecipeToShare] = useState<Recipe | null>(null);
    const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
    // New state
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [isSubmittingEmail, setIsSubmittingEmail] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>("");
    const [notificationType, setNotificationType] = useState<"success" | "error" | "info">("info");


    // ... (useEffect for localStorage)
    useEffect(() => {
        const saved = localStorage.getItem('savedHeritageRecipes');
        if (saved) { try { setSavedRecipes(JSON.parse(saved)); } catch (e) { console.error("Failed to parse saved recipes", e)} }
    }, []);
    useEffect(() => {
        localStorage.setItem('savedHeritageRecipes', JSON.stringify(savedRecipes));
    }, [savedRecipes]);

    // --- Helper Functions & Memos ---
    const filterOptions = useMemo(() => { /* ... as before ... */
        const difficulties = [...new Set(recipeData.map(r => r.difficulty))].sort((a,b) => ['Easy', 'Medium', 'Hard'].indexOf(a) - ['Easy', 'Medium', 'Hard'].indexOf(b));
        const diets = [...new Set(recipeData.flatMap(r => r.diet))].sort();
        const cultures = [...new Set(recipeData.map(r => r.culture))].sort();
        return { difficulties, diets, cultures };
    }, []);
    const filteredRecipes = useMemo(() => { /* ... as before ... */
        return recipeData.filter(recipe => {
            if (showSavedOnly && !savedRecipes.includes(recipe.id)) return false;
            if (searchTerm && !recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) && !recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) && !recipe.culture.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (activeFilters.difficulty.length > 0 && !activeFilters.difficulty.includes(recipe.difficulty)) return false;
            if (activeFilters.diet.length > 0 && !activeFilters.diet.some(diet => recipe.diet.includes(diet))) return false;
            if (activeFilters.culture.length > 0 && !activeFilters.culture.includes(recipe.culture)) return false;
            return true;
        });
    }, [searchTerm, activeFilters, savedRecipes, showSavedOnly]);
    const featuredRecipe = useMemo(() => recipes[0], [recipes]);
    const activeFilterCount = Object.values(activeFilters).reduce((sum, cat) => sum + cat.length, 0) + (showSavedOnly ? 1 : 0);


    // --- Handlers ---
    const showNotificationMessage = (message: string, type: "success" | "error" | "info" = "info") => { /* ... as before ... */
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        // Auto-hide notification
        const timer = setTimeout(() => setShowNotification(false), 3500); // Slightly longer duration
        // Optional: Allow manual dismiss to clear timeout
        // return () => clearTimeout(timer);
    };

    const handleFilterChange = (category: keyof ActiveFilters, value: string) => { /* ... as before ... */
        setActiveFilters(prev => {
            const currentCategoryFilters = prev[category];
            const newCategoryFilters = currentCategoryFilters.includes(value)
                ? currentCategoryFilters.filter(item => item !== value)
                : [...currentCategoryFilters, value];
            return { ...prev, [category]: newCategoryFilters };
        });
    };
    const handleResetFilters = () => { /* ... as before ... */
        setActiveFilters({ difficulty: [], diet: [], culture: [] });
        setSearchTerm("");
        setShowSavedOnly(false);
    };
    const handleReviewSubmit = (newReview: Review) => { /* ... as before ... */
        const recipeId = newReview.recipeId;
        setAllReviews(prev => ({ ...prev, [recipeId]: [newReview, ...(prev[recipeId] || [])] }));
        showNotificationMessage("Review submitted successfully!", "success"); // Add notification
    };
    const handleCommentSubmit = (newComment: Comment) => { /* ... as before ... */
        const recipeId = newComment.recipeId;
        setAllComments(prev => ({ ...prev, [recipeId]: [newComment, ...(prev[recipeId] || [])] }));
         showNotificationMessage("Comment posted!", "success"); // Add notification
    };
    const handleToggleSave = (recipeId: string) => { // Updated with notification logic
        const recipe = recipes.find(r => r.id === recipeId);
        setSavedRecipes(prev => {
            if (prev.includes(recipeId)) {
                showNotificationMessage(`Removed "${recipe?.title || 'Recipe'}" from saved`, "info");
                return prev.filter(id => id !== recipeId);
            } else {
                showNotificationMessage(`Saved "${recipe?.title || 'Recipe'}"!`, "success");
                return [...prev, recipeId];
            }
        });
    };
    const handleShareRecipe = (recipe: Recipe) => { /* ... as before ... */
        setRecipeToShare(recipe);
        setShareModalOpen(true);
    };
    const handleSubscribe = (e: React.FormEvent) => { // Added newsletter handler
        e.preventDefault();
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            showNotificationMessage("Please enter a valid email address.", "error");
            return;
        }
        setIsSubmittingEmail(true);
        setTimeout(() => { // Simulate API call
            setIsSubmittingEmail(false);
            setIsSubscribed(true);
            setEmail("");
            showNotificationMessage("Successfully subscribed!", "success");
        }, 1500);
    };


    // --- Render ---
    return (
        <div className={`min-h-screen bg-[${colors.neutral.bg}] ${playfair.variable} ${nunitoSans.variable} text-[${colors.text.primary}] selection:bg-amber-200 selection:text-amber-900`}> {/* Added selection style */}
            {/* Hero Section */}
            <div className="relative bg-slate-800 text-white overflow-hidden"> {/* Added overflow-hidden */}
                <div className="absolute inset-0">
                     {/* Animated background image */}
                     <motion.img
                        src="https://images.unsplash.com/photo-1495195129352-aeb3c6505b6?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Wooden cooking background with spices"
                        className="w-full h-full object-cover opacity-30"
                        initial={{ scale: 1.1, opacity: 0.2 }} // Start slightly zoomed
                        animate={{ scale: 1, opacity: 0.3 }}   // Zoom out slowly
                        transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }} // Slow, smooth loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-slate-800/80 to-slate-900/90"></div>
                </div>
                <div className="relative container mx-auto px-4 py-20 md:py-28 text-center md:text-left">
                    <div className="max-w-3xl">
                        <motion.h1 className={`text-4xl md:text-6xl font-bold mb-4 ${playfair.className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}> Heritage Recipes </motion.h1>
                        <motion.p className="text-lg md:text-xl text-amber-100/90 mb-8 max-w-2xl mx-auto md:mx-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}> Savor the authentic tastes of cultural traditions and culinary legacies passed down through generations. </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <button onClick={() => document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg shadow-lg transition-colors duration-300 font-semibold group inline-flex items-center"> {/* Added group and flex */}
                                Explore Recipes
                                 <motion.span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1"> → </motion.span> {/* Animated arrow */}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-10 md:py-16">
                 {/* Featured Recipe Section */}
                 {featuredRecipe && ( <section className="mb-12 md:mb-16"> <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center md:text-left ${playfair.className}`}> Recipe Spotlight </h2> <FeaturedRecipe recipe={featuredRecipe} onSelect={setSelectedRecipe} /> </section> )}

                {/* Search and Filter Section */}
                 <section id="recipes-section" className="mb-12 md:mb-16">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 ${playfair.className}`}> Discover Recipes </h2>
                         <div className="relative max-w-md w-full md:w-auto flex-grow md:flex-grow-0">
                            <input type="text" placeholder="Search recipes, cuisines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2.5 pl-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all duration-200 focus:shadow-md" /> {/* Added focus shadow */}
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"> {/* Added pointer-events-none */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            </div>
                             {/* Clear search button */}
                             {searchTerm && (
                                <motion.button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                                    aria-label="Clear search"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    <X size={16} />
                                </motion.button>
                            )}
                        </div>
                    </div>

                     {/* Filter Controls */}
                     <motion.div layout className="bg-white rounded-xl shadow border border-slate-200 p-5 mb-8 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-4"> {/* Adjusted gap */}
                            <h3 className="font-semibold text-slate-800 mr-2 flex items-center gap-1.5"><Filter className="w-4 h-4 text-slate-500"/>Filter By:</h3>
                            <motion.button onClick={() => setShowSavedOnly(!showSavedOnly)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border ${showSavedOnly ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Bookmark className={`h-4 w-4 transition-colors duration-200 ${showSavedOnly ? 'text-amber-600 fill-current' : 'text-slate-500'}`} /> Saved ({savedRecipes.length})
                            </motion.button>
                             {activeFilterCount > 0 && (
                                <motion.button onClick={handleResetFilters} className="ml-auto text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <RefreshCw className="h-3.5 w-3.5"/> Clear Filters ({activeFilterCount})
                                </motion.button>
                            )}
                        </div>
                         <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5"> {/* Added layout animation, adjusted gap */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2.5">Difficulty</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.difficulties.map(difficulty => (
                                        <motion.button key={difficulty} onClick={() => handleFilterChange('difficulty', difficulty)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-400 ${activeFilters.difficulty.includes(difficulty) ? `${getDifficultyBgClass(difficulty as "Easy" | "Medium" | "Hard")} text-white border-transparent scale-105` : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                                            {difficulty}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2.5">Dietary Option</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.diets.map(diet => (
                                        <motion.button key={diet} onClick={() => handleFilterChange('diet', diet)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 ${activeFilters.diet.includes(diet) ? 'bg-green-600 text-white border-transparent scale-105' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                                            {diet}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2.5">Cuisine / Culture</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.cultures.map(culture => (
                                        <motion.button key={culture} onClick={() => handleFilterChange('culture', culture)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${activeFilters.culture.includes(culture) ? 'bg-blue-600 text-white border-transparent scale-105' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                                            {culture}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                     {/* Recipe Grid */}
                     <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" layout variants={animations.stagger.container} initial="initial" animate="animate">
                        <AnimatePresence>
                            {filteredRecipes.length > 0 ? (
                                filteredRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} reviews={allReviews} comments={allComments} onSelect={setSelectedRecipe} savedRecipes={savedRecipes} onToggleSave={handleToggleSave} onShareRecipe={handleShareRecipe} />
                                ))
                            ) : (
                                 <motion.div className="col-span-full text-center py-16" variants={animations.fadeIn} initial="initial" animate="animate" exit="exit">
                                    <div className="inline-block p-4 rounded-full bg-amber-100 text-amber-600 mb-4 animate-bounce"> {/* Added bounce */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-xl text-slate-700 font-semibold mb-2">No Recipes Found</p>
                                    <p className="text-slate-500 mb-6">Try adjusting your filters or search term.</p>
                                    <motion.button onClick={handleResetFilters} className="px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> Reset Filters </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* Newsletter Section */}
                <section className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 md:p-12 mb-12 md:mb-16 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>
                     <div className="max-w-3xl mx-auto text-center relative z-10">
                        <motion.h2 className={`text-2xl md:text-3xl font-bold mb-4 ${playfair.className}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}> Join Our Culinary Journey </motion.h2>
                        <motion.p className="text-teal-100 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.1 }}> Get weekly recipes, cooking tips, and stories from around the world delivered to your inbox. </motion.p>
                        {!isSubscribed ? (
                            <motion.form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubscribe} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-300 focus:border-teal-300 outline-none placeholder-slate-400" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                <motion.button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold disabled:opacity-70 disabled:cursor-not-allowed" disabled={isSubmittingEmail} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                                    {isSubmittingEmail ? (<span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* Spinner */></svg>Subscribing...</span>) : ('Subscribe')}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-lg mx-auto border border-teal-400/30" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                                <div className="flex items-center justify-center mb-3"> <svg className="w-10 h-10 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> </div>
                                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                                <p className="text-teal-100">Check your inbox to confirm your subscription.</p>
                            </motion.div>
                        )}
                        <p className="text-xs text-teal-200 mt-4">We respect your privacy. Unsubscribe anytime.</p>
                    </div>
                </section>

            </main>

            {/* Modals */}
            <AnimatePresence> {selectedRecipe && ( <RecipeDetailModal recipe={selectedRecipe} initialReviews={allReviews[selectedRecipe.id] || []} initialComments={allComments[selectedRecipe.id] || []} onClose={() => setSelectedRecipe(null)} onReviewSubmit={handleReviewSubmit} onCommentSubmit={handleCommentSubmit} /> )} </AnimatePresence>
            <AnimatePresence> {shareModalOpen && recipeToShare && ( <ShareModal recipe={recipeToShare} onClose={() => setShareModalOpen(false)} /> )} </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg z-[60] flex items-center gap-3 text-white text-sm font-medium ${notificationType === 'success' ? 'bg-green-600' : notificationType === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
                        initial={{ opacity: 0, y: 50 }} // Start further down
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }} // Springy entrance
                        drag="x" // Allow dragging to dismiss
                        dragConstraints={{ left: 0, right: 100 }}
                        onDragEnd={(event, info) => { if (info.offset.x > 50) setShowNotification(false); }} // Dismiss on drag right
                    >
                        <span> {/* Icon based on type */}
                            {notificationType === 'success' && <Check className="w-5 h-5" />}
                            {notificationType === 'error' && <X className="w-5 h-5" />}
                            {notificationType === 'info' && <Info className="w-5 h-5" />} {/* Assuming Info icon exists */}
                        </span>
                        <p>{notificationMessage}</p>
                        <button onClick={() => setShowNotification(false)} className="ml-2 text-white/70 hover:text-white p-1 -mr-1 rounded-full hover:bg-white/20"> <X size={16} /> </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <BackToTopButton />

            {/* Footer */}
            <footer className="bg-slate-800 text-slate-300 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="mb-6 md:mb-0">
                            <motion.h2 className={`text-2xl font-bold text-white ${playfair.className}`} whileHover={{ scale: 1.05, color: "#fcd34d" }} transition={{ type: "spring", stiffness: 400, damping: 10 }}> Heritage Recipes </motion.h2>
                            <p className="text-slate-400 mt-1 text-sm">Celebrating culinary traditions</p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex space-x-4 mb-4">
                                 {/* Social media links with hover animations */}
                                <motion.a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}> <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg> </motion.a>
                                <motion.a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}> <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> </motion.a>
                                <motion.a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}> <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg> </motion.a>
                             </div>
                            <motion.p className="text-slate-400 text-sm" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}> © {new Date().getFullYear()} Heritage Recipes. All rights reserved. </motion.p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HeritageRecipes;


