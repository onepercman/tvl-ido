import {
  CurrentRoundInfo,
  Event,
  Order,
  RecentTransaction,
} from "@/features/home/event.interface"
import axiosInstance from "@/libs/axios-instance"

export class EventService {
  event() {
    return axiosInstance.request<Res<Event>>({
      method: "GET",
      url: "/event/get",
    })
  }

  current(event_id: number) {
    return axiosInstance.request<Res<CurrentRoundInfo>>({
      method: "GET",
      url: "/event/current",
      params: { event_id },
    })
  }

  order(data: {
    chain_id: string
    event_id: number
    amount: number
    round_number: number
    tier_number: number
    ref_code?: string
  }) {
    return axiosInstance.request<Res<Order>>({
      method: "POST",
      url: "/event/order",
      data,
      headers: { Authorization: true },
    })
  }

  transaction(data: { order_id: string; tx_id: string }) {
    return axiosInstance.request<Res>({
      method: "POST",
      url: "/event/transaction",
      data,
      headers: { Authorization: true },
    })
  }

  recentTransactions() {
    return axiosInstance.request<Res<RecentTransaction[]>>({
      method: "GET",
      url: "/event/recent-transactions",
    })
  }
}

export const eventService = new EventService()
