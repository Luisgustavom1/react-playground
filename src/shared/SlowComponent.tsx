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