import React, { useEffect, useState } from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState()
  const getLoggedUser = async () => {
    const { data } = await api.getLoggedUser()
    setLoggedUser(data)
  }

  useEffect(() => {
    getLoggedUser()
  })

  return <UserContext.Provider value={loggedUser}>{children}</UserContext.Provider>
}

export default UserContextProvider
