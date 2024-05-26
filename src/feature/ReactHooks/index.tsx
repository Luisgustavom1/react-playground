import { useState } from "react";
import { UseTransitionComponent } from "./useTransition";
import { UseSyncExternalStoreComponent } from "./useSyncExternalStore";

const HooksObj = {
  useTransition: "useTransition",
  useSyncExternalStore: "useSyncExternalStore",
} as const;

type Hooks = (typeof HooksObj)[keyof typeof HooksObj]

export const ReactHooks = () => {
  const [hook, setHook] = useState<Hooks>();

  return (
    <>
      {Object.values(HooksObj).map((v) => (
        <button key={v} onClick={() => setHook(v)}>
          {v}
        </button>
      ))}
      <br />
      <br />
      {hook && {
        [HooksObj.useTransition]: <UseTransitionComponent />,
        [HooksObj.useSyncExternalStore]: <UseSyncExternalStoreComponent />
      }[hook]}
    </>
  )
}