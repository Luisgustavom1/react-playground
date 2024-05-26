
// Tests copy-pasted from the React 18 source files.
// https://github.dev/facebook/react/blob/main/packages/react/src/ReactHooks.js
import { useOwnSyncExternalStore } from './useOwnSyncExternalStore';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import React, { useEffect, useLayoutEffect, useState } from 'react';

// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true

type CreateExternalStore = ReturnType<typeof createExternalStore>

let logs: Array<unknown> = []

function log(text: unknown) {
  logs.push(text);
}

function assertLog(expected: Array<unknown>) {
  expect(logs).toEqual(expected);
  logs = [];
}

function createExternalStore<T>(initialState: T) {
  const listeners = new Set<() => void>();
  let currentState = initialState;
  return {
    set(text: T) {
      currentState = text;
      listeners.forEach(listener => listener());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState() {
      return currentState;
    },
    getSubscriberCount() {
      return listeners.size;
    },
  };
}

describe('useOwnSyncExternalStore', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  function Text({ text }: { text: string }) {
    log(text);
    return text;
  }

  it('native version', async () => {
    const store = createExternalStore('client');

    function App() {
      const text = useOwnSyncExternalStore(
        store.subscribe,
        store.getState,
      );
      return <Text text={text} />;
    }

    const container = document.createElement('div');
    const root = createRoot(container);
    
    await act(() => {
      root.render(<App />);
    });

    assertLog(['client']);
    expect(container.textContent).toEqual('client');
  });

  it('basic usage', async () => {
    const store = createExternalStore('Initial');
    function App() {
      const text = useOwnSyncExternalStore(store.subscribe, store.getState);
      return React.createElement(Text, {
        text: text,
      });
    } 
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['Initial']);
    expect(container.textContent).toEqual('Initial');
    await act(() => {
      store.set('Updated');
    });
    assertLog(['Updated']);
    expect(container.textContent).toEqual('Updated');
  });
  it('skips re-rendering if nothing changes', async () => {
    const store = createExternalStore('Initial');
    function App() {
      const text = useOwnSyncExternalStore(store.subscribe, store.getState);
      return React.createElement(Text, {
        text: text,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['Initial']);
    expect(container.textContent).toEqual('Initial');

    // Update to the same value
    await act(() => {
      store.set('Initial');
    });
    // Should not re-render
    assertLog([]);
    expect(container.textContent).toEqual('Initial');
  });
  it('switch to a different store', async () => {
    const storeA = createExternalStore(0);
    const storeB = createExternalStore(0);
    let setStore: React.Dispatch<React.SetStateAction<{
      set(text: unknown): void;
      subscribe(listener: () => void): () => boolean;
      getState(): unknown;
      getSubscriberCount(): number;
    }>>;
    function App() {
      const [store, _setStore] = useState<CreateExternalStore>(storeA);
      setStore = _setStore;
      const value = useOwnSyncExternalStore(store.subscribe, store.getState);
      return React.createElement(Text, {
        text: value,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog([0]);
    expect(container.textContent).toEqual('0');
    await act(() => {
      storeA.set(1);
    });
    assertLog([1]);
    expect(container.textContent).toEqual('1');

    // Switch stores and update in the same batch
    await act(() => {
      ReactDOM.flushSync(() => {
        // This update will be disregarded
        storeA.set(2);
        setStore(storeB);
      });
    });
    // Now reading from B instead of A
    assertLog([0]);
    expect(container.textContent).toEqual('0');

    // Update A
    await act(() => {
      storeA.set(3);
    });
    // Nothing happened, because we're no longer subscribed to A
    assertLog([]);
    expect(container.textContent).toEqual('0');

    // Update B
    await act(() => {
      storeB.set(1);
    });
    assertLog([1]);
    expect(container.textContent).toEqual('1');
  });
  it('selecting a specific value inside getSnapshot', async () => {
    const store = createExternalStore({
      a: 0,
      b: 0,
    });
    function A() {
      const a = useOwnSyncExternalStore(store.subscribe, () => store.getState().a);
      return React.createElement(Text, {
        text: 'A' + a,
      });
    }
    function B() {
      const b = useOwnSyncExternalStore(store.subscribe, () => store.getState().b);
      return React.createElement(Text, {
        text: 'B' + b,
      });
    }
    function App() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(A, null),
        React.createElement(B, null),
      );
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['A0', 'B0']);
    expect(container.textContent).toEqual('A0B0');

    // Update b but not a
    await act(() => {
      store.set({
        a: 0,
        b: 1,
      });
    });
    // Only b re-renders
    assertLog(['B1']);
    expect(container.textContent).toEqual('A0B1');

    // Update a but not b
    await act(() => {
      store.set({
        a: 1,
        b: 1,
      });
    });
    // Only a re-renders
    assertLog(['A1']);
    expect(container.textContent).toEqual('A1B1');
  });

  it('mutating the store in between render and commit when getSnapshot has changed', async () => {
    const store = createExternalStore({
      a: 1,
      b: 1,
    });
    const getSnapshotA = () => store.getState().a;
    const getSnapshotB = () => store.getState().b;
    function Child1({step}) {
      const value = useOwnSyncExternalStore(store.subscribe, store.getState);
      useLayoutEffect(() => {
        if (step === 1) {
          // Update B in a layout effect. This happens in the same commit
          // that changed the getSnapshot in Child2. Child2's effects haven't
          // fired yet, so it doesn't have access to the latest getSnapshot. So
          // it can't use the getSnapshot to bail out.
          log('Update B in commit phase');
          store.set({
            a: value.a,
            b: 2,
          });
        }
      }, [step]);
      return null;
    }
    function Child2({step}) {
      const label = step === 0 ? 'A' : 'B';
      const getSnapshot = step === 0 ? getSnapshotA : getSnapshotB;
      const value = useOwnSyncExternalStore(store.subscribe, getSnapshot);
      return React.createElement(Text, {
        text: label + value,
      });
    }
    let setStep;
    function App() {
      const [step, _setStep] = useState(0);
      setStep = _setStep;
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Child1, {
          step: step,
        }),
        React.createElement(Child2, {
          step: step,
        }),
      );
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['A1']);
    expect(container.textContent).toEqual('A1');
    await act(() => {
      // Change getSnapshot and update the store in the same batch
      setStep(1);
    });
    assertLog([
      'B1',
      'Update B in commit phase',
      // If Child2 had used the old getSnapshot to bail out, then it would have
      // incorrectly bailed out here instead of re-rendering.
      'B2',
    ]);
    expect(container.textContent).toEqual('B2');
  });
  it('mutating the store in between render and commit when getSnapshot has _not_ changed', async () => {
    // Same as previous test, but `getSnapshot` does not change
    const store = createExternalStore({
      a: 1,
      b: 1,
    });
    const getSnapshotA = () => store.getState().a;
    function Child1({step}) {
      const value = useOwnSyncExternalStore(store.subscribe, store.getState);
      useLayoutEffect(() => {
        if (step === 1) {
          // Update B in a layout effect. This happens in the same commit
          // that changed the getSnapshot in Child2. Child2's effects haven't
          // fired yet, so it doesn't have access to the latest getSnapshot. So
          // it can't use the getSnapshot to bail out.
          log('Update B in commit phase');
          store.set({
            a: value.a,
            b: 2,
          });
        }
      }, [step]);
      return null;
    }
    function Child2() {
      const value = useOwnSyncExternalStore(store.subscribe, getSnapshotA);
      return React.createElement(Text, {
        text: 'A' + value,
      });
    }
    let setStep;
    function App() {
      const [step, _setStep] = useState(0);
      setStep = _setStep;
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(Child1, {
          step: step,
        }),
        React.createElement(Child2, {
          step: step,
        }),
      );
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['A1']);
    expect(container.textContent).toEqual('A1');

    // This will cause a layout effect, and in the layout effect we'll update
    // the store
    await act(() => {
      setStep(1);
    });
    assertLog([
      'A1',
      // This updates B, but since Child2 doesn't subscribe to B, it doesn't
      // need to re-render.
      'Update B in commit phase',
      // No re-render
    ]);
    expect(container.textContent).toEqual('A1');
  });
  it("does not bail out if the previous update hasn't finished yet", async () => {
    const store = createExternalStore(0);
    function Child1() {
      const value = useOwnSyncExternalStore(store.subscribe, store.getState);
      useLayoutEffect(() => {
        if (value === 1) {
          log('Reset back to 0');
          store.set(0);
        }
      }, [value]);
      return React.createElement(Text, {
        text: value,
      });
    }
    function Child2() {
      const value = useOwnSyncExternalStore(store.subscribe, store.getState);
      return React.createElement(Text, {
        text: value,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() =>
      root.render(
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Child1, null),
          React.createElement(Child2, null),
        ),
      ),
    );
    assertLog([0, 0]);
    expect(container.textContent).toEqual('00');
    await act(() => {
      store.set(1);
    });
    assertLog([1, 1, 'Reset back to 0', 0, 0]);
    expect(container.textContent).toEqual('00');
  });
  it('uses the latest getSnapshot, even if it changed in the same batch as a store update', async () => {
    const store = createExternalStore({
      a: 0,
      b: 0,
    });
    const getSnapshotA = () => store.getState().a;
    const getSnapshotB = () => store.getState().b;
    let setGetSnapshot;
    function App() {
      const [getSnapshot, _setGetSnapshot] = useState(() => getSnapshotA);
      setGetSnapshot = _setGetSnapshot;
      const text = useOwnSyncExternalStore(store.subscribe, getSnapshot);
      return React.createElement(Text, {
        text: text,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog([0]);

    // Update the store and getSnapshot at the same time
    await act(() => {
      ReactDOM.flushSync(() => {
        setGetSnapshot(() => getSnapshotB);
        store.set({
          a: 1,
          b: 2,
        });
      });
    });
    // It should read from B instead of A
    assertLog([2]);
    expect(container.textContent).toEqual('2');
  });
  it.skip('handles errors thrown by getSnapshot', async () => {
    class ErrorBoundary extends React.Component {
      state = {
        error: null,
      };
      static getDerivedStateFromError(error) {
        return {
          error,
        };
      }
      render() {
        if (this.state.error) {
          return React.createElement(Text, {
            text: this.state.error.message,
          });
        }
        return this.props.children;
      }
    }
    const store = createExternalStore({
      value: 0,
      throwInGetSnapshot: false,
      throwInIsEqual: false,
    });
    function App() {
      const {value} = useOwnSyncExternalStore(store.subscribe, () => {
        const state = store.getState();
        if (state.throwInGetSnapshot) {
          throw new Error('Error in getSnapshot');
        }
        return state;
      });
      return React.createElement(Text, {
        text: value,
      });
    }
    const errorBoundary = React.createRef(null);
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() =>
      root.render(
        React.createElement(
          ErrorBoundary,
          {
            ref: errorBoundary,
          },
          React.createElement(App, null),
        ),
      ),
    );
    assertLog([0]);
    expect(container.textContent).toEqual('0');

    assert.throws(async () => 
      await act(() => {
        store.set({
          value: 1,
          throwInGetSnapshot: true,
          throwInIsEqual: false,
        });
      })
    , 'Error in getSnapshot')

    assertLog(
      [
        'Error in getSnapshot',
        // In a concurrent root, React renders a second time to attempt to
        // recover from the error.
        'Error in getSnapshot',
      ],
    );
    expect(container.textContent).toEqual('Error in getSnapshot');
  });
  
  it('getSnapshot can return NaN without infinite loop warning', async () => {
    const store = createExternalStore('not a number');
    function App() {
      const value = useOwnSyncExternalStore(store.subscribe, () =>
        parseInt(store.getState(), 10),
      );
      return React.createElement(Text, {
        text: value,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);

    // Initial render that reads a snapshot of NaN. This is OK because we use
    // Object.is algorithm to compare values.
    await act(() => root.render(React.createElement(App, null)));
    expect(container.textContent).toEqual('NaN');
    assertLog([NaN]);

    // Update to real number
    await act(() => store.set(123));
    expect(container.textContent).toEqual('123');
    assertLog([123]);

    // Update back to NaN
    await act(() => store.set('not a number'));
    expect(container.textContent).toEqual('NaN');
    assertLog([NaN]);
  });

  it('regression test for #23150', async () => {
    const store = createExternalStore('Initial');
    function App() {
      const text = useOwnSyncExternalStore(store.subscribe, store.getState);
      const [derivedText, setDerivedText] = useState(text);
      useEffect(() => {}, []);
      if (derivedText !== text.toUpperCase()) {
        setDerivedText(text.toUpperCase());
      }
      return React.createElement(Text, {
        text: derivedText,
      });
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(() => root.render(React.createElement(App, null)));
    assertLog(['INITIAL']);
    expect(container.textContent).toEqual('INITIAL');
    await act(() => {
      store.set('Updated');
    });
    assertLog(['UPDATED']);
    expect(container.textContent).toEqual('UPDATED');
  });
});
