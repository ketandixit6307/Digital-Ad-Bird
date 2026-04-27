import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  subscriptionStatus: string;
  currentPlan: string;
  stripeCustomerId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },
}));

interface ChatState {
  activeContactId: string | null;
  unreadCount: number;
  setActiveContactId: (id: string | null) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeContactId: null,
  unreadCount: 0,
  setActiveContactId: (id) => set({ activeContactId: id }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),
}));
