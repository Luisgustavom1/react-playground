import { useState } from "react"
import { Performance } from './feature/Performance'
import { UseTransitionComponent } from './feature/useTransition'

const FeaturesObj = {
  PERFORMANCE: "performance",
  hooks: "hooks",
} as const;

type Features = (typeof FeaturesObj)[keyof typeof FeaturesObj]

function App() {
  const [feature, setFeature] = useState<Features>();

  return (
    <>
      {Object.values(FeaturesObj).map((v) => (
        <button key={v} onClick={() => setFeature(v)}>
          {v}
        </button>
      ))}
      <br />
      <br />
      {feature && {
        [FeaturesObj.PERFORMANCE]: <Performance />,
        [FeaturesObj.hooks]: <UseTransitionComponent />,
      }[feature]}
    </>
  )
}

export default App
