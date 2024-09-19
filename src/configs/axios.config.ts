import axios from 'axios'

// Axios Settings
let axiosConfig = axios.create({})

// Refresh token
axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error

    const originalRequest = config

    // Unauthorized (401)
    if (error.response && error.response.status === 401) {
      // setLogout(true)
    } else if (error) {
    }

    return Promise.reject(error)
  }
)

export const axiosInstance = axiosConfig
