import { useState } from "react"
import { Performance } from '@/feature/Performance'
import { SuspenseComponent } from "@/feature/Suspense";
import { ReactHooks } from "@/feature/ReactHooks";
import { Observer } from "@/feature/Observer";
import { Button } from "./components/ui/button";

const FeaturesObj = {
  performance: "performance",
  hooks: "hooks",
  suspense: "suspense",
  observer: 'observer',
} as const;

type Features = (typeof FeaturesObj)[keyof typeof FeaturesObj]

function App() {
  const [feature, setFeature] = useState<Features>();

  return (
    <>
      <header className="flex gap-2 mb-4">
        {Object.values(FeaturesObj).map((v) => (
          <Button key={v} onClick={() => setFeature(v)} variant={
            feature === v ? 'default' : 'outline'
          }>
            {v}
          </Button>
        ))}
      </header>
      {feature && {
        [FeaturesObj.performance]: <Performance />,
        [FeaturesObj.hooks]: <ReactHooks />,
        [FeaturesObj.suspense]: <SuspenseComponent />,
        [FeaturesObj.observer]: <Observer />
      }[feature]}
    </>
  )
}

export default App
