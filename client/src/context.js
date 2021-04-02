import React, { useEffect, useState } from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState()
  const getLoggedUser = async () => {
    const { data } = await api.getLoggedUser()
    setLoggedUser(data)
    return loggedUser
  }

  return <UserContext.Provider value={getLoggedUser()}>{children}</UserContext.Provider>
}

export default UserContextProvider
