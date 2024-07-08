import { create } from "zustand";

interface PlayStore {
    title: string;
    content: string;
    playUrl: File | null;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setPlayUrl: (playUrl: File | null) => void;
    resetPlay: () => void;
};

const usePlayStore = create<PlayStore>(set => ({
    title: '',
    content: '',
    playUrl: null,
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setPlayUrl: (playUrl) => set(state => ({...state, playUrl})),
    resetPlay: () => set(state => ({...state, title: '', content: '', playUrl: null}))
}));

export default usePlayStore;
