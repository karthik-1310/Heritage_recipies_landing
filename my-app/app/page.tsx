"use client"

import React, { useState, useMemo } from "react";
import { Star, Clock, Users, ChefHat, BookOpen, Calendar, X, Filter, Check, RefreshCw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Nunito_Sans } from 'next/font/google'; // Changed to heritage-inspired fonts
import Image from 'next/image';
// --- Font Setup ---
const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '600', '700'], // Load necessary weights
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
        image: "https://media.cnn.com/api/v1/images/stellar/prod/190205150343-kitfo.jpg?q=w_2071,h_1380,x_0,y_0,c_fill",
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
        image: "https://www.olivetomato.com/wp-content/uploads/2021/08/SAM_8242-1.jpeg?q=80&w=2071&auto=format&fit=crop",
        story: "Spanakopita has been a treasured part of Greek cuisine for generations. This savory pie appears in Greek literature dating back to antiquity and remains a staple in modern Greek households. Often prepared for special occasions and family gatherings, spanakopita showcases the Greek culinary philosophy of combining simple, fresh ingredients to create something extraordinary. The delicate layers of phyllo represent the artistry and patience central to traditional Greek cooking.",
        culture: "Greek",
        author: { name: "Maria Papadopoulos", image: "https://randomuser.me/api/portraits/women/55.jpg" },
        createdAt: "2024-09-14T09:15:00Z"
    }
];

// --- Mock Data (Reviews & Comments) ---
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
    // Main palette inspired by heritage spices and earthenware
    primary: { light: 'amber-600', dark: 'amber-700', gradient: 'from-amber-600 to-amber-700' },  // Warm amber/saffron
    secondary: { light: 'teal-600', dark: 'teal-700', gradient: 'from-teal-600 to-teal-700' },    // Rich teal
    accent: { light: 'rose-500', dark: 'rose-600', gradient: 'from-rose-500 to-rose-600' },       // Vibrant rose
    
    // Neutrals for background and text
    neutral: { 
        bg: '#fcf9f5',           // Warm off-white for background
        card: '#ffffff',         // Pure white for cards
        light: '#f3f0ea',        // Light beige for secondary backgrounds
        dark: '#2d2a26'          // Deep charcoal for text
    },
    text: { 
        primary: '#362f2d',      // Rich dark brown
        secondary: '#615954',    // Medium warm gray
        light: '#8b8178'         // Light warm gray
    },
    
    // Badges by category
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
    
    // Difficulty indicator colors
    difficulty: { 
        Easy: 'text-emerald-600', 
        Medium: 'text-amber-600', 
        Hard: 'text-rose-600' 
    }
};

// Function to get badge class (with fallback)
const getBadgeClass = (type: string): string => {
    const key = type.toLowerCase().replace(/[\s-]/g, ''); // Normalize key, remove spaces and hyphens
    const categoryBadges = colors.badge as Record<string, string>; // Type-safe alternative to any
    return categoryBadges[key] || 'bg-gray-100 text-gray-800 border border-gray-300';
};

// Animation variants for micro-interactions
const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: "easeOut" }
    },
    popIn: {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    stagger: {
        container: {
            animate: { transition: { staggerChildren: 0.07 } }
        },
        item: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 }
        }
    }
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
interface BadgeProps {
    label: string;
    category: 'culture' | 'diet' | 'difficulty';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ label, size = 'sm' }) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium";
    const sizeClasses = size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
    
    return (
        <span className={`${baseClasses} ${sizeClasses} ${getBadgeClass(label)}`}>
            {label}
        </span>
    );
};

// --- Filter Component ---
interface FilterOptions {
    difficulties: string[];
    diets: string[];
    cultures: string[];
}

interface ActiveFilters {
    difficulty: string[];
    diet: string[];
    culture: string[];
}

interface FilterButtonsProps {
    options: FilterOptions;
    activeFilters: ActiveFilters;
    onFilterChange: (category: keyof ActiveFilters, value: string) => void;
    onResetFilters: () => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ options, activeFilters, onFilterChange, onResetFilters }) => {
    // Count active filters
    const activeFilterCount = Object.values(activeFilters).reduce(
        (count, filterArray) => count + filterArray.length, 0
    );
    
    const renderButton = (category: keyof ActiveFilters, value: string) => {
        const isActive = activeFilters[category].includes(value);
        return (
            <motion.button
                key={value}
                onClick={() => onFilterChange(category, value)}
                className={`flex items-center px-3 py-1.5 rounded-full border text-sm transition-all duration-200 shadow-sm ${
                    isActive
                        ? `bg-amber-600 text-white border-amber-600 scale-105`
                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
                }`}
                whileTap={{ scale: 0.97 }}
                initial={false}
            >
                {isActive && <Check className="w-3 h-3 mr-1.5 stroke-2" />}
                {value}
            </motion.button>
        );
    };

    return (
        <motion.div 
            className="mb-8 bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Filter className="w-4 h-4" /> 
                        Filter Recipes
                    </span>
                    
                    {activeFilterCount > 0 && (
                        <motion.button
                            onClick={onResetFilters}
                            className="flex items-center text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Reset ({activeFilterCount})
                        </motion.button>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-y-3 gap-x-4 w-full sm:w-auto">
                    <div className="flex flex-wrap gap-2 items-center border-l pl-4">
                        <span className="text-sm font-medium text-slate-500 self-center mr-1">Cuisine:</span>
                        <div className="flex flex-wrap gap-2">
                            {options.cultures.map(c => renderButton('culture', c))}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center border-l pl-4">
                        <span className="text-sm font-medium text-slate-500 self-center mr-1">Difficulty:</span>
                        <div className="flex flex-wrap gap-2">
                            {options.difficulties.map(d => renderButton('difficulty', d))}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center border-l pl-4">
                        <span className="text-sm font-medium text-slate-500 self-center mr-1">Diet:</span>
                        <div className="flex flex-wrap gap-2">
                            {options.diets.map(d => renderButton('diet', d))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Recipe Card Component (Enhanced UI) ---
interface RecipeCardProps {
    recipe: Recipe;
    reviews: { [key: string]: Review[] };
    comments: { [key: string]: Comment[] };
    onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, reviews, comments, onSelect }) => {
    const { avg: avgRating, count: reviewCount } = calculateAverageRating(recipe.id, reviews);
    const commentCount = (comments[recipe.id] || []).length;

    return (
        <motion.div
            layout
            variants={animations.slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col group"
            onClick={() => onSelect(recipe)}
            style={{ fontFamily: nunitoSans.style.fontFamily }}
        >
            <div className="w-full h-56 overflow-hidden relative"> 
                <Image 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={400}
                    height={300}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 p-3 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Badge label={recipe.culture} category="culture" size="md" />
                    </motion.div>
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className={`text-xl font-semibold text-slate-800 mb-2 ${playfair.className}`}>
                    {recipe.title}
                </h3>
                
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                    {recipe.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.diet.map(diet => (
                        <Badge key={diet} label={diet} category="diet" />
                    ))}
                </div>
                
                <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 mr-4">
                        <ChefHat className={`w-4 h-4 ${colors.difficulty[recipe.difficulty]}`} />
                        <span className={`font-medium ${colors.difficulty[recipe.difficulty]}`}>
                            {recipe.difficulty}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
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

// --- Recipe Detail Modal Component (Enhanced UI) ---
interface RecipeDetailModalProps {
    recipe: Recipe;
    initialReviews: Review[];
    initialComments: Comment[];
    onClose: () => void;
    onReviewSubmit: (newReview: Review) => void;
    onCommentSubmit: (newComment: Comment) => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ 
    recipe, 
    initialReviews, 
    initialComments, 
    onClose, 
    onReviewSubmit,
    onCommentSubmit
}) => {
    const [userRating, setUserRating] = useState<number>(0);
    const [userReview, setUserReview] = useState<string>("");
    const [userComment, setUserComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(
false);
    const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'instructions' | 'reviews'>('story');
    const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
    const [comments, setComments] = useState<Comment[]>(initialComments || []);
    
    const { avg: avgRating, count: reviewCount } = calculateAverageRating(recipe.id, reviewsData);
    
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating === 0 || userReview.trim() === "") return;
        
        setIsSubmitting(true);
        
        setTimeout(() => {
            const newReview: Review = {
                id: `review-${Date.now()}`,
                recipeId: recipe.id,
                rating: userRating,
                comment: userReview,
                author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" },
                createdAt: new Date().toISOString()
            };
            
            setReviews(prev => [newReview, ...prev]);
            onReviewSubmit(newReview);
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
            const newComment: Comment = {
                id: `comment-${Date.now()}`,
                recipeId: recipe.id,
                text: userComment,
                author: { name: "Guest User", image: "https://randomuser.me/api/portraits/lego/1.jpg" },
                createdAt: new Date().toISOString(),
                replies: []
            };
            
            setComments(prev => [newComment, ...prev]);
            onCommentSubmit(newComment);
            setUserComment("");
            setIsSubmitting(false);
        }, 500);
    };
    
    // Render star rating component
    const renderStarRating = (rating: number, interactive = false) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={interactive ? () => setUserRating(star) : undefined}
                        className={`${
                            interactive ? 'cursor-pointer transition-all duration-200' : ''
                        } ${star <= (interactive ? userRating : rating) ? 'text-amber-500' : 'text-gray-300'}`}
                    >
                        <Star className={`w-5 h-5 ${star <= (interactive ? userRating : rating) ? 'fill-amber-500' : ''}`} />
                    </span>
                ))}
            </div>
        );
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden" onClick={onClose}>
            <motion.div 
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
                variants={animations.popIn}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ fontFamily: nunitoSans.style.fontFamily }}
            >
                {/* Close Button */}
                <button 
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={onClose}
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
                
                {/* Hero Image with Gradient Overlay */}
                <div className="relative h-80 w-full overflow-hidden">
    <Image 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-full object-cover"
        width={1200}
        height={600}
        priority
    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge label={recipe.culture} category="culture" size="md" />
                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {recipe.totalTime}
                            </span>
                        </div>
                        
                        <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${playfair.className}`}>
                            {recipe.title}
                        </h1>
                        
                        <div className="flex items-center flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                {renderStarRating(Number(avgRating))}
                                <span className="text-white">{avgRating} ({reviewCount} reviews)</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-white">
                                <ChefHat className="w-4 h-4" />
                                <span>{recipe.difficulty}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-white">
                                <Users className="w-4 h-4" />
                                <span>Serves {recipe.servings}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-6">
                            {(['story', 'ingredients', 'instructions', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-3 font-medium capitalize transition-colors
                                        ${activeTab === tab 
                                            ? 'text-amber-700 border-b-2 border-amber-600' 
                                            : 'text-gray-500 hover:text-amber-600'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'story' ? 'About' : tab}
                                    {tab === 'reviews' && reviews.length > 0 && (
                                        <span className="ml-1 text-sm text-gray-400">({reviews.length})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        {/* Tab Content */}
                        <div className="pb-4">
                            {/* Story Tab */}
                            {activeTab === 'story' && (
                                <motion.div
                                    key="story"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <p className="text-gray-700 leading-relaxed mb-4">{recipe.description}</p>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recipe.story}</p>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <div className="flex items-center mb-4">
                                            <Image
                                                src={recipe.author.image} 
                                                alt={recipe.author.name}
                                                className="w-10 h-10 rounded-full object-cover mr-3" 
                                                width={40}
                                                height={40}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{recipe.author.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                                    {formatDate(recipe.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>         
                                </motion.div>
                            )}
                            
                            {/* Ingredients Tab */}
                            {activeTab === 'ingredients' && (
                                <motion.div
                                    key="ingredients"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ul className="space-y-2">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <motion.li 
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-start border-b border-gray-100 pb-2"
                                            >
                                                <span className="bg-amber-100 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <span className="text-gray-700">{ingredient}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                            
                            {/* Instructions Tab */}
                            {activeTab === 'instructions' && (
                                <motion.div
                                    key="instructions"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ol className="space-y-6">
                                        {recipe.instructions.map((instruction, index) => (
                                            <motion.li 
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex"
                                            >
                                                <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium mr-4 mt-0.5 shrink-0">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{instruction}</p>
                                            </motion.li>
                                        ))}
                                    </ol>
                                </motion.div>
                            )}
                            
                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Write a Review */}
                                    <div className="mb-8 p-5 bg-slate-50 rounded-lg border border-slate-200">
                                        <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${playfair.className}`}>
                                            Write a Review
                                        </h3>
                                        
                                        <form onSubmit={handleReviewSubmit}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Rating
                                                </label>
                                                <div className="flex items-center">
                                                    {renderStarRating(0, true)}
                                                    {userRating > 0 && (
                                                        <span className="ml-2 text-sm text-amber-600 font-medium">
                                                            {userRating}/5
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your Review
                                                </label>
                                                <textarea
                                                    id="review"
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                    placeholder="Share your experience with this recipe..."
                                                    value={userReview}
                                                    onChange={(e) => setUserReview(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || userRating === 0 || userReview.trim() === ""}
                                                className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors
                                                    ${(isSubmitting || userRating === 0 || userReview.trim() === "") ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </form>
                                    </div>
                                    
                                    {/* Reviews List */}
                                    <div>
                                        <h3 className={`text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2 ${playfair.className}`}>
                                            <BookOpen className="w-5 h-5" />
                                            All Reviews ({reviews.length})
                                        </h3>
                                        
                                        {reviews.length > 0 ? (
                                            <div className="space-y-6">
                                                {reviews.map((review) => (
                                                    <motion.div
                                                        key={review.id}
                                                        className="border-b border-gray-100 pb-5"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="flex items-center mb-2">
                                                            <img 
                                                                src={review.author.image} 
                                                                alt={review.author.name}
                                                                className="w-8 h-8 rounded-full object-cover mr-3" 
                                                            />
                                                            <div>
                                                                <p className="font-medium text-gray-800">{review.author.name}</p>
                                                                <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-2">
                                                            {renderStarRating(review.rating)}
                                                        </div>
                                                        
                                                        <p className="text-gray-700">{review.comment}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                No reviews yet. Be the first to share your experience!
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="md:w-1/3 md:min-w-[300px]">
                        <div className="sticky top-6">
                            {/* Recipe Details */}
                            <div className="bg-slate-50 rounded-lg p-5 mb-6">
                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 ${playfair.className}`}>
                                    At a Glance
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Prep Time
                                        </span>
                                        <span className="font-medium text-slate-800">{recipe.prepTime}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Cook Time
                                        </span>
                                        <span className="font-medium text-slate-800">{recipe.cookTime}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Total Time
                                        </span>
                                        <span className="font-medium text-slate-800">{recipe.totalTime}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Servings
                                        </span>
                                        <span className="font-medium text-slate-800">{recipe.servings}</span>
                                    </div>
                                    
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <ChefHat className="w-4 h-4" /> Difficulty
                                        </span>
                                        <span className={`font-medium ${colors.difficulty[recipe.difficulty]}`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comments Section */}
                            <div className="bg-slate-50 rounded-lg p-5">
                                <h3 className={`text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
                                    <MessageSquare className="w-5 h-5" />
                                    Comments ({comments.length})
                                </h3>
                                
                                {/* Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-6">
                                    <div className="mb-3">
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Add a comment or question..."
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || userComment.trim() === ""}
                                        className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors
                                            ${(isSubmitting || userComment.trim() === "") ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                                
                                {/* Comments List */}
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <motion.div
                                                key={comment.id}
                                                className="border-b border-gray-100 pb-4"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="flex items-center mb-2">
                                                    <img 
                                                        src={comment.author.image} 
                                                        alt={comment.author.name}
                                                        className="w-7 h-7 rounded-full object-cover mr-2" 
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{comment.author.name}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-700 text-sm">{comment.text}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                            No comments yet. Start the conversation!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main App Component ---
const HeritageRecipes: React.FC = () => {
    const [] = useState<Recipe[]>(recipeData);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [reviews, setReviews] = useState<{ [key: string]: Review[] }>(reviewsData);
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>(commentsData);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        difficulty: [],
        diet: [],
        culture: []
    });
    
    // Extract filter options from data
    const filterOptions = useMemo(() => {
        const difficulties = [...new Set(recipeData.map(r => r.difficulty))];
        const diets = [...new Set(recipeData.flatMap(r => r.diet))];
        const cultures = [...new Set(recipeData.map(r => r.culture))];
        
        return { difficulties, diets, cultures };
    }, []);
    
    // Apply filters and search
    const filteredRecipes = useMemo(() => {
        return recipeData.filter(recipe => {
            // Apply search filter
            if (searchTerm && !recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            // Apply difficulty filter
            if (activeFilters.difficulty.length > 0 && !activeFilters.difficulty.includes(recipe.difficulty)) {
                return false;
            }
            
            // Apply diet filter
            if (activeFilters.diet.length > 0 && !activeFilters.diet.some(diet => recipe.diet.includes(diet))) {
                return false;
            }
            
            // Apply culture filter
            if (activeFilters.culture.length > 0 && !activeFilters.culture.includes(recipe.culture)) {
                return false;
            }
            
            return true;
        });
    }, [searchTerm, activeFilters]);
    
    // Handle filter changes
    const handleFilterChange = (category: keyof ActiveFilters, value: string) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (newFilters[category].includes(value)) {
                // Remove the filter if already active
                newFilters[category] = newFilters[category].filter(item => item !== value);
            } else {
                // Add the filter if not active
                newFilters[category] = [...newFilters[category], value];
            }
            
            return newFilters;
        });
    };
    
    // Reset all filters
    const handleResetFilters = () => {
        setActiveFilters({
            difficulty: [],
            diet: [],
            culture: []
        });
        setSearchTerm("");
    };
    
    // Handle review submissions
    const handleReviewSubmit = (newReview: Review) => {
        const recipeId = newReview.recipeId;
        setReviews(prev => ({
            ...prev,
            [recipeId]: prev[recipeId] ? [newReview, ...prev[recipeId]] : [newReview]
        }));
    };
    
    // Handle comment submissions
    const handleCommentSubmit = (newComment: Comment) => {
        const recipeId = newComment.recipeId;
        setComments(prev => ({
            ...prev,
            [recipeId]: prev[recipeId] ? [newComment, ...prev[recipeId]] : [newComment]
        }));
    };
    
    return (
        <div className={`min-h-screen bg-[${colors.neutral.bg}] ${playfair.variable} ${nunitoSans.variable}`}>
            {/* Header */}
            <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${playfair.className}`}>
                        Heritage Recipes
                    </h1>
                    <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
                        Discover authentic recipes that celebrate cultural traditions and culinary heritage
                    </p>
                </div>
            </header>
            
            <main className="container mx-auto px-4 py-10">
                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search for recipes, ingredients, or cuisines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 rounded-full border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
                
                {/* Filters */}
                <FilterButtons 
                    options={filterOptions}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                />
                
                {/* Recipe Grid */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    layout
                    variants={animations.stagger.container}
                    initial="initial"
                    animate="animate"
                >
                    <AnimatePresence>
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map(recipe => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    reviews={reviews}
                                    comments={comments}
                                    onSelect={setSelectedRecipe}
                                />
                            ))
                        ) : (
                            <motion.div 
                                className="col-span-full text-center py-12"
                                variants={animations.fadeIn}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <p className="text-xl text-slate-500">No recipes found matching your search criteria.</p>
                                <button 
                                    onClick={handleResetFilters}
                                    className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
            
            {/* Recipe Detail Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <RecipeDetailModal
                        recipe={selectedRecipe}
                        initialReviews={reviews[selectedRecipe.id] || []}
                        initialComments={comments[selectedRecipe.id] || []}
                        onClose={() => setSelectedRecipe(null)}
                        onReviewSubmit={handleReviewSubmit}
                        onCommentSubmit={handleCommentSubmit}
                    />
                )}
            </AnimatePresence>
            
            {/* Footer */}
            <footer className="bg-slate-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h2 className={`text-2xl font-bold ${playfair.className}`}>Heritage Recipes</h2>
                            <p className="text-slate-400 mt-1">Celebrating culinary traditions around the world</p>
                        </div>
                        
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex space-x-4 mb-4">
                                <a href="#" className="text-white hover:text-amber-400 transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-amber-400 transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.582 1.8 1.146.565.565.897 1.132 1.148 1.8.246.636.416 1.363.465 2.427.047 1.024.06 1.379.06 3.808s-.013 2.784-.06 3.808c-.049 1.064-.219 1.791-.465 2.427-.25.668-.583 1.235-1.147 1.8-.567.566-1.133.898-1.801 1.148-.636.246-1.363.415-2.427.464-1.024.048-1.379.06-3.808.06-2.43 0-2.784-.012-3.808-.06-1.064-.048-1.791-.218-2.427-.464-.668-.25-1.235-.582-1.8-1.147-.566-.566-.898-1.133-1.148-1.801-.246-.636-.416-1.363-.464-2.427-.048-1.024-.06-1.379-.06-3.808s.012-2.784.06-3.808c.048-1.064.218-1.791.464-2.427.25-.668.582-1.235 1.147-1.8.567-.566 1.132-.897 1.8-1.147.637-.247 1.364-.416 2.428-.465 1.024-.047 1.379-.06 3.808-.06zm0 2.693c-2.392 0-2.717.01-3.725.057-.9.042-1.389.193-1.714.32-.436.17-.751.37-1.071.69-.32.32-.52.635-.69 1.07-.127.326-.278.815-.32 1.715-.047 1.008-.057 1.333-.057 3.725s.01 2.717.057 3.725c.042.9.193 1.389.32 1.714.17.436.37.751.69 1.071.32.32.635.52 1.07.69.326.127.815.278 1.715.32 1.008.047 1.333.057 3.725.057s2.717-.01 3.725-.057c.9-.042 1.389-.193 1.714-.32.436-.17.751-.37 1.071-.69.32-.32.52-.635.69-1.07.127-.326.278-.815.32-1.715.047-1.008.057-1.333.057-3.725s-.01-2.717-.057-3.725c-.042-.9-.193-1.389-.32-1.714-.17-.436-.37-.751-.69-1.071-.32-.32-.635-.52-1.07-.69-.326-.127-.815-.278-1.715-.32-1.008-.047-1.333-.057-3.725-.057z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M12.315 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 8.653a3.403 3.403 0 110-6.806 3.403 3.403 0 010 6.806zm4.99-8.863a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-amber-400 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
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