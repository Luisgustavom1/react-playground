import { useSyncExternalStore } from "react"
import { store } from "./store"

export const UseSyncExternalStoreComponent = () => {

  return (
    <>
      <Title />
      <Input />
      <Preview />
    </>
  )
}

export const Title = () => {
  console.log("re-render")
  return <h1>Translator</h1>
}

export const Input = () => {
  const input = useSyncExternalStore(store.subscribe, store.getSnapshot)
  return <input value={input} onChange={e => store.set(e.target.value)} />
}

export const Preview = () => {
  const preview = useSyncExternalStore(store.subscribe, store.getSnapshot)
  return <div>{stringToHex(preview)}</div>
}

function stringToHex(str: string) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}