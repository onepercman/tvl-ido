export interface Event {
  event_id: number
  event_name: string
  has_started: boolean
  start_time: number
  end_time: number
  rounds?: Round[]
}

export interface Round {
  round_number: number
  round_name: string
  total_money: number
  money_sold: number
  is_current_round: number
  tiers: Tier[]
  start_time: number
  end_time: number
}

export interface Tier {
  tier_number: number
  tier_name: string
  total_money: number
  money_sold: number
  token_price: number
  is_current_tier: number
}

export interface CurrentRoundInfo {
  current_round_number: number
  current_round_name: string
  current_tier_number: number
  current_tier_name: string
  money_sold: number
  is_sold_out: false
  info_quality: {
    total_money: number
    money_sold: number
    percent: number
  }
}
export interface RecentTransaction {
  user_wallet: string
  chain_id: string
  tx_id: string
  quantity: number
  package_amount: number
  token_price: number
  total_money: number
  order_id: string
  created_at: string
}

export interface TopReferrers {
  wallet: string
  downline_count: number
}

export interface Order {
  order_id: string
  tx_id: string
  quantity: number
  price: number
  round_number: number
  round_name: string
  tier_number: number
  tier_name: string
}
