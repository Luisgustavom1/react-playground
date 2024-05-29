import { useState } from "react"
import { UseMemoComponent } from "./useMemo"
import { ReRender } from "./re-renders";
import { CreateComponentDuringRender } from "./CreateComponentDuringRender";
import { Button } from "@/components/ui/button";

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
      <header className="flex gap-2 mb-4">
        {Object.values(PerformanceTestObj).map((v) => (
          <Button key={v} variant={
            performanceTest === v ? 'secondary' : 'outline'
          } onClick={() => setPerformanceTest(v)}>
            {v}
          </Button>
        ))}
      </header>

      {{
        useMemo: <UseMemoComponent />,
        re_renders: <ReRender />,
        create_component_during_render: <CreateComponentDuringRender />,
      }[performanceTest]}
    </>
  )
}

