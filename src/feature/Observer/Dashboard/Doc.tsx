import { useEffect, useState } from "react"
import { PromptListener, PromptObserverSingleton, PromptType } from "../observer/promptObserver"

export const DocPrompt = () => {
  const [content, setContent] = useState("")
  console.log('DocPrompt')
  const promptObserver = PromptObserverSingleton.getInstance()
  const docListener = new PromptListener((message) => {
    setContent(message)
  })

  useEffect(() => {
    promptObserver.subscribe(docListener, PromptType.doc)

    return () => promptObserver.unsubscribe(docListener, PromptType.doc)
  }, [])

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="grid gap-6 rounded-lg border p-4 h-full">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Doc
        </legend>

        {content}
      </fieldset>
    </form>
  )
}