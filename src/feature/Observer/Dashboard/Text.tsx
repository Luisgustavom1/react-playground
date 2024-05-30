import { useEffect, useState } from "react";
import { PromptListener, PromptObserverSingleton, PromptType } from "../observer/promptObserver"

export const TextPrompt = () => {
  const [content, setContent] = useState("")
  console.log('TextPrompt')
  const promptObserver = PromptObserverSingleton.getInstance();
  const promptListener = new PromptListener((message) => {
    setContent(message)
  })

  useEffect(() => {
    promptObserver.subscribe(promptListener, PromptType.text);

    return () => promptObserver.unsubscribe(promptListener, PromptType.text)
  }, [])

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Text
        </legend>

        {content}
      </fieldset>
    </form>
  )
}