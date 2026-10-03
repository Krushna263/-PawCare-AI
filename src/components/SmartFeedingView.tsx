import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, 
  Clock, 
  Droplet, 
  CheckCircle2, 
  Circle, 
  Plus, 
  AlertTriangle, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Info,
  Edit2,
  ArrowRight
} from 'lucide-react';

export const SmartFeedingView: React.FC = () => {
  const { 
    activePet, 
    feedingSchedule, 
    toggleMealCompletion, 
    updateMealTime, 
    addMeal,
    setActiveTab: setAppTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'safe' | 'avoid' | 'tips'>('today');
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editedTime, setEditedTime] = useState('');
  
  // Add new meal modal state
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealTime, setNewMealTime] = useState('12:00 PM');
  const [newMealPortion, setNewMealPortion] = useState('');

  // Daily hydration estimate based on weight (50-60 ml per kg for healthy pets)
  const estimatedWaterMl = Math.round(activePet.weight * 55);

  const handleSaveTime = (mealId: string) => {
    if (editedTime.trim()) {
      updateMealTime(mealId, editedTime.trim());
    }
    setEditingMealId(null);
  };

  const handleAddNewMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    addMeal({
      name: newMealName.trim(),
      time: newMealTime.trim(),
      portion: newMealPortion.trim() || 'Custom portion',
      notes: 'Added to daily routine',
    });

    setNewMealName('');
    setNewMealPortion('');
    setIsAddingMeal(false);
  };

  const safeFoodsList = [
    { name: 'Plain Cooked Chicken Breast', desc: 'Excellent lean protein source with zero added sodium, skin, or bones.', tags: ['Dogs', 'Cats'] },
    { name: 'Pure Canned Pumpkin Puree', desc: 'Rich in soluble fiber; helps regulate both loose stools and mild constipation.', tags: ['Dogs', 'Cats'] },
    { name: 'Fresh Blueberries', desc: 'Antioxidant-dense low calorie treat; excellent training reward for dogs.', tags: ['Dogs', 'Birds'] },
    { name: 'Steamed Green Beans', desc: 'Low-calorie crunchy filler ideal for weight management diets.', tags: ['Dogs', 'Rabbits'] },
    { name: 'Plain Cooked White/Brown Rice', desc: 'Easily digestible carbohydrate base for gentle tummy resets.', tags: ['Dogs', 'Cats'] },
    { name: 'Cooked Salmon (Deboned)', desc: 'Omega-3 fatty acids for skin and coat luster; never feed raw fish.', tags: ['Dogs', 'Cats'] },
    { name: 'Carrot Slices', desc: 'Natural crunch cleans mild plaque; safe in moderate portions.', tags: ['Dogs', 'Rabbits'] },
    { name: 'Cantaloupe & Seedless Watermelon', desc: 'Hydrating summer treat; ensure rinds and seeds are completely removed.', tags: ['Dogs', 'Cats'] },
  ];

  const avoidFoodsList = [
    { name: 'Chocolate & Cocoa (Theobromine)', danger: 'Severe', desc: 'Toxic methylxanthines cause cardiac arrhythmia, seizures, and hyperactivity.' },
    { name: 'Xylitol / Birch Bark Sweetener', danger: 'Critical Emergency', desc: 'Causes catastrophic rapid insulin surge, hypoglycemic collapse, and liver failure.' },
    { name: 'Grapes & Raisins', danger: 'Severe', desc: 'Unpredictable acute renal (kidney) failure even in microscopic quantities.' },
    { name: 'Onions, Garlic, Chives & Leeks', danger: 'High', desc: 'Causes oxidative damage to red blood cells leading to hemolytic anemia.' },
    { name: 'Cooked Bones of Any Animal', danger: 'High', desc: 'Brittle and splinter easily, causing intestinal perforations and emergency blockages.' },
    { name: 'Macadamia Nuts & Black Walnuts', danger: 'Moderate/High', desc: 'Causes hind-limb weakness, tremors, hyperthermia, and acute vomiting.' },
    { name: 'Avocado Pit, Skin & Foliage (Persin)', danger: 'Species Specific', desc: 'Extremely dangerous for birds and rabbits; high fat causes pancreatitis in dogs.' },
    { name: 'Caffeine, Alcohol & Raw Bread Dough', danger: 'Critical Emergency', desc: 'Ethanol poisoning and stomach expansion requiring emergency surgical decompression.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Nutritional Health Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Smart Feeding Planner
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Calibrated daily nutrition, meal timing, and food safety for <span className="font-semibold text-stone-800">{activePet.name}</span> ({activePet.breed}, {activePet.weight} kg).
          </p>
        </div>

        {/* Quick Hydration Metric */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50/70 backdrop-blur-xl border border-teal-200/80 text-teal-900 shadow-[0_4px_16px_rgba(13,148,136,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0 shadow-2xs">
            <Droplet className="w-5 h-5 fill-teal-600 stroke-teal-700" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">Hydration Target</div>
            <div className="text-sm font-bold text-teal-950 font-mono">~{estimatedWaterMl} ml / day</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Compliant with Frontend Design interactive tabs) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-xl rounded-2xl max-w-md border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)]">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'today'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          TODAY
        </button>
        <button
          onClick={() => setActiveTab('safe')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'safe'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          SAFE FOODS
        </button>
        <button
          onClick={() => setActiveTab('avoid')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'avoid'
              ? 'bg-white text-rose-900 shadow-xs'
              : 'text-stone-600 hover:text-rose-900'
          }`}
        >
          AVOID
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          TIPS
        </button>
      </div>

      {/* TAB 1: TODAY FEEDING TIMELINE */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Daily Timeline */}
          <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Today's Feeding Schedule
                </h2>
                <p className="text-xs text-stone-500">
                  Tap checkmarks to record meals. Click times to modify feeding schedule.
                </p>
              </div>

              <button
                onClick={() => setIsAddingMeal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Meal</span>
              </button>
            </div>

            {/* Timeline Items */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {feedingSchedule.map((meal) => (
                <div key={meal.id} className="relative group">
                  
                  {/* Timeline bullet / toggle checkmark */}
                  <button
                    onClick={() => toggleMealCompletion(meal.id)}
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      meal.completed
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-50'
                        : 'bg-white border-2 border-stone-300 text-transparent hover:border-emerald-700'
                    }`}
                    title={meal.completed ? 'Mark uncompleted' : 'Mark as fed'}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  <div className={`p-4 rounded-2xl border transition-all ${
                    meal.completed
                      ? 'bg-stone-50/70 border-stone-200 opacity-80'
                      : 'bg-white border-stone-200 shadow-2xs hover:border-amber-400'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {editingMealId === meal.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editedTime}
                              onChange={(e) => setEditedTime(e.target.value)}
                              placeholder="e.g. 07:30 AM"
                              className="px-2 py-1 rounded-lg border border-amber-400 text-xs font-mono font-bold w-24 outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveTime(meal.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-800 text-white text-[11px] font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMealId(null)}
                              className="px-2 py-1 text-stone-500 text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingMealId(meal.id);
                              setEditedTime(meal.time);
                            }}
                            className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Click to edit time"
                          >
                            <Clock className="w-3 h-3" />
                            <span>{meal.time}</span>
                            <Edit2 className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
                          </button>
                        )}

                        <span className={`text-sm font-bold ${meal.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {meal.name}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 font-medium sm:text-right">
                        {meal.portion}
                      </div>
                    </div>

                    {meal.notes && (
                      <p className="text-xs text-stone-500 mt-2 pl-1 border-l-2 border-stone-200">
                        {meal.notes}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Quick Add Meal Form Drawer */}
            {isAddingMeal && (
              <form onSubmit={handleAddNewMeal} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-amber-950">Add Feeding Event</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    placeholder="Meal Name (e.g. Afternoon Snack)"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={newMealTime}
                    onChange={(e) => setNewMealTime(e.target.value)}
                    placeholder="Time (e.g. 02:00 PM)"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={newMealPortion}
                    onChange={(e) => setNewMealPortion(e.target.value)}
                    placeholder="Portion / Food Item"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingMeal(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200/50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900"
                  >
                    Save Meal Event
                  </button>
                </div>
              </form>
            )}

            {/* Hydration Reminder Card */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
              <Droplet className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-teal-950">Hydration Best Practice for {activePet.name}</div>
                <p className="text-teal-800 leading-relaxed">
                  Clean, cool water should be refreshed at minimum twice daily. Pets consuming dry kibble require significantly higher fluid intake compared to those receiving fresh or wet moisture formulations.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: General Portion & Life-Stage Guidance */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Portion & Treat Rules
              </h3>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-2xs">
                  <span className="font-semibold text-stone-900 block mb-0.5">The 10% Treat Principle</span>
                  Biscuits, training rewards, and table toppers should never exceed 10% of total daily caloric expenditure to prevent micronutrient imbalance.
                </div>

                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-2xs">
                  <span className="font-semibold text-stone-900 block mb-0.5">Weighing vs Measuring Cups</span>
                  Standard dry measuring cups can vary by up to 20% in weight. Using a digital kitchen scale produces consistent metabolic regulation.
                </div>

                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-2xs">
                  <span className="font-semibold text-stone-900 block mb-0.5">Post-Meal Rest Window</span>
                  For medium to deep-chested canine breeds, avoid vigorous running or agility training within 60 minutes after eating to reduce gastric bloat risk.
                </div>
              </div>
            </div>

            {/* Life Stage Guidance */}
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] space-y-3">
              <h3 className="text-base font-bold text-stone-900">
                Age-Specific Considerations
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {activePet.name} is currently <span className="font-semibold text-stone-900">{activePet.age} years old</span>. At this stage, focus on maintaining an ideal Body Condition Score (BCS 4-5 on a 9-point scale) where ribs are easily felt without excess fat covering.
              </p>
            </div>

            {/* Link to 58+ Pet Food Section */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-stone-900 text-white shadow-xl space-y-3 relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                58+ Curated Pet Foods
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Order dry kibble, wet cans, raw bites, and clinical prescription diets with doorstep delivery or 45-min local clinic pickup.
              </p>
              <button
                onClick={() => setAppTab('food')}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse Food Pantry & Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SAFE FOODS */}
      {activeTab === 'safe' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-stone-900">Safe Healthy Whole Foods</h2>
            <p className="text-xs text-stone-500 mt-1">
              Natural additions and safe rewards in moderation. Always introduce new ingredients gradually.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeFoodsList.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Safe Topper</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 pt-3 border-t border-stone-100 text-[11px] text-stone-600">
                  {item.tags.map((t, i) => (
                    <span key={i} className="bg-stone-100 px-2 py-0.5 rounded-md font-medium text-stone-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FOODS TO AVOID */}
      {activeTab === 'avoid' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-rose-950">Foods to Strictly Avoid</h2>
            <p className="text-xs text-stone-500 mt-1">
              Common household items and ingredients that pose physiological and neurological toxicity risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {avoidFoodsList.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {item.danger}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TIPS & HYDRATION */}
      {activeTab === 'tips' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Veterinary Nutritional Habits</h2>
            
            <ul className="space-y-3 text-xs text-stone-700 leading-relaxed list-disc list-inside">
              <li>
                <span className="font-semibold text-stone-900">Transition slowly:</span> When altering brands or protein profiles, blend 25% new food with 75% old food over 7–10 days to avert acute gastrointestinal distress or bacterial flora imbalance.
              </li>
              <li>
                <span className="font-semibold text-stone-900">Cat hydration vigilance:</span> Domestic felines naturally possess low thirst drives. Incorporating high-moisture canned wet food or broth significantly reduces lifelong risks of feline idiopathic cystitis and renal issues.
              </li>
              <li>
                <span className="font-semibold text-stone-900">Slow feeders for gulping pets:</span> Rapid ingestion introduces excess swallowed air (aerophagia) and risks choking. Silicone puzzle bowls or foraging snuffle mats extend meal times pleasantly.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* MANDATORY VETERINARY NUTRITIONAL DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200 text-stone-600 text-xs leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-800">Veterinary Clinical Disclaimer:</span> The feeding planner provides general educational guidance based on standard pet metrics. <span className="font-medium text-stone-800">Do not interpret this as medical nutritional advice, prescription, or clinical diagnosis.</span> For exact caloric calculations, clinical prescription diets, severe food allergies, obesity management, diabetes, kidney disease, or pregnancy, please consult your licensed veterinarian.
        </div>
      </div>

    </div>
  );
};
