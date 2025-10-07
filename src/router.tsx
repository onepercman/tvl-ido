import Home from "@/features/home"
import { Layout } from "@/features/root/layout"
import { Empty } from "@/shared/components/empty"
import { createBrowserRouter, redirect } from "react-router-dom"
import OrderHistory from "./features/order-history"
import UserStore from "./features/user/user.store"
import WithdrawalHistory from "./features/withdrawal-history"

function authLoader() {
  const { isAuthorized } = UserStore
  if (!isAuthorized) return redirect("/")
  return null
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <Empty />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/order-history",
        element: <OrderHistory />,
        loader: authLoader,
      },
      // {
      //   path: "/dashboard",
      //   element: <Dashboard />,
      //   loader: authLoader,
      // },
      {
        path: "/withdrawal-history",
        element: <WithdrawalHistory />,
        loader: authLoader,
      },
    ],
  },
])
