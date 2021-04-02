import React, { useEffect, useState } from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => {
  const getLoggedUser = async () => {
    const { data } = await api.getLoggedUser()
    return data
  }

  return <UserContext.Provider value={getLoggedUser()}>{children}</UserContext.Provider>
}

export default UserContextProvider
