import { useState } from "react"
import { UseMemoComponent } from "./feature/useMemo"
import { ReRender } from "./feature/re-renders";
import { CreateComponentDuringRender } from "./feature/CreateComponentDuringRender";
import UseTransitionComponent from "./feature/useTransition";

const PerformanceTestObj = {
  USE_MEMO: "useMemo",
  RE_RENDERS: "re_renders",
  CREATE_COMPONENT_DURING_RENDER: "create_component_during_render",
  USE_TRANSITION: "use_transition",
} as const;

type PerformanceTest = (typeof PerformanceTestObj)[keyof typeof PerformanceTestObj]

function App() {
  const [performanceTest, setPerformanceTest] = useState<PerformanceTest>(PerformanceTestObj.USE_MEMO);

  return (
    <>
      {Object.values(PerformanceTestObj).map((v) => (
        <button key={v} onClick={() => setPerformanceTest(v)}>
          {v}
        </button>
      ))}
      <br />
      <br />
      {{
        useMemo: <UseMemoComponent />,
        re_renders: <ReRender />,
        create_component_during_render: <CreateComponentDuringRender />,
        use_transition: <UseTransitionComponent />
      }[performanceTest]}
    </>
  )
}

export default App
