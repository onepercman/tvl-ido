import { Badge } from "@/shared/components"
import { ArrowSwapVertical } from "iconsax-reactjs"
import { LuCheck, LuReceipt, LuX } from "react-icons/lu"

export interface OrderHistory {
  order_id: string
  round_number: number
  round_name: string
  tier_number: number
  tier_name: string
  quantity: number
  price: number
  total_amount: number
  transaction_id: string
  chain_id: string
  created_at: string
  status: number
  status_string: string
}

export enum TransactionStatus {
  Pending,
  Success,
  Fail,
  Refund,
}

export function getTransactionStatusBadge(status: TransactionStatus) {
  switch (status) {
    case TransactionStatus.Pending:
      return (
        <Badge size="lg" className="rounded-xl">
          <ArrowSwapVertical size={16} /> Pending
        </Badge>
      )
    case TransactionStatus.Success:
      return (
        <Badge size="lg" className="rounded-xl">
          <LuCheck size={16} /> Success
        </Badge>
      )
    case TransactionStatus.Fail:
      return (
        <Badge size="lg" className="rounded-xl">
          <LuX size={16} /> Failed
        </Badge>
      )
    case TransactionStatus.Refund:
      return (
        <Badge size="lg" className="rounded-xl">
          <LuReceipt size={16} /> Refund
        </Badge>
      )
    default:
      return null
  }
}
