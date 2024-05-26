export type Listener = () => void;

let text = ""
let listeners: Array<Listener> = [];

export const store = {
  set: (newText: string) => {
    text = newText;
    notify()
  },

  subscribe: (listener: Listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener)
    };
  },

  getSnapshot: () => text,
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}