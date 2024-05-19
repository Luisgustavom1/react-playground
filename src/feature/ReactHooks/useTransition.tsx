import { Dispatch, PropsWithChildren, useEffect, useState, useTransition } from 'react';

const Tabs = {
  index: 'index',
  slow: 'slow',
  fast: 'fast',
}

export const UseTransitionComponent = () => {
  const [tab, setTab] = useState(Tabs.index);

  useEffect(() => {
    console.log("tab changed", tab)
  }, [tab])

  return (
    <div>
      <header>
         {Object.entries(Tabs).map(([k, v]) => (
          <HeaderButton key={k} onClick={() => {
            console.log("click")
            setTab(v)
          }}>
            {v}
          </HeaderButton>
        ))}

        <button onClick={() => setTab(Tabs.slow)}>
          Change to slow component with useTransition
        </button>
      </header>

      {{
        [Tabs.index]: <IndexComponent />,
        [Tabs.slow]: <SlowComponent />,
        [Tabs.fast]: <FastComponent />
      }[tab]}
    </div>
  );
};

const HeaderButton = ({ children, onClick }: PropsWithChildren<{ onClick: Dispatch<void> }>) => {
  const [isPending, startTransition] = useTransition();
  console.log("1")
  return (
    <button
      style={{
        color: isPending ? 'red' : 'black'
      }}
      onClick={() => {
        console.log('2')
        startTransition(onClick)
        console.log('3')
      }}
    >
      {children}
    </button>
  );
}

const IndexComponent = () => {
  return (
    <div>
      index
    </div>
  );
}

export const FastComponent = () => {
  return (
    <div>
      fast
    </div>
  );
}

export const SlowComponent = () => {
  const li = []

  for (let i = 0; i < 10000; i++) {
    li.push(<li key={i}><SlowItem /></li>)
  }

  return (
    <ol>
     {li}
    </ol>
  );
}

const SlowItem = () => {
  const start = performance.now();

  while (performance.now() - start < 1) {
    // simulate slow operation
  }

  return (
    <span>{start}</span>
  )
}