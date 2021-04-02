import React from "react"
import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = async ({ children }) => (
  <UserContext.Provider value={{ name: "Jiwon" }}>{children}</UserContext.Provider>
)

export default UserContextProvider
