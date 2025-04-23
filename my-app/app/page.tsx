"use client"

import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Star, Clock, Users, ChefHat, BookOpen, MapPin, Calendar, X, Filter, Check, RefreshCw, MessageSquare, Bookmark, Share2, ArrowUp } from "lucide-react"; // Added Bookmark, Share2, ArrowUp
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
interface Recipe {
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

interface Review {
  id: string;
  recipeId: string;
  rating: number;
  comment: string;
  author: { name: string; image: string; };
  createdAt: string;
}

interface Comment {
  id: string;
  recipeId: string;
  text: string;
  author: { name: string; image: string; };
  createdAt: string;
  replies: Comment[];
}

// --- Mock Data (Assuming recipeData, reviewsData, commentsData are defined as before) ---
// --- Mock Data with Corrected Image URLs ---
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


// --- UI Styling Helpers (Enhanced Heritage-Inspired Palette) ---
const colors = {
    primary: { light: 'amber-600', dark: 'amber-700', gradient: 'from-amber-600 to-amber-700' },
    secondary: { light: 'teal-600', dark: 'teal-700', gradient: 'from-teal-600 to-teal-700' },
    accent: { light: 'rose-500', dark: 'rose-600', gradient: 'from-rose-500 to-rose-600' },
    neutral: {
        bg: '#fcf9f5',
        card: '#ffffff',
        light: '#f3f0ea',
        dark: '#2d2a26'
    },
    text: {
        primary: '#362f2d',
        secondary: '#615954',
        light: '#8b8178'
    },
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
        Easy: 'text-emerald-600',
        Medium: 'text-amber-600',
        Hard: 'text-rose-600',
        // Add difficulty-based background colors for filters
        easyBg: 'bg-emerald-600',
        mediumBg: 'bg-amber-600',
        hardBg: 'bg-rose-600',
    }
};

// Function to get badge class (with fallback)
const getBadgeClass = (type: string, category: 'culture' | 'diet' | 'difficulty'): string => {
    const key = type.toLowerCase().replace(/[\s-]/g, '');
    const categoryBadges = colors.badge as any;
    return categoryBadges[key] || 'bg-gray-100 text-gray-800 border border-gray-300';
};

// Get difficulty background color
const getDifficultyBgClass = (difficulty: "Easy" | "Medium" | "Hard"): string => {
    const key = difficulty.toLowerCase() + 'Bg';
    return (colors.difficulty as any)[key] || 'bg-gray-600';
};

// Animation variants for micro-interactions
const animations = {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3, ease: "easeOut" } },
    popIn: { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, transition: { type: "spring", stiffness: 300, damping: 25 } },
    stagger: { container: { animate: { transition: { staggerChildren: 0.07 } } }, item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } } }
};

// --- Calculation Helper ---
const calculateAverageRating = (recipeId: string, reviews: { [key: string]: Review[] }): { avg: number | string, count: number } => {
    const relevantReviews = reviews[recipeId] || [];
    const count = relevantReviews.length;
    if (count === 0) return { avg: "N/A", count: 0 };
    const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0);
    return { avg: (sum / count).toFixed(1), count };
};

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Badge Component ---
interface BadgeProps { label: string; category: 'culture' | 'diet' | 'difficulty'; size?: 'sm' | 'md'; }
const Badge: React.FC<BadgeProps> = ({ label, category, size = 'sm' }) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium";
    const sizeClasses = size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
    return (<span className={`${baseClasses} ${sizeClasses} ${getBadgeClass(label, category)}`}>{label}</span>);
};

// --- Filter Types ---
interface FilterOptions { difficulties: string[]; diets: string[]; cultures: string[]; }
interface ActiveFilters { difficulty: string[]; diet: string[]; culture: string[]; }

// --- Back to Top Button Component ---
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
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-amber-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-amber-700 transition-colors"
                    aria-label="Back to top"
                >
                    <ArrowUp className="h-6 w-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// --- Featured Recipe Component ---
interface FeaturedRecipeProps { recipe: Recipe; onSelect: (recipe: Recipe) => void; }
const FeaturedRecipe: React.FC<FeaturedRecipeProps> = ({ recipe, onSelect }) => {
    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-md mb-12 border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="md:flex">
                <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                            Featured Recipe
                        </span>
                    </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge label={recipe.culture} category="culture" size="md" />
                        <Badge label={recipe.difficulty} category="difficulty" size="md" />
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 mb-3 ${playfair.className}`}>
                        {recipe.title}
                    </h2>

                    <p className="text-slate-600 mb-6 flex-grow line-clamp-4"> {/* Added line-clamp */}
                        {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.diet.map(diet => (
                            <Badge key={diet} label={diet} category="diet" />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-6 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{recipe.totalTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>Serves {recipe.servings}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onSelect(recipe)}
                        className="mt-auto bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow hover:shadow-md"
                    >
                        <BookOpen className="w-5 h-5" />
                        View Recipe
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Recipe Card Component (Enhanced UI with Save/Share) ---
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
    const { avg: avgRating, count: reviewCount } = calculateAverageRating(recipe.id, reviews);
    const commentCount = (comments[recipe.id] || []).length;
    const isSaved = savedRecipes.includes(recipe.id);

    const handleSaveClick = (e: React.MouseEvent) => { e.stopPropagation(); onToggleSave(recipe.id); };
    const handleShareClick = (e: React.MouseEvent) => { e.stopPropagation(); onShareRecipe(recipe); };

    return (
        <motion.div
            layout
            variants={animations.slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} // Enhanced hover shadow
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group"
            onClick={() => onSelect(recipe)}
            style={{ fontFamily: nunitoSans.style.fontFamily }}
        >
            <div className="w-full h-56 overflow-hidden relative">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Save and Share Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={handleSaveClick}
                        className={`p-2 rounded-full transition-colors duration-200 ${isSaved ? 'bg-amber-600 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'} shadow-md`}
                        aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                    >
                        <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-white' : 'fill-none'}`} strokeWidth={isSaved ? 0 : 2} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={handleShareClick}
                        className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white shadow-md"
                        aria-label="Share recipe"
                    >
                        <Share2 className="h-5 w-5" />
                    </motion.button>
                </div>
                {/* Culture Badge */}
                <div className="absolute bottom-0 left-0 p-3 w-full">
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Badge label={recipe.culture} category="culture" size="md" />
                    </motion.div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className={`text-xl font-semibold text-slate-800 mb-2 ${playfair.className} group-hover:text-amber-700 transition-colors`}>
                    {recipe.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                    {recipe.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.diet.map(diet => (<Badge key={diet} label={diet} category="diet" />))}
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4 mt-auto"> {/* Lighter border */}
                    <div className="flex items-center gap-1.5 mr-4">
                        <ChefHat className={`w-4 h-4 ${colors.difficulty[recipe.difficulty]}`} />
                        <span className={`font-medium ${colors.difficulty[recipe.difficulty]}`}>{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="font-semibold text-slate-700">{avgRating}</span>
                            <span className="text-xs text-slate-400">({reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 hover:text-amber-600 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs">{commentCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Recipe Detail Modal Component ( Largely Unchanged from original, ensure it uses new state if needed ) ---
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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'instructions' | 'reviews'>('story');
    const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
    const [comments, setComments] = useState<Comment[]>(initialComments || []);

    const { avg: avgRating, count: reviewCount } = useMemo(() => calculateAverageRating(recipe.id, reviewsData), [recipe.id, reviewsData]); // Use useMemo for calculation

    useEffect(() => { // Update local state if initial props change (e.g., after submitting)
        setReviews(initialReviews || []);
        setComments(initialComments || []);
    }, [initialReviews, initialComments]);


    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating === 0 || userReview.trim() === "") return;
        setIsSubmitting(true);
        setTimeout(() => {
            const newReview: Review = { id: `review-${Date.now()}`, recipeId: recipe.id, rating: userRating, comment: userReview, author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" }, createdAt: new Date().toISOString() };
            // Call parent submit handler FIRST
            onReviewSubmit(newReview);
            // Update local state *after* parent potentially updates reviewsData
            setReviews(prev => [newReview, ...prev]); // Optimistic update locally
            setUserRating(0);
            setUserReview("");
            setIsSubmitting(false);
        }, 500);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userComment.trim() === "") return;
        setIsSubmitting(true);
        setTimeout(() => {
            const newComment: Comment = { id: `comment-${Date.now()}`, recipeId: recipe.id, text: userComment, author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" }, createdAt: new Date().toISOString(), replies: [] };
            onCommentSubmit(newComment);
            setComments(prev => [newComment, ...prev]);
            setUserComment("");
            setIsSubmitting(false);
        }, 500);
    };

    const renderStarRating = (rating: number, interactive = false, size = 5) => {
        const starSizeClass = `w-${size} h-${size}`;
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button" // Prevent form submission
                        onClick={interactive ? () => setUserRating(star) : undefined}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-100' : ''} ${star <= (interactive ? userRating : rating) ? 'text-amber-500' : 'text-gray-300'}`}
                        aria-label={`Rate ${star} out of 5 stars`}
                    >
                        <Star className={`${starSizeClass} ${star <= (interactive ? userRating : rating) ? 'fill-current' : ''}`} />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden p-4" onClick={onClose}>
            <motion.div
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                variants={animations.popIn}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ fontFamily: nunitoSans.style.fontFamily }}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={onClose} aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Hero Image */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
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
                                {renderStarRating(Number(avgRating), false, 4)} {/* Smaller stars */}
                                <span>{avgRating} ({reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5"> <ChefHat className="w-4 h-4" /> <span>{recipe.difficulty}</span> </div>
                            <div className="flex items-center gap-1.5"> <Users className="w-4 h-4" /> <span>Serves {recipe.servings}</span> </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col md:flex-row">
                    {/* Main Content */}
                    <div className="flex-grow p-6 md:p-8">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-6 sticky top-0 bg-white z-10 -mt-6 pt-4 -mx-6 px-6 md:-mt-8 md:pt-6 md:-mx-8 md:px-8"> {/* Sticky tabs */}
                            {(['story', 'ingredients', 'instructions', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-3 font-semibold capitalize transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-t-md
                                        ${activeTab === tab ? 'text-amber-700 border-b-2 border-amber-600' : 'text-gray-500 hover:text-amber-600 hover:border-b-2 hover:border-gray-300'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'story' ? 'About' : tab}
                                    {tab === 'reviews' && reviews.length > 0 && (<span className="ml-1.5 text-xs font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">{reviews.length}</span>)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="pb-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab} // Key change triggers animation
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
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" /> Shared on: {formatDate(recipe.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Ingredients Tab */}
                                    {activeTab === 'ingredients' && (
                                        <ul className="space-y-3">
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={index} className="flex items-start border-b border-gray-100 pb-3">
                                                    <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-700">{ingredient}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Instructions Tab */}
                                    {activeTab === 'instructions' && (
                                        <ol className="space-y-6">
                                            {recipe.instructions.map((instruction, index) => (
                                                <li key={index} className="flex">
                                                    <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold mr-4 mt-0.5 shrink-0 shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    )}

                                    {/* Reviews Tab */}
                                    {activeTab === 'reviews' && (
                                        <div>
                                            {/* Write a Review */}
                                            <div className="mb-8 p-5 bg-slate-50 rounded-lg border border-slate-200">
                                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${playfair.className}`}>Share Your Experience</h3>
                                                <form onSubmit={handleReviewSubmit}>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                                                        <div className="flex items-center gap-2">
                                                            {renderStarRating(0, true)}
                                                            {userRating > 0 && (<span className="text-sm text-amber-600 font-medium">{userRating}/5</span>)}
                                                        </div>
                                                        {userRating === 0 && <p className="text-xs text-red-500 mt-1">Please select a rating.</p>}
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                                                        <textarea id="review" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="How was it? Did you make any changes?" value={userReview} onChange={(e) => setUserReview(e.target.value)} required></textarea>
                                                    </div>
                                                    <button type="submit" disabled={isSubmitting || userRating === 0 || userReview.trim() === ""} className={`px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}>
                                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </form>
                                            </div>
                                            {/* Reviews List */}
                                            <div>
                                                <h3 className={`text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2 ${playfair.className}`}>
                                                    <BookOpen className="w-5 h-5" /> All Reviews ({reviews.length})
                                                </h3>
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
                                                                <p className="text-gray-700 pl-12">{review.comment}</p> {/* Indent comment */}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">No reviews yet. Be the first!</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:w-1/3 md:min-w-[300px] bg-slate-50 md:border-l border-t md:border-t-0 border-slate-200 p-6">
                        <div className="sticky top-6"> {/* Make sidebar sticky */}
                            {/* Recipe Details */}
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

                            {/* Comments Section */}
                            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
                                    <MessageSquare className="w-5 h-5" /> Comments ({comments.length})
                                </h3>
                                {/* Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="mb-3">
                                        <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm" placeholder="Ask a question or add a comment..." value={userComment} onChange={(e) => setUserComment(e.target.value)} required></textarea>
                                    </div>
                                    <button type="submit" disabled={isSubmitting || userComment.trim() === ""} className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}>
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                                {/* Comments List */}
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2"> {/* Added max-height and overflow */}
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
                                                <p className="text-gray-700 text-sm pl-10">{comment.text}</p> {/* Indent comment */}
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

// --- Share Modal Component ---
interface ShareModalProps { recipe: Recipe; onClose: () => void; }
const ShareModal: React.FC<ShareModalProps> = ({ recipe, onClose }) => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/recipe/${recipe.id}` : `https://heritage-recipes.example.com/recipe/${recipe.id}`; // Generate dynamic URL if possible
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Maybe show an error message to the user
        }
    };

    // Basic share handlers (replace with actual sharing SDKs if needed)
    const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this amazing recipe: ${recipe.title}`)}`, '_blank');
    const shareOnWhatsapp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this amazing recipe: ${recipe.title} - ${shareUrl}`)}`, '_blank');
    // Add Pinterest, Email etc. similarly

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                className="bg-white rounded-xl p-6 max-w-md w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${playfair.className}`}>Share Recipe</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700" aria-label="Close share modal"> <X className="w-5 h-5" /> </button>
                </div>
                <div className="mb-6">
                    <p className="text-slate-600 mb-4 text-sm">Share this delicious "{recipe.title}" recipe!</p>
                    <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <img src={recipe.image} alt={recipe.title} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-slate-800 leading-tight">{recipe.title}</h4>
                            <p className="text-xs text-slate-500">{recipe.culture} Cuisine</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mb-6">
                    <input type="text" value={shareUrl} readOnly className="flex-grow px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm truncate" />
                    <button onClick={copyToClipboard} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-r-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="flex justify-center gap-4">
                    {/* Replace with actual icons or library */}
                    <button onClick={shareOnFacebook} title="Share on Facebook" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"> F </button>
                    <button onClick={shareOnTwitter} title="Share on Twitter" className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors shadow-sm"> T </button>
                    <button onClick={shareOnWhatsapp} title="Share on WhatsApp" className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-sm"> W </button>
                    {/* Add more share buttons */}
                </div>
            </motion.div>
        </div>
    );
};


// --- Main App Component ---
const HeritageRecipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>(recipeData); // This might not be needed if recipeData is static
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [allReviews, setAllReviews] = useState<{ [key: string]: Review[] }>(reviewsData);
    const [allComments, setAllComments] = useState<{ [key: string]: Comment[] }>(commentsData);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ difficulty: [], diet: [], culture: [] });
    const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
    const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
    const [recipeToShare, setRecipeToShare] = useState<Recipe | null>(null);
    const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

    // Load saved recipes from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('savedHeritageRecipes');
        if (saved) {
            setSavedRecipes(JSON.parse(saved));
        }
    }, []);

    // Save recipes to localStorage when savedRecipes changes
    useEffect(() => {
        localStorage.setItem('savedHeritageRecipes', JSON.stringify(savedRecipes));
    }, [savedRecipes]);


    const filterOptions = useMemo(() => {
        const difficulties = [...new Set(recipeData.map(r => r.difficulty))].sort((a,b) => ['Easy', 'Medium', 'Hard'].indexOf(a) - ['Easy', 'Medium', 'Hard'].indexOf(b)); // Sort difficulty
        const diets = [...new Set(recipeData.flatMap(r => r.diet))].sort();
        const cultures = [...new Set(recipeData.map(r => r.culture))].sort();
        return { difficulties, diets, cultures };
    }, []); // Empty dependency array if recipeData is static

    const filteredRecipes = useMemo(() => {
        return recipeData.filter(recipe => {
            if (showSavedOnly && !savedRecipes.includes(recipe.id)) return false;
            if (searchTerm && !recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) && !recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) && !recipe.culture.toLowerCase().includes(searchTerm.toLowerCase())) return false; // Added culture search
            if (activeFilters.difficulty.length > 0 && !activeFilters.difficulty.includes(recipe.difficulty)) return false;
            if (activeFilters.diet.length > 0 && !activeFilters.diet.some(diet => recipe.diet.includes(diet))) return false;
            if (activeFilters.culture.length > 0 && !activeFilters.culture.includes(recipe.culture)) return false;
            return true;
        });
    }, [searchTerm, activeFilters, savedRecipes, showSavedOnly]); // recipeData removed if static

    const featuredRecipe = useMemo(() => recipes[0], [recipes]); // Or use a specific ID

    const handleFilterChange = (category: keyof ActiveFilters, value: string) => {
        setActiveFilters(prev => {
            const currentCategoryFilters = prev[category];
            const newCategoryFilters = currentCategoryFilters.includes(value)
                ? currentCategoryFilters.filter(item => item !== value)
                : [...currentCategoryFilters, value];
            return { ...prev, [category]: newCategoryFilters };
        });
    };

    const handleResetFilters = () => {
        setActiveFilters({ difficulty: [], diet: [], culture: [] });
        setSearchTerm("");
        setShowSavedOnly(false);
    };

    const handleReviewSubmit = (newReview: Review) => {
        const recipeId = newReview.recipeId;
        setAllReviews(prev => ({
            ...prev,
            [recipeId]: [newReview, ...(prev[recipeId] || [])] // Prepend new review
        }));
        // Optionally update reviewsData if it's meant to be mutable globally, though state is preferred
        // reviewsData[recipeId] = [newReview, ...(reviewsData[recipeId] || [])];
    };

    const handleCommentSubmit = (newComment: Comment) => {
        const recipeId = newComment.recipeId;
        setAllComments(prev => ({
            ...prev,
            [recipeId]: [newComment, ...(prev[recipeId] || [])] // Prepend new comment
        }));
        // commentsData[recipeId] = [newComment, ...(commentsData[recipeId] || [])];
    };

    const handleToggleSave = (recipeId: string) => {
        setSavedRecipes(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
    };

    const handleShareRecipe = (recipe: Recipe) => {
        setRecipeToShare(recipe);
        setShareModalOpen(true);
    };

    const activeFilterCount = Object.values(activeFilters).reduce((sum, cat) => sum + cat.length, 0) + (showSavedOnly ? 1 : 0);


    return (
        <div className={`min-h-screen bg-[${colors.neutral.bg}] ${playfair.variable} ${nunitoSans.variable} text-[${colors.text.primary}]`}>
            {/* Hero Section */}
            <div className="relative bg-slate-800 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1495195129352-aeb3c6505b6?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Wooden cooking background with spices" className="w-full h-full object-cover opacity-30" /> {/* Better background image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-slate-800/80 to-slate-900/90"></div>
                </div>
                <div className="relative container mx-auto px-4 py-20 md:py-28 text-center md:text-left"> {/* Adjusted padding and alignment */}
                    <div className="max-w-3xl">
                        <motion.h1 className={`text-4xl md:text-6xl font-bold mb-4 ${playfair.className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            Heritage Recipes
                        </motion.h1>
                        <motion.p className="text-lg md:text-xl text-amber-100/90 mb-8 max-w-2xl mx-auto md:mx-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            Savor the authentic tastes of cultural traditions and culinary legacies passed down through generations.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <button onClick={() => document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg shadow-lg transition-colors duration-300 font-semibold">
                                Explore Recipes
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-10 md:py-16">
                {/* Featured Recipe Section */}
                {featuredRecipe && (
                    <section className="mb-12 md:mb-16">
                         <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center md:text-left ${playfair.className}`}>
                            Recipe Spotlight
                        </h2>
                        <FeaturedRecipe recipe={featuredRecipe} onSelect={setSelectedRecipe} />
                    </section>
                )}

                {/* Search and Filter Section */}
                <section id="recipes-section" className="mb-12 md:mb-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 ${playfair.className}`}>
                            Discover Recipes
                        </h2>
                        {/* Search Bar */}
                        <div className="relative max-w-md w-full md:w-auto flex-grow md:flex-grow-0">
                            <input type="text" placeholder="Search recipes, cuisines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2.5 pl-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-colors" />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <motion.div layout className="bg-white rounded-xl shadow border border-slate-200 p-5 mb-8 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                            <h3 className="font-semibold text-slate-800 mr-2 flex items-center gap-1.5"><Filter className="w-4 h-4 text-slate-500"/>Filter By:</h3>
                            <button onClick={() => setShowSavedOnly(!showSavedOnly)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border ${showSavedOnly ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}>
                                <Bookmark className={`h-4 w-4 ${showSavedOnly ? 'text-amber-600 fill-current' : 'text-slate-500'}`} /> Saved ({savedRecipes.length})
                            </button>
                            {activeFilterCount > 0 && (
                                <button onClick={handleResetFilters} className="ml-auto text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors">
                                    <RefreshCw className="h-3.5 w-3.5"/> Clear Filters ({activeFilterCount})
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Difficulty</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.difficulties.map(difficulty => (
                                        <button key={difficulty} onClick={() => handleFilterChange('difficulty', difficulty)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${activeFilters.difficulty.includes(difficulty) ? `${getDifficultyBgClass(difficulty as "Easy" | "Medium" | "Hard")} text-white border-transparent scale-105` : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
                                            {difficulty}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Dietary Option</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.diets.map(diet => (
                                        <button key={diet} onClick={() => handleFilterChange('diet', diet)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${activeFilters.diet.includes(diet) ? 'bg-green-600 text-white border-transparent scale-105' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
                                            {diet}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Cuisine / Culture</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filterOptions.cultures.map(culture => (
                                        <button key={culture} onClick={() => handleFilterChange('culture', culture)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border shadow-sm ${activeFilters.culture.includes(culture) ? 'bg-blue-600 text-white border-transparent scale-105' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
                                            {culture}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recipe Grid */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" layout variants={animations.stagger.container} initial="initial" animate="animate">
                        <AnimatePresence>
                            {filteredRecipes.length > 0 ? (
                                filteredRecipes.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} reviews={allReviews} comments={allComments} onSelect={setSelectedRecipe} savedRecipes={savedRecipes} onToggleSave={handleToggleSave} onShareRecipe={handleShareRecipe} />
                                ))
                            ) : (
                                <motion.div className="col-span-full text-center py-16" variants={animations.fadeIn} initial="initial" animate="animate" exit="exit">
                                    <div className="inline-block p-4 rounded-full bg-amber-100 text-amber-600 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-xl text-slate-700 font-semibold mb-2">No Recipes Found</p>
                                    <p className="text-slate-500 mb-6">Try adjusting your filters or search term.</p>
                                    <button onClick={handleResetFilters} className="px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors font-medium">
                                        Reset Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* Newsletter Section */}
                 <section className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 md:p-12 mb-12 md:mb-16 text-white shadow-lg"> {/* Changed gradient */}
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${playfair.className}`}>Join Our Culinary Journey</h2>
                        <p className="text-teal-100 mb-6">Get weekly recipes, cooking tips, and stories from around the world delivered to your inbox.</p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none" required />
                            <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold">Subscribe</button>
                        </form>
                        <p className="text-xs text-teal-200 mt-4">We respect your privacy. Unsubscribe anytime.</p>
                    </div>
                </section>

            </main>

            {/* Recipe Detail Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <RecipeDetailModal
                        recipe={selectedRecipe}
                        initialReviews={allReviews[selectedRecipe.id] || []}
                        initialComments={allComments[selectedRecipe.id] || []}
                        onClose={() => setSelectedRecipe(null)}
                        onReviewSubmit={handleReviewSubmit}
                        onCommentSubmit={handleCommentSubmit}
                    />
                )}
            </AnimatePresence>

             {/* Share Modal */}
            <AnimatePresence>
                {shareModalOpen && recipeToShare && (
                    <ShareModal recipe={recipeToShare} onClose={() => setShareModalOpen(false)} />
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <BackToTopButton />

            {/* Footer */}
            <footer className="bg-slate-800 text-slate-300 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="mb-6 md:mb-0">
                            <h2 className={`text-2xl font-bold text-white ${playfair.className}`}>Heritage Recipes</h2>
                            <p className="text-slate-400 mt-1 text-sm">Celebrating culinary traditions</p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex space-x-4 mb-4">
                                {/* Replace with actual icons */}
                                <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg></a>
                            </div>
                            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Heritage Recipes. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HeritageRecipes;