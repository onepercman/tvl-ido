import { toaster } from "@/libs/toaster"
import { userService } from "@/services"
import { User, UserKind } from "./user.interface"

export class UserModel {
  user?: User
  jwt?: string

  get isAuthorized() {
    return !!this.jwt
  }

  get isLeader() {
    return this.user?.kind === UserKind.Leader
  }

  async login(wallet: string, signature: string) {
    const { data } = await userService.verify({
      wallet,
      signature,
    })
    if (data.data.access_token) {
      this.jwt = data.data.access_token
      this.user = data.data.user
      toaster.success({
        title: "Login successfully",
      })
      return true
    } else {
      this.logout()
      toaster.error({
        title: "Login failed",
        description: data.desc,
      })
      return false
    }
  }

  async update() {
    if (!this.jwt) return
    const { data } = await userService.info()
    if (data.data) {
      this.user = data.data
    }
  }

  logout() {
    this.user = undefined
    this.jwt = undefined
  }

  refreshToken() {
    return ""
  }
}
