import React, { useEffect, useState } from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const getLoggedUser = async () => {
    const { data } = await api.getLoggedUser()
    setLoggedUser(data)
  }

  useEffect(() => {
    getLoggedUser()
    setLoading(false)
  }, [])

  return isLoading ? (
    <UserContext.Provider value={null}>{children}</UserContext.Provider>
  ) : (
    <UserContext.Provider value={loggedUser}>{children}</UserContext.Provider>
  )
}

export default UserContextProvider
