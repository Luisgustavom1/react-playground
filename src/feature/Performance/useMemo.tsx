import { useMemo } from "react";
import useCounter from "../../utils/useCounter";

const useAnyHook = () => {
  return {
    array: Array.from(Array(1000).keys()) // will be memoized to no trigger the useMemo each re render
  }
}

export const UseMemoComponent = () => {
  const {count, increment, reset} = useCounter();
  const { array } = useAnyHook();

  const formattedArray = useMemo(() => {
    console.log("executed");
    
    return array.map((v) => v * 2).sort((a, b) => b - a)
    // Without effect, because objects are a reference to object in memory. So every re-render "array" is different
  }, [array])

  return (
    <>
      <section>
        <p>When your array of dependencies is a object, each re-render your useMemo will run again, because the object is just a reference in the memory</p>
        <p>{"{} == {} => false"}</p>
        <p>{"Object.is({}, {}) => false ... React use this way"}</p>
      </section>

      <h1>Example</h1>
      <button onClick={increment}>counter {count}</button>
      <button onClick={reset}>reset</button>
      <div>My simple component</div>
      <ol>
        {formattedArray.map((v) => <li key={v}>{v}</li>)}
      </ol>
    </>    
  )
};