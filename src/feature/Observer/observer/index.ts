export interface Listener<T> {
  update(content: T): void
}

export interface Observer<T, V> {
  subscribe(listener: Listener<V>, event: T): void
  unsubscribe(listener: Listener<V>, event: T): void
  notify(event: T, content: V): void
}