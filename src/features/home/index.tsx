import { Hero } from "./hero"
import { Sale } from "./sale"

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <Hero />
      <Sale />
    </div>
  )
}
