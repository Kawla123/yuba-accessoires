import { create } from "zustand";

export type FlyingDot = { id: number; from: DOMRect; to: DOMRect; image?: string };

let nextId = 1;

type FlyingDotsState = {
  dots: FlyingDot[];
  add: (from: DOMRect, to: DOMRect, image?: string) => void;
  remove: (id: number) => void;
};

export const useFlyingDots = create<FlyingDotsState>((set, get) => ({
  dots: [],
  add: (from, to, image) => {
    const id = nextId++;
    set({ dots: [...get().dots, { id, from, to, image }] });
  },
  remove: (id) => set({ dots: get().dots.filter((d) => d.id !== id) }),
}));
