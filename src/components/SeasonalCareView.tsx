import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flower2, 
  CheckCircle2, 
  Circle, 
  ThermometerSun, 
  ShieldAlert, 
  Compass, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

type Season = 'summer' | 'monsoon' | 'winter' | 'spring';
type Region = 'northern' | 'tropical' | 'southern';

export const SeasonalCareView: React.FC = () => {
  const { activePet, showToast } = useApp();

  // Region state to auto-calculate or manually adjust
  const [selectedRegion, setSelectedRegion] = useState<Region>('northern');

  // Compute current season based on current date and region
  const determineDefaultSeason = (region: Region): Season => {
    const month = new Date().getMonth(); // 0 = Jan, 9 = Oct
    if (region === 'tropical') {
      // In tropical zones: Monsoon roughly June-October, Winter Nov-Feb, Summer March-May
      if (month >= 5 && month <= 9) return 'monsoon';
      if (month >= 10 || month <= 1) return 'winter';
      return 'summer';
    } else if (region === 'southern') {
      // Southern hemisphere inverted
      if (month >= 11 || month <= 1) return 'summer';
      if (month >= 2 && month <= 4) return 'spring';
      if (month >= 5 && month <= 7) return 'winter';
      return 'spring';
    } else {
      // Northern hemisphere: Oct is Autumn/early Winter prep, June-Aug is Summer
      if (month >= 5 && month <= 7) return 'summer';
      if (month >= 8 && month <= 10) return 'winter'; // Winter & cool transition
      if (month >= 11 || month <= 1) return 'winter';
      return 'spring';
    }
  };

  const [activeSeason, setActiveSeason] = useState<Season>(() => determineDefaultSeason('northern'));

  // Checklist items
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'item-1': true,
    'item-2': false,
    'item-3': false,
    'item-4': true,
    'item-5': false,
  });

  const toggleChecklistItem = (id: string, text: string) => {
    setChecklist((prev) => {
      const nextVal = !prev[id];
      if (nextVal) {
        showToast(`Completed: ${text}`, 'success');
      }
      return { ...prev, [id]: nextVal };
    });
  };

  const handleRegionChange = (newRegion: Region) => {
    setSelectedRegion(newRegion);
    const calculated = determineDefaultSeason(newRegion);
    setActiveSeason(calculated);
    showToast(`Region updated. Highlighted season: ${calculated.toUpperCase()}`, 'info');
  };

  const seasonData = {
    summer: {
      name: 'Summer Care',
      tagline: 'Heatstroke Prevention & Outdoor Surface Safety',
      icon: Sun,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-900',
      bannerBg: 'bg-linear-to-r from-amber-50 to-orange-50 border-amber-200',
      guidelines: [
        {
          title: 'Hydration & Water Quality',
          desc: 'Position multiple ceramic or stainless water basins in cool shade. Drop in ice cubes or frozen bone broth blocks during peak afternoon warmth.',
        },
        {
          title: 'Avoiding Scorching Hot Surfaces',
          desc: 'Asphalt and sand absorb extreme thermal energy. Use the 7-Second Rule: if you cannot comfortably press the back of your hand onto pavement for 7 seconds, it is too hot for paws.',
        },
        {
          title: 'Early Morning & Late Dusk Walks',
          desc: 'Shift strenuous activity strictly to pre-7:30 AM or post-7:30 PM. Never walk during midday sun.',
        },
        {
          title: 'Grooming & Coat Shaving Warning',
          desc: 'Never shave double-coated breeds (like Golden Retrievers or Huskies); their outer coat insulates against radiant heat. Brush out undercoats instead.',
        },
      ],
      checklistItems: [
        { id: 'item-s1', text: 'Checked pavement temperature with back of hand prior to walk' },
        { id: 'item-s2', text: 'Refreshed outdoor and indoor water bowls with chilled clean water' },
        { id: 'item-s3', text: 'Checked car travel safety: never leave pet unattended in parked vehicle' },
        { id: 'item-s4', text: 'Inspected groin and belly for heat rash or chafing' },
      ],
    },
    monsoon: {
      name: 'Monsoon Care',
      tagline: 'Paw Fungal Hygiene, Damp Coat Care & Parasite Vigilance',
      icon: CloudRain,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-900',
      bannerBg: 'bg-linear-to-r from-blue-50 to-teal-50 border-blue-200',
      guidelines: [
        {
          title: 'Paw Pad & Interdigital Hygiene',
          desc: 'Dampness between toes breeds Malassezia yeast infections and pododermatitis. Wash paws in clean water and pat completely dry with microfiber towels after every rain excursion.',
        },
        {
          title: 'Thorough Coat Drying',
          desc: 'Never let damp fur dry naturally indoors, which encourages hot spots (acute moist dermatitis). Use a towel or gentle low-heat pet dryer.',
        },
        {
          title: 'Parasite Surge (Ticks, Fleas & Mosquitoes)',
          desc: 'Humidity causes rapid flea egg maturation and tick proliferation. Ensure veterinarian-directed oral or topical isoxazoline preventatives are strictly current.',
        },
        {
          title: 'Indoor Hygiene & Bedding Sanitation',
          desc: 'Wash pet bedding weekly in warm water and ensure resting spots are elevated away from damp tile floors.',
        },
      ],
      checklistItems: [
        { id: 'item-m1', text: 'Thoroughly dried interdigital spaces between paws after returning' },
        { id: 'item-m2', text: 'Checked ear canals for dampness, foul odor, or moisture buildup' },
        { id: 'item-m3', text: 'Verified monthly flea, tick, and heartworm preventative date' },
        { id: 'item-m4', text: 'Ensured drinking water is filtered to prevent waterborne leptospirosis' },
      ],
    },
    winter: {
      name: 'Winter Care',
      tagline: 'Warm Bedding, Draft Protection & Paw Salt Defense',
      icon: Snowflake,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      badgeColor: 'bg-sky-100 text-sky-900',
      bannerBg: 'bg-linear-to-r from-sky-50 to-stone-100 border-sky-200',
      guidelines: [
        {
          title: 'Elevated & Draft-Free Warm Bedding',
          desc: 'Tile and wooden floors lose thermal heat rapidly. Place orthopedic beds 2–3 inches off drafts with insulated blankets, particularly for senior pets with osteoarthritis.',
        },
        {
          title: 'Cold Weather Walk Exposure',
          desc: 'Shorten duration of outdoor strolls during sub-zero chill. Watch for shivering, paw lifting, or reluctance to walk.',
        },
        {
          title: 'De-Icing Salt & Chemical Toxin Defense',
          desc: 'Sidewalk road salts contain calcium chloride which cracks paw pads and causes toxic ingestion if licked. Wash paws immediately upon returning inside.',
        },
        {
          title: 'Indoor Air Dryness & Hydration',
          desc: 'Indoor heating drys skin and respiratory passages. Pets drink less cold water; provide lukewarm water bowls and consider pet-safe room humidifiers.',
        },
      ],
      checklistItems: [
        { id: 'item-w1', text: 'Wiped paws clean of toxic road salts, grit, and ice balls' },
        { id: 'item-w2', text: 'Checked that bedding is protected from floor drafts' },
        { id: 'item-w3', text: 'Provided room-temperature water bowl (refreshed twice daily)' },
        { id: 'item-w4', text: 'Applied natural paw balm to prevent winter paw cracking' },
      ],
    },
    spring: {
      name: 'Spring Care',
      tagline: 'Environmental Pollen, Shedding & Early Parasite Control',
      icon: Flower2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      bannerBg: 'bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-200',
      guidelines: [
        {
          title: 'Environmental Allergen Mitigation',
          desc: 'Blooming grasses and tree pollens trigger atopic dermatitis (paw chewing, belly redness, eye discharge). Wipe body and paws with damp cloth after walks.',
        },
        {
          title: 'Spring Shedding & Undercoat Raking',
          desc: 'Pets shed their winter coats. Regular de-shedding rakes prevent painful mats, skin suffocation, and excessive hairball ingestion in cats.',
        },
        {
          title: 'Awakening Ticks & Vector Mosquitoes',
          desc: 'Rising spring temperatures activate overwintered ticks. Brush through coats after romps through tall shrubs and brushy terrain.',
        },
        {
          title: 'Garden Chemical & Toxic Plant Safety',
          desc: 'Spring fertilizers, snail baits, and blooming lilies (fatal to cats) and azaleas must be kept strictly out of pet environments.',
        },
      ],
      checklistItems: [
        { id: 'item-sp1', text: 'Wiped coat down with damp towel to remove outdoor pollen dust' },
        { id: 'item-sp2', text: 'Conducted 5-minute tactile check for ticks around neck and ears' },
        { id: 'item-sp3', text: 'Ensured yard is free of toxic fertilizers, snail bait, or cocoa mulch' },
        { id: 'item-sp4', text: 'Brushed undercoat to release loose seasonal winter hair' },
      ],
    },
  };

  const currentConfig = seasonData[activeSeason];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Environmental Wellness</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Seasonal Care Guide
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Proactive health protocols adapted to current climate, humidity, and temperature conditions for <span className="font-semibold text-stone-800">{activePet.name}</span>.
          </p>
        </div>

        {/* Region selector to auto-adapt highlight */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium">Your Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value as Region)}
            className="text-xs font-semibold text-stone-800 bg-transparent outline-none cursor-pointer"
          >
            <option value="northern">Northern Hemisphere (Subtropical/Temperate)</option>
            <option value="tropical">Tropical / Monsoon Zone</option>
            <option value="southern">Southern Hemisphere</option>
          </select>
        </div>
      </div>

      {/* 4 Season Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(seasonData) as Season[]).map((seasonKey) => {
          const s = seasonData[seasonKey];
          const Icon = s.icon;
          const isSelected = activeSeason === seasonKey;

          return (
            <button
              key={seasonKey}
              onClick={() => setActiveSeason(seasonKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-emerald-700 shadow-md ring-1 ring-emerald-700'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-stone-900">{s.name}</div>
              <div className="text-[11px] text-stone-500 truncate mt-0.5">{s.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Active Season Banner & Guidelines */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${currentConfig.bannerBg} space-y-6 shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-xs ${currentConfig.color}`}>
              <currentConfig.icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentConfig.badgeColor}`}>
                Current Protocol: {currentConfig.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                {currentConfig.tagline}
              </h2>
            </div>
          </div>

          <div className="text-xs text-stone-600 sm:text-right">
            Adapted for <span className="font-semibold text-stone-900">{activePet.name}</span> ({activePet.animalType})
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {currentConfig.guidelines.map((guide, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/90 backdrop-blur-xs border border-stone-200/80 shadow-2xs space-y-2">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span>{guide.title}</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {guide.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TODAY'S SEASONAL CHECKLIST */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Today's Seasonal Health Checklist</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Daily preventive physical verification for {activePet.name} during {currentConfig.name.toLowerCase()}.
            </p>
          </div>

          <div className="text-xs font-semibold text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            {currentConfig.checklistItems.filter((i) => checklist[i.id]).length} of {currentConfig.checklistItems.length} Verified
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentConfig.checklistItems.map((item) => {
            const isDone = Boolean(checklist[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id, item.text)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-stone-900'
                    : 'bg-stone-50/60 border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-700 text-white'
                      : 'border-2 border-stone-300 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className={`text-xs font-medium leading-snug ${isDone ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
