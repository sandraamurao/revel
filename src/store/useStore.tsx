import { create } from 'zustand'

interface StoreState {
    requestJson: string
    responseJson: string
    setRequest: (value: string) => void,
    setResponse: (value: string) => void
}

export const useApiState = create<StoreState>((set) => ({
    requestJson: "",
    responseJson: "",
    setRequest: (request) => set({requestJson: request}),
    setResponse: (response) => set({responseJson: response}),
}))