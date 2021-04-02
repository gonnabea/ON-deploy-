import React from "react"
import api from "./api"

export const UserContext = React.createContext()

const loggedUser = api.getLoggedUser()

const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={loggedUser}>{children}</UserContext.Provider>
)

export default UserContextProvider
