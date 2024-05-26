import { useSyncExternalStore } from "react"
import { store } from "./store"
import { useOwnSyncExternalStore } from "./useOwnSyncExternalStore"

export const UseSyncExternalStoreComponent = () => {
  return (
    <>
      <Title />
      <span>
        <Input />
      </span>
      <PreviewHex />
      <PreviewBase64 />
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

export const PreviewHex = () => {
  const preview = useSyncExternalStore(store.subscribe, store.getSnapshot)
  console.log("preview hex", preview)
  return <section>
    <strong>Hex:</strong>
    {stringToHex(preview)}
  </section>
}


export const PreviewBase64 = () => {
  const preview = useOwnSyncExternalStore(store.subscribe, store.getSnapshot)
  console.log("preview b64", preview)
  return <section>
    <strong>Base64:</strong>
    {btoa(preview)}
  </section>
}

function stringToHex(str: string) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}