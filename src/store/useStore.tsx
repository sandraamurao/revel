import { create } from 'zustand'
import type { Issue } from '../utils/compareJson'

interface StoreState {
    sourceOfTruth: string
    requestJson: string
    responseJson: string
    issues: Issue[]
    error: string
    aiExplanation: string
    setSourceOfTruth: (value: string) => void
    setRequest: (value: string) => void
    setResponse: (value: string) => void
    setIssues: (issues: Issue[]) => void
    setError: (error: string) => void
    setAiExplanation: (text: string) => void
}

export const useApiState = create<StoreState>((set) => ({
    sourceOfTruth: "Request",
    requestJson: "",
    responseJson: "",
    issues: [],
    error: "",
    aiExplanation: "",
    setSourceOfTruth: (truth) => set({ sourceOfTruth: truth }),
    setRequest: (request) => set({requestJson: request}),
    setResponse: (response) => set({responseJson: response}),
    setIssues: (i) => set({issues: i}),
    setError: (err) => set({error: err}),
    setAiExplanation: (explanation) => set({aiExplanation: explanation})
}))

