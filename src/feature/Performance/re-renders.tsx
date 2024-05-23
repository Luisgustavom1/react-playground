import React, { ComponentPropsWithoutRef, useCallback } from "react";
import useCounter from "../../utils/useCounter";

const MyChildren = () => {
  console.log("my children 1 re render")
  return (
    <div>My children</div>
  )
}

const ComponentMemoized = React.memo(() => {
  console.log("component memoized re render")
  return (
    <div>My component memoized</div>
  )
})

const ComponentMemoizedWithProps = React.memo(({
  onClick
}: ComponentPropsWithoutRef<'div'>) => {
  console.log("component memoized with props re render")
  return (
    <div onClick={onClick}>My component memoized</div>
  )
})

export const ReRender = () => {
  const { increment, count } = useCounter()

  const onClick = useCallback(() => {
    console.log("clicked")
  }, [])

  return (
    <div className="App">
      <section>
        <p>In this scenario props that is passed to memoized component should be wrapped by useCallback or useMemo, because if not, every time the parent re-render, the props will change and trigger re-render of the memoized component</p>
        <p>i.e. memoized component will re-render each time re-rendering of the parent, even if you don't want ir</p>
        <p>In memoized component each props should be memoized too</p>
      </section>
      <button onClick={increment}> click to re-render {count}</button>
      <br />
      <MyChildren/>
      <ComponentMemoized />
      <ComponentMemoizedWithProps onClick={onClick} />
    </div>
  );
};