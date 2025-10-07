import { toaster } from "@/libs/toaster"
import { Toaster } from "@/shared/components"
import { FC, Fragment } from "react"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer"
import { Header } from "./header"

export const Layout: FC = () => {
  return (
    <Fragment>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="relative grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster toaster={toaster} />
    </Fragment>
  )
}
