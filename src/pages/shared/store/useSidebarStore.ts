import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
  isMobile: boolean;
  setMobile: (mobile: boolean) => void;
}

export const useSidebarStore = create<SidebarState>(set => ({
  isOpen: false,
  isMobile: false,
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
  open: () => set({ isOpen: true }),
  setMobile: (mobile: boolean) => set({ isMobile: mobile }),
}));
