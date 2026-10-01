import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimalType, Pet } from '../../types';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

interface NewPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPet?: Pet | null;
}

const PRESET_AVATARS = [
  '/src/assets/images/pet_bruno_dog_1790874519554.jpg',
  '/src/assets/images/pet_luna_cat_1790874531607.jpg',
  '/src/assets/images/pet_milo_beagle_1790874541386.jpg',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&auto=format&fit=crop&q=80', // Rabbit
  'https://images.unsplash.com/photo-1522858547550-3404744e3348?w=300&auto=format&fit=crop&q=80', // Bird
];

export const NewPetModal: React.FC<NewPetModalProps> = ({ isOpen, onClose, editingPet }) => {
  const { addPet, updatePet } = useApp();

  const [name, setName] = useState(editingPet?.name || '');
  const [animalType, setAnimalType] = useState<AnimalType>(editingPet?.animalType || 'Dog');
  const [breed, setBreed] = useState(editingPet?.breed || '');
  const [age, setAge] = useState<number>(editingPet?.age || 2);
  const [dateOfBirth, setDateOfBirth] = useState(editingPet?.dateOfBirth || '2024-03-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Neutered Male' | 'Spayed Female'>(
    editingPet?.gender || 'Neutered Male'
  );
  const [weight, setWeight] = useState<number>(editingPet?.weight || 14.5);
  const [activityLevel, setActivityLevel] = useState<'Low' | 'Moderate' | 'High' | 'Very High'>(
    editingPet?.activityLevel || 'Moderate'
  );
  const [allergies, setAllergies] = useState(editingPet?.allergies || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(editingPet?.dietaryRestrictions || '');
  const [indoorOutdoor, setIndoorOutdoor] = useState<'Indoor' | 'Outdoor' | 'Both'>(
    editingPet?.indoorOutdoor || 'Both'
  );
  const [photoUrl, setPhotoUrl] = useState(editingPet?.photoUrl || PRESET_AVATARS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your pet’s name.');
      return;
    }
    if (!breed.trim()) {
      setErrorMsg('Please specify your pet’s breed or type.');
      return;
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 0 || numAge > 40) {
      setErrorMsg('Please enter a valid age (0 to 40 years).');
      return;
    }

    const numWeight = Number(weight);
    if (isNaN(numWeight) || numWeight <= 0 || numWeight > 200) {
      setErrorMsg('Please enter a valid positive weight in kg.');
      return;
    }

    if (editingPet) {
      updatePet({
        ...editingPet,
        name: name.trim(),
        animalType,
        breed: breed.trim(),
        age: Number(age) || 1,
        dateOfBirth,
        gender,
        weight: Number(weight) || 5,
        activityLevel,
        allergies: allergies.trim() || 'None recorded',
        dietaryRestrictions: dietaryRestrictions.trim() || 'Standard balanced diet',
        indoorOutdoor,
        photoUrl,
      });
    } else {
      addPet({
        name: name.trim(),
        animalType,
        breed: breed.trim(),
        age: Number(age) || 1,
        dateOfBirth,
        gender,
        weight: Number(weight) || 5,
        activityLevel,
        allergies: allergies.trim() || 'None recorded',
        dietaryRestrictions: dietaryRestrictions.trim() || 'Standard balanced diet',
        indoorOutdoor,
        photoUrl,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF9F5]">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {editingPet ? `Edit ${editingPet.name}’s Profile` : 'Register New Companion'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Personalized health, feeding schedules, and seasonal warnings rely on these details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-800">
              Companion Photo
            </label>
            <div className="flex items-center gap-4">
              <img
                src={photoUrl}
                alt="Selected preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-700/30 shadow-xs"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-medium transition-colors border border-stone-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-stone-500">or pick a sample:</span>
                </div>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(avatar)}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                        photoUrl === avatar ? 'border-emerald-700 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Pet Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bruno"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Animal Species *
              </label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value as AnimalType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors bg-white"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other Companion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Breed / Variety *
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={age}
                onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Gender & Reproductive Status
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors bg-white"
              >
                <option value="Neutered Male">Neutered Male</option>
                <option value="Spayed Female">Spayed Female</option>
                <option value="Male">Intact Male</option>
                <option value="Female">Intact Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0.1"
                max="120"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors bg-white"
              >
                <option value="Low">Low (Lap pet / Senior)</option>
                <option value="Moderate">Moderate (Daily walks)</option>
                <option value="High">High (Energetic / Active)</option>
                <option value="Very High">Very High (Sporting / Working)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Living Environment
              </label>
              <select
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors bg-white"
              >
                <option value="Indoor">Indoor Only</option>
                <option value="Both">Both Indoor & Outdoor</option>
                <option value="Outdoor">Outdoor Primary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Known Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Poultry, grass pollen, beef (or None)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Dietary Restrictions / Special Feeds
            </label>
            <input
              type="text"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g. Grain-friendly kibble with fresh pumpkin topper"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none transition-colors"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingPet ? 'Save Changes' : 'Save Companion Profile'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
