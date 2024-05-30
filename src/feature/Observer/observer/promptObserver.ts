import { Observer, Listener } from ".";

export enum PromptType {
  text,
  audio,
  doc,
}

export class PromptObserver implements Observer<PromptType, string> {
  private listeners: Map<PromptType, Array<Listener<string>>> = new Map();

  constructor() {}

  subscribe(listener: Listener<string>, event: PromptType) {
    const listeners = this.listeners.get(event) || [];
    this.listeners.set(event, [...listeners, listener]);
  }

  unsubscribe(listener: Listener<string>, event: PromptType) {
    const listeners = this.listeners.get(event) || [];
    this.listeners.set(event, listeners.filter(l => l !== listener));
  }

  notify(event: PromptType, content: string) {
    for (const listener of this.listeners.get(event) || []) {
      listener.update(content);
    }
  }
}

export class PromptObserverSingleton extends PromptObserver {
  private static instance: PromptObserver

  constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new PromptObserver();
    }

    return this.instance
  }
}

export class PromptListener implements Listener<string> {
  constructor(
    private action: (message: string) => void
  ) {}

  update(message: string) {
    this.action(message);
  }
}