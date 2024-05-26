// https://github.dev/facebook/react/blob/main/packages/react/src/ReactHooks.js
import { useEffect, useLayoutEffect, useState } from "react";
import { Listener, Unsubscribe } from "./store";

export function useOwnSyncExternalStore<T>(
  subscribe: (callback: Listener) => Unsubscribe,
  getSnapshot: () => T
) {
  const value = getSnapshot();

  const [{ store }, forceUpdate] = useState({ store: { value, getSnapshot } })

  useLayoutEffect(() => {
    store.value = value;
    store.getSnapshot = getSnapshot;

    if (checkIfSnapshotChanged(store)) {
      forceUpdate({ store })
    }
  }, [store, getSnapshot, value])

  useEffect(() => {
    // before the subscribe
    if (checkIfSnapshotChanged(store)) {
      forceUpdate({ store })
    }

    function onStoreChange() {
      if (checkIfSnapshotChanged(store)) {
        forceUpdate({ store })
      }
    }
    
    const unsubscribe = subscribe(onStoreChange)

    return () => unsubscribe(onStoreChange)
  }, [subscribe])

  return value;
}

function checkIfSnapshotChanged<T>({value, getSnapshot}: {value: T, getSnapshot: () => T}) {
  const prevValue = value;
  try {
    const currentValue = getSnapshot();
    return !Object.is(prevValue, currentValue);
  } catch {
    return true;
  }
}