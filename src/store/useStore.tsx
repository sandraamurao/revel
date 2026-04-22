import { create } from 'zustand'
import type { Issue } from '../utils/compareJson'

interface StoreState {
    requestJson: string
    responseJson: string
    issues: Issue[]
    error: string
    setRequest: (value: string) => void
    setResponse: (value: string) => void
    setIssues: (issues: Issue[]) => void
    setError: (error:string) => void
}

export const useApiState = create<StoreState>((set) => ({
    requestJson: "",
    responseJson: "",
    issues: [],
    error: "",
    setRequest: (request) => set({requestJson: request}),
    setResponse: (response) => set({responseJson: response}),
    setIssues: (i) => set({issues: i}),
    setError: (err) => set({error: err})
}))

