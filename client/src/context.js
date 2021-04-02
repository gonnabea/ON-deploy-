import React from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = async ({ children }) => (
  <UserContext.Provider value={await api.getLoggedUser()}>{children}</UserContext.Provider>
)

export default UserContextProvider
