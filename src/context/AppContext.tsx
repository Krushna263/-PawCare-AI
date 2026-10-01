import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Pet, 
  FeedingMeal, 
  Reminder, 
  Veterinarian, 
  VetAppointment, 
  AppointmentStatus,
  Product, 
  CartItem, 
  NavTab 
} from '../types';
import { 
  INITIAL_PETS, 
  INITIAL_FEEDING_SCHEDULES, 
  INITIAL_REMINDERS, 
  VETERINARIANS, 
  PRODUCTS 
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pets: Pet[];
  activePet: Pet;
  setActivePetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id' | 'wellness'>) => void;
  updatePet: (pet: Pet) => void;
  
  // Feeding
  feedingSchedule: FeedingMeal[];
  toggleMealCompletion: (mealId: string) => void;
  updateMealTime: (mealId: string, newTime: string) => void;
  addMeal: (meal: Omit<FeedingMeal, 'id' | 'completed'>) => void;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  // Vet Appointments
  vets: Veterinarian[];
  appointments: VetAppointment[];
  bookAppointment: (appointment: Omit<VetAppointment, 'id' | 'createdAt'>) => VetAppointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  
  // Store & Cart
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  
  // Pets State
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_pets');
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  const [activePetId, setActivePetIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pawcare_active_pet_id');
      return saved && INITIAL_PETS.some(p => p.id === saved) ? saved : INITIAL_PETS[0].id;
    } catch {
      return INITIAL_PETS[0].id;
    }
  });

  const activePet = pets.find((p) => p.id === activePetId) || pets[0] || INITIAL_PETS[0];

  const setActivePetId = (id: string) => {
    setActivePetIdState(id);
    try {
      localStorage.setItem('pawcare_active_pet_id', id);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_pets', JSON.stringify(pets));
    } catch (e) {
      console.warn(e);
    }
  }, [pets]);

  // Feeding Schedules
  const [feedingMap, setFeedingMap] = useState<Record<string, FeedingMeal[]>>(() => {
    try {
      const saved = localStorage.getItem('pawcare_feeding');
      return saved ? JSON.parse(saved) : INITIAL_FEEDING_SCHEDULES;
    } catch {
      return INITIAL_FEEDING_SCHEDULES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_feeding', JSON.stringify(feedingMap));
    } catch (e) {
      console.warn(e);
    }
  }, [feedingMap]);

  const feedingSchedule = feedingMap[activePet.id] || [
    {
      id: 'default-1',
      time: '08:00 AM',
      name: 'Morning Nourishment',
      portion: 'Customized portion according to vet plan',
      completed: false,
    },
    {
      id: 'default-2',
      time: '06:30 PM',
      name: 'Evening Dinner',
      portion: 'Customized portion according to vet plan',
      completed: false,
    }
  ];

  const toggleMealCompletion = (mealId: string) => {
    setFeedingMap((prev) => {
      const list = prev[activePet.id] || [];
      const updated = list.map((m) =>
        m.id === mealId ? { ...m, completed: !m.completed } : m
      );
      return { ...prev, [activePet.id]: updated };
    });
  };

  const updateMealTime = (mealId: string, newTime: string) => {
    setFeedingMap((prev) => {
      const list = prev[activePet.id] || [];
      const updated = list.map((m) =>
        m.id === mealId ? { ...m, time: newTime } : m
      );
      return { ...prev, [activePet.id]: updated };
    });
    showToast(`Feeding time adjusted to ${newTime}`, 'info');
  };

  const addMeal = (meal: Omit<FeedingMeal, 'id' | 'completed'>) => {
    const newMealItem: FeedingMeal = {
      ...meal,
      id: `meal-${Date.now()}`,
      completed: false,
    };
    setFeedingMap((prev) => {
      const list = prev[activePet.id] || [];
      return { ...prev, [activePet.id]: [...list, newMealItem] };
    });
    showToast(`New feeding schedule added for ${activePet.name}`, 'success');
  };

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_reminders', JSON.stringify(reminders));
    } catch (e) {
      console.warn(e);
    }
  }, [reminders]);

  const addReminder = (data: Omit<Reminder, 'id' | 'completed'>) => {
    const newRem: Reminder = {
      ...data,
      id: `rem-${Date.now()}`,
      completed: false,
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast(`Reminder created: "${data.title}"`, 'success');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder deleted', 'info');
  };

  // Appointments
  const [appointments, setAppointments] = useState<VetAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_appointments');
      return saved ? JSON.parse(saved) : [
        {
          id: 'apt-sample-priya',
          petId: 'pet-bruno',
          petName: 'Bruno',
          petBreed: 'Golden Retriever',
          petAge: 3,
          vetId: 'vet-priya',
          vetName: 'Dr. Priya Shah',
          clinic: 'PetCare Veterinary Clinic',
          specialty: 'General Practice',
          date: '5 October 2026',
          time: '04:00 PM',
          consultationType: 'In-person',
          consultationFee: 500,
          currency: '₹',
          reason: 'General check-up',
          additionalInfo: 'Routine seasonal health review and wellness assessment.',
          status: 'Awaiting confirmation',
          bookingMethod: 'whatsapp',
          vetPhone: '9503066958',
          createdAt: '2026-10-01',
        },
        {
          id: 'apt-sample-1',
          petId: 'pet-bruno',
          petName: 'Bruno',
          petBreed: 'Golden Retriever',
          petAge: 3,
          vetId: 'vet-1',
          vetName: 'Dr. Sarah Lin, DVM',
          clinic: 'Oakridge Companion Animal Hospital',
          specialty: 'General Practice',
          date: '14 October 2026',
          time: '11:15 AM',
          consultationType: 'In-person',
          consultationFee: 65,
          currency: '$',
          reason: 'Vaccination',
          additionalInfo: 'Annual DHPP and rabies booster consultation.',
          status: 'Confirmed',
          bookingMethod: 'whatsapp',
          vetPhone: '15551234567',
          createdAt: '2026-09-28',
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn(e);
    }
  }, [appointments]);

  const bookAppointment = (data: Omit<VetAppointment, 'id' | 'createdAt'>): VetAppointment => {
    const newApt: VetAppointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: data.status || 'Awaiting confirmation',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment request prepared for ${data.vetName}!`, 'success');
    return newApt;
  };

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Status updated: ${newStatus}`, 'info');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    );
    showToast('Appointment request cancelled', 'info');
  };

  // Store & Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[6], quantity: 2 },
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addPet = (petData: Omit<Pet, 'id' | 'wellness'>) => {
    const newPet: Pet = {
      ...petData,
      id: `pet-${Date.now()}`,
      wellness: {
        nutrition: 85,
        hydration: 80,
        activity: 85,
        vaccinations: 90,
        reminders: 75,
      },
    };
    setPets((prev) => [...prev, newPet]);
    setActivePetId(newPet.id);
    showToast(`Welcome ${newPet.name} to PawCare!`, 'success');
  };

  const updatePet = (updated: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`${updated.name}'s profile updated`, 'success');
  };

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        pets,
        activePet,
        setActivePetId,
        addPet,
        updatePet,
        feedingSchedule,
        toggleMealCompletion,
        updateMealTime,
        addMeal,
        reminders,
        addReminder,
        toggleReminder,
        deleteReminder,
        vets: VETERINARIANS,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        products: PRODUCTS,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
