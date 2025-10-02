export enum UserKind {
  Normal,
  Leader,
}

export interface User {
  wallet: string
  referral: string
  ref_code: string
  kind: UserKind
  bonus: number
  status: number
}
