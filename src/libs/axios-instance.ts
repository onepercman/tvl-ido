import { ENV } from "@/config/env.config"
import UserStore from "@/features/user/user.store"
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {},
})

const requestHandler = {
  onFulfilled(config: InternalAxiosRequestConfig) {
    const { jwt } = UserStore
    if (jwt && config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${jwt}`
    }
    return config
  },
}

const responseHandler = {
  onFulfilled(response: AxiosResponse) {
    response.statusText = ""
    // Error handler
    if (response.status !== 200) {
      return Promise.reject(response.data.desc)
    }
    // Transform paginated data
    if (response.data.pagination) {
      response.data.data = {
        data: response.data.data,
        pagination: response.data.pagination,
      }
    }
    return Promise.resolve(response)
  },
  onRejected(error: AxiosError) {
    // Common error
    if (!error.config || !error.response) {
      return Promise.reject(error)
    }

    // Authorize error - handle 401 if needed
    if (error.response.status === 401) {
      UserStore.logout()

      return Promise.reject(error)
    }

    if (error.response.data) {
      return Promise.reject((error.response.data as any).desc)
    }

    return Promise.reject(error)
  },
}

// Apply interceptors
axiosInstance.interceptors.request.use(requestHandler.onFulfilled)
axiosInstance.interceptors.response.use(
  responseHandler.onFulfilled,
  responseHandler.onRejected,
)

export default axiosInstance
