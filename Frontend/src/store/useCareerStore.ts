import { create } from 'zustand'

export interface LearningStep {
  step: number
  content: string
}

export interface CareerResult {
  career: string
  salary: string
  skills: string[]
  learning_path: LearningStep[]
  confidence: number
}

interface CareerStore {
  mainCareer: CareerResult | null
  otherCareers: CareerResult[]
  isPersonalized: boolean
  setResults: (main: CareerResult, others: CareerResult[]) => void
  reset: () => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  mainCareer: null,
  otherCareers: [],
  isPersonalized: false,
  setResults: (main, others) =>
    set({ mainCareer: main, otherCareers: others, isPersonalized: true }),
  reset: () =>
    set({ mainCareer: null, otherCareers: [], isPersonalized: false }),
}))