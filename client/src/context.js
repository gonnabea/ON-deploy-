import React from "react"
import api from "./api"

export const UserContext = React.createContext()

let loggedUser
const getLoggedUser = async () => {
  loggedUser = await api.getLoggedUser()
  loggedUser = loggedUser.data
}
getLoggedUser()
const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={loggedUser}>{children}</UserContext.Provider>
)

export default UserContextProvider
