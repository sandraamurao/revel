import { create } from 'zustand'
import type { Issue } from '../utils/compareJson'

interface StoreState {
    isLoading: boolean
    sourceOfTruth: string
    requestJson: string
    responseJson: string
    issues: Issue[]
    error: string
    aiExplanation: string
    analyzedRequest: string
    analyzedResponse: string
    setIsLoading: (value: boolean) => void
    setSourceOfTruth: (value: string) => void
    setRequest: (value: string) => void
    setResponse: (value: string) => void
    setIssues: (issues: Issue[]) => void
    setError: (error: string) => void
    setAiExplanation: (text: string) => void
    setAnalyzedRequest: (value: string) => void
    setAnalyzedResponse: (value: string) => void
}

export const useApiState = create<StoreState>((set) => ({
    isLoading: false,
    sourceOfTruth: "Request",
    requestJson: "",
    responseJson: "",
    issues: [],
    error: "",
    aiExplanation: "",
    analyzedRequest: "",
    analyzedResponse: "",
    setIsLoading: (l) => set({isLoading: l}),
    setSourceOfTruth: (truth) => set({ sourceOfTruth: truth }),
    setRequest: (request) => set({requestJson: request}),
    setResponse: (response) => set({responseJson: response}),
    setIssues: (i) => set({issues: i}),
    setError: (err) => set({error: err}),
    setAiExplanation: (explanation) => set({aiExplanation: explanation}),
    setAnalyzedRequest: (req) => set({analyzedRequest: req}),
    setAnalyzedResponse: (res) => set({analyzedResponse: res}),
}))

