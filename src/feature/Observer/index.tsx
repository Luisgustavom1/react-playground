import { Four } from "./features/Four";
import { One } from "./features/One";
import { Three } from "./features/Three";
import { Two } from "./features/Two";

export function Observer() {
  return (
    <div>
      <One />
      <Two />
      <Three />
      <Four />
    </div>
    )
}