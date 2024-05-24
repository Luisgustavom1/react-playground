import { useState } from "react"
import { Performance } from './feature/Performance'
import { UseTransitionComponent } from './feature/ReactHooks/useTransition'
import { SuspenseComponent } from "./feature/Suspense";

const FeaturesObj = {
  performance: "performance",
  hooks: "hooks",
  suspense: "suspense",
} as const;

type Features = (typeof FeaturesObj)[keyof typeof FeaturesObj]

function App() {
  const [feature, setFeature] = useState<Features>();

  return (
    <>
      {Object.values(FeaturesObj).map((v) => (
        <button key={v} onClick={() => setFeature(v)} style={{
          fontWeight: feature === v ? "bold" : "normal"
        }}>
          {v}
        </button>
      ))}
      <br />
      <br />
      {feature && {
        [FeaturesObj.performance]: <Performance />,
        [FeaturesObj.hooks]: <UseTransitionComponent />,
        [FeaturesObj.suspense]: <SuspenseComponent />
      }[feature]}
    </>
  )
}

export default App
