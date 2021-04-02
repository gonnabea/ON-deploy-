import React from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={{ username: "Jiwon" }}>{children}</UserContext.Provider>
)

export default UserContextProvider
