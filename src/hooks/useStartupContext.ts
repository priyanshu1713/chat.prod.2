import { create } from 'zustand';

export interface StartupData {
  fullName: string;
  phoneNumber: string;
  emailId: string;
  startupName: string;
  features: string;
  productStage: string;
  revenue: string;
  isSubmitted: boolean;
  submittedAt?: string;
}

interface StartupStore {
  startupData: StartupData | null;
  setStartupData: (data: StartupData) => void;
  clearStartupData: () => void;
  hasStartupData: () => boolean;
  getContextString: () => string;
  isSubmitted: () => boolean;
}

export const useStartupContext = create<StartupStore>((set, get) => ({
  startupData: null,
  
  setStartupData: (data: StartupData) => set({ startupData: data }),
  
  clearStartupData: () => set({ startupData: null }),
  
  hasStartupData: () => Boolean(get().startupData),
  
  isSubmitted: () => Boolean(get().startupData?.isSubmitted),
  
  getContextString: () => {
    const data = get().startupData;
    if (!data) return '';
    
    return `[User Context - Name: ${data.fullName}, Email: ${data.emailId}, Phone: ${data.phoneNumber}. Startup: ${data.startupName}, Features: ${data.features}, Stage: ${data.productStage}, Revenue: ${data.revenue}]`;
  }
}));