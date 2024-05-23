import { useState } from "react"
import { UseMemoComponent } from "./useMemo"
import { ReRender } from "./re-renders";
import { CreateComponentDuringRender } from "./CreateComponentDuringRender";

const PerformanceTestObj = {
  USE_MEMO: "useMemo",
  RE_RENDERS: "re_renders",
  CREATE_COMPONENT_DURING_RENDER: "create_component_during_render",
} as const;

type PerformanceTest = (typeof PerformanceTestObj)[keyof typeof PerformanceTestObj]

export function Performance() {
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
      }[performanceTest]}
    </>
  )
}

