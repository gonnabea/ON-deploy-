import api from "./api"

export const UserContext = React.createContext()

const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={api.getLoggedUser()}>{children}</UserContext.Provider>
)

export default UserContextProvider
