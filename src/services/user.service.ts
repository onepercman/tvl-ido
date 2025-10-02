import { CommissionHistory } from "@/features/dashboard/use-commission-history"
import { DirectDownline } from "@/features/dashboard/use-direct-downlines"
import { ReferralPerformance } from "@/features/dashboard/use-referral-performance"
import { TopReferrers } from "@/features/home/event.interface"
import { OrderHistory } from "@/features/order-history/order-history.interface"
import { User } from "@/features/user/user.interface"
import { WithdrawalHistory } from "@/features/withdrawal-history/use-withdrawal-history"
import axiosInstance from "@/libs/axios-instance"
export class UserService {
  getNonce(wallet: string) {
    return axiosInstance.request<Res>({
      method: "POST",
      url: "/user/get-nonce",
      data: { wallet },
    })
  }

  verify(data: { wallet: string; signature: string; refer?: string }) {
    return axiosInstance.request<Res<{ access_token: string; user: User }>>({
      method: "POST",
      url: "/user/verify",
      data,
    })
  }

  info() {
    return axiosInstance.request<Res<User>>({
      method: "GET",
      url: "/user/info",
      headers: { Authorization: true },
    })
  }

  whitelist() {
    return axiosInstance.request<Res<boolean>>({
      method: "GET",
      url: "/user/whitelist",
      headers: { Authorization: true },
    })
  }

  checkReferral(referral: string) {
    return axiosInstance.request<Res<{ valid: boolean }>>({
      method: "POST",
      url: "/user/check-referral",
      params: { referral },
      headers: { Authorization: true },
    })
  }

  commissionHistory(params?: PaginateArgs) {
    return axiosInstance.request<Res<CommissionHistory[], true>>({
      method: "GET",
      url: "/user/commission-history",
      params,
      headers: { Authorization: true },
    })
  }

  directDownline(params?: PaginateArgs) {
    return axiosInstance.request<Res<DirectDownline[], true>>({
      method: "GET",
      url: "/user/direct-downline",
      params,
      headers: { Authorization: true },
    })
  }

  orderHistory(params?: PaginateArgs) {
    return axiosInstance.request<Res<OrderHistory[], true>>({
      method: "GET",
      url: "/user/order-history",
      params,
      headers: { Authorization: true },
    })
  }

  referralPerformance() {
    return axiosInstance.request<Res<ReferralPerformance>>({
      method: "GET",
      url: "/user/referral-performance",
      headers: { Authorization: true },
    })
  }

  topReferrers() {
    return axiosInstance.request<Res<TopReferrers[]>>({
      method: "GET",
      url: "/user/top-referrers",
    })
  }

  withdraw(data: { amount: number; chain_id: string }) {
    return axiosInstance.request<Res>({
      method: "POST",
      url: "/user/withdraw",
      data,
      headers: { Authorization: true },
      timeout: 60000, // withdraw takes time
    })
  }

  withdrawalHistory(params?: PaginateArgs) {
    return axiosInstance.request<Res<WithdrawalHistory[], true>>({
      method: "GET",
      url: "/user/withdrawal-history",
      params,
      headers: { Authorization: true },
    })
  }
}

export const userService = new UserService()
