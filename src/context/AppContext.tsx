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
  NavTab,
  Order,
  OrderFulfillment,
  PickupHub,
  UserProfile,
  UserRole,
  AuthUser
} from '../types';
import { 
  INITIAL_PETS, 
  INITIAL_FEEDING_SCHEDULES, 
  INITIAL_REMINDERS, 
  VETERINARIANS, 
  PRODUCTS 
} from '../data/mockData';
import { PET_FOOD_LIST, OFFLINE_PICKUP_HUBS } from '../data/petFoodData';
import { ADDITIONAL_STORE_PRODUCTS } from '../data/storeProducts';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export const DEFAULT_ACCOUNTS: AuthUser[] = [
  {
    id: 'usr-sarah',
    username: 'user',
    email: 'user@pawcare.com',
    password: 'user123',
    name: 'Sarah Jenkins',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
    memberSince: 'March 2024',
    notificationPreferences: {
      email: true,
      sms: true,
      feedingAlerts: true,
      appointmentReminders: true,
    },
  },
  {
    id: 'adm-marcus',
    username: 'admin',
    email: 'admin@pawcare.com',
    password: 'admin123',
    name: 'Dr. Marcus Vance (Chief Vet & Admin)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 987-6543',
    address: 'PawCare Central Hospital & Surgical Center, Suite 400',
    memberSince: 'January 2023',
    notificationPreferences: {
      email: true,
      sms: true,
      feedingAlerts: false,
      appointmentReminders: true,
    },
  },
];

export const DEFAULT_USER: UserProfile = DEFAULT_ACCOUNTS[0];
export const DEFAULT_ADMIN: UserProfile = DEFAULT_ACCOUNTS[1];

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Real Authentication & Session
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  login: (idOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: { username: string; email: string; password: string; name: string; role: UserRole; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Pets
  pets: Pet[];
  activePet: Pet;
  setActivePetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id' | 'wellness'>) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  
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
  
  // Store, Food & Inventory
  products: Product[];
  petFoods: Product[];
  toggleProductStock: (productId: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders (Online Delivery & Offline Pickup)
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  
  // Registered Accounts Database
  const [usersDb, setUsersDb] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_users_db');
      return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_users_db', JSON.stringify(usersDb));
    } catch (e) {
      console.warn(e);
    }
  }, [usersDb]);

  // Auth & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem('pawcare_auth_token');
      return token !== null;
    } catch {
      return true; // Default logged in for pleasant initial preview
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pawcare_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('pawcare_current_user', JSON.stringify(currentUser));
        localStorage.setItem('pawcare_auth_token', `jwt_token_${currentUser.id}_${Date.now()}`);
      } else {
        localStorage.removeItem('pawcare_current_user');
        localStorage.removeItem('pawcare_auth_token');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  // Real Login with ID/Email & Password
  const login = async (idOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = idOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Please enter both your User ID / Email and Password.' };
    }

    const matched = usersDb.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        u.password === cleanPass
    );

    if (!matched) {
      return {
        success: false,
        error: 'Invalid User ID or Password. Try user / user123 or admin / admin123',
      };
    }

    // Set authenticated state
    setIsAuthenticated(true);
    setCurrentUser(matched);
    setIsAuthModalOpen(false);

    showToast(
      matched.role === 'admin'
        ? `Authenticated as Clinic Administrator (${matched.name})`
        : `Welcome back, ${matched.name}!`,
      'success'
    );

    // Route to appropriate panel
    if (matched.role === 'admin') {
      setActiveTab('admin_panel');
    } else {
      setActiveTab('user_panel');
    }

    return { success: true };
  };

  // Real Logout
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('pawcare_current_user');
      localStorage.removeItem('pawcare_auth_token');
    } catch (e) {
      console.warn(e);
    }
    showToast('You have been logged out securely.', 'info');
    setActiveTab('home');
  };

  // Real Registration
  const register = async (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    address?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanUser || !cleanEmail || !data.password || !data.name) {
      return { success: false, error: 'All primary fields are required to register.' };
    }

    const exists = usersDb.some(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return { success: false, error: 'Username or Email is already registered.' };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      username: cleanUser,
      email: cleanEmail,
      password: data.password,
      name: data.name.trim(),
      role: data.role,
      avatarUrl:
        data.role === 'admin'
          ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: data.phone || '+1 (555) 000-0000',
      address: data.address || 'PawCare Member Address',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      notificationPreferences: {
        email: true,
        sms: true,
        feedingAlerts: true,
        appointmentReminders: true,
      },
    };

    setUsersDb((prev) => [...prev, newUser]);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    showToast(`Account created! Welcome to PawCare, ${newUser.name}.`, 'success');

    if (newUser.role === 'admin') {
      setActiveTab('admin_panel');
    } else {
      setActiveTab('user_panel');
    }

    return { success: true };
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      const adminAcc = usersDb.find((u) => u.role === 'admin') || DEFAULT_ADMIN;
      setIsAuthenticated(true);
      setCurrentUser(adminAcc);
      setActiveTab('admin_panel');
      showToast('Switched to Administrator Command Center', 'info');
    } else {
      const userAcc = usersDb.find((u) => u.role === 'user') || DEFAULT_USER;
      setIsAuthenticated(true);
      setCurrentUser(userAcc);
      setActiveTab('user_panel');
      showToast('Switched to Pet Parent Portal', 'info');
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsersDb((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)));
    showToast('Profile updated successfully', 'success');
  };

  // Products & Inventory State
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_all_products');
      return saved ? JSON.parse(saved) : [...PRODUCTS, ...ADDITIONAL_STORE_PRODUCTS, ...PET_FOOD_LIST];
    } catch {
      return [...PRODUCTS, ...ADDITIONAL_STORE_PRODUCTS, ...PET_FOOD_LIST];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_all_products', JSON.stringify(allProducts));
    } catch (e) {
      console.warn(e);
    }
  }, [allProducts]);

  const toggleProductStock = (productId: string) => {
    setAllProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = !p.inStock;
          showToast(`${p.name} marked as ${nextStock ? 'In Stock' : 'Out of Stock'}`, 'info');
          return { ...p, inStock: nextStock };
        }
        return p;
      })
    );
  };

  const addProduct = (product: Product) => {
    setAllProducts((prev) => [product, ...prev]);
    showToast(`Added "${product.name}" to catalog`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'info');
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  // Pets State
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_pets');
      if (saved) {
        const parsed: Pet[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.photoUrl && p.photoUrl.startsWith('/src/assets/')) {
            const matched = INITIAL_PETS.find((ip) => ip.id === p.id);
            return {
              ...p,
              photoUrl: matched ? matched.photoUrl : p.photoUrl.replace('/src/assets/', '/assets/'),
            };
          }
          return p;
        });
      }
      return INITIAL_PETS;
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

  // Orders State (Online Delivery & Offline Pickup)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('pawcare_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pawcare_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const isOnline = orderData.fulfillment === 'online';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `PC-${isOnline ? 'DEL' : 'PCK'}-${Date.now().toString().slice(-4)}${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: isOnline ? 'Processing' : 'Ready for Pickup',
      trackingNumber: isOnline ? `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}` : undefined,
      pickupCode: !isOnline ? `PCPASS-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      courierName: isOnline ? 'PawCare Express Priority Dispatch' : undefined,
      estimatedDelivery: isOnline ? (orderData.deliverySpeed || 'Estimated within 2 business days') : undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(
      isOnline 
        ? `Order #${newOrder.orderNumber} placed for home delivery!` 
        : `Order #${newOrder.orderNumber} confirmed! Ready for counter pickup.`,
      'success'
    );
    return newOrder;
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

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    showToast('Pet profile removed', 'info');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to: "${status}"`, 'success');
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
        isAuthenticated,
        currentUser,
        setCurrentUser,
        login,
        logout,
        register,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        switchRole,
        updateUserProfile,
        pets,
        activePet,
        setActivePetId,
        addPet,
        updatePet,
        deletePet,
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
        products: allProducts,
        petFoods: allProducts.filter((p) => p.category === 'Food'),
        toggleProductStock,
        addProduct,
        deleteProduct,
        updateProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        updateOrderStatus,
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
