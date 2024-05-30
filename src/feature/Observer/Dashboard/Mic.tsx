import { useEffect, useState } from "react"
import { PromptListener, PromptObserverSingleton, PromptType } from "../observer/promptObserver"

export const MicPrompt = () => {
  const [content, setContent] = useState("")
  console.log('MicPrompt')
  const promptObserver = PromptObserverSingleton.getInstance()
  const micListener = new PromptListener((message) => {
    setContent(message)
  })

  useEffect(() => {
    promptObserver.subscribe(micListener, PromptType.audio)

    return () => promptObserver.unsubscribe(micListener, PromptType.audio)
  }, [])

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Mic
        </legend>

        {content}
      </fieldset>
    </form>
  )
}