import { useEffect } from "react";
import useCounter from "../../utils/useCounter";

const GoodChildrenComponent = ({ n }: { n: number }) => {
  useEffect(() => {
    console.log("Good component Mounted!");
    
    return () => {
      console.log("Good component  Unmounted!");
    }
  }, []);
  
  console.log("Good component Render");

  return <div>{n}</div>;
};

export const CreateComponentDuringRender = () => {
  const { increment, count } = useCounter()

  const arr = Array.from(Array(100).keys())

  const BadChildrenComponent = ({ n }: { n: number }) => {
    useEffect(() => {
      console.log("Bad component Mounted!");
      
      return () => {
        console.log("Bad component Unmounted!");
      }
    }, []);
    
    console.log("Bad component Render");

    return <div>{n}</div>;
  };

  const RenderGoodComponent = () => {
    if (arr.length > 0) return (
      arr.map((n) => (
        <GoodChildrenComponent key={n} n={n} />
      ))
    )
    return <></>
  } 

  return (
    <>
      <button onClick={increment}>counter {count}</button>

      {arr.map((n) => (
        <BadChildrenComponent key={n} n={n} />
      ))}

      {RenderGoodComponent()}
    </>
  );
};