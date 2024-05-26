export type Listener = () => void;
export type Unsubscribe = (l: Listener) => void;

let text = ""
const listeners = new Set<Listener>();

export const store = {
  set: (newText: string) => {
    text = newText;
    notify()
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },

  getSnapshot: () => text,
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}