import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      themeMode: 'light', // 'light', 'dark', 'system'
      compactMode: false,
      gxpPulseEnabled: true,
      autoSave: true,
      language: 'English (US)',

      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      setGxpPulse: (enabled) => set({ gxpPulseEnabled: enabled }),
      setLanguage: (lang) => set({ language: lang }),
      setAutoSave: (enabled) => set({ autoSave: enabled }),

      resetToDefault: () => set({
        themeMode: 'light',
        compactMode: false,
        gxpPulseEnabled: true,
        autoSave: true,
        language: 'English (US)'
      })
    }),
    {
      name: 'vantagepoint-settings', // unique name
    }
  )
);

export default useSettingsStore;
