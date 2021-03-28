import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyles = createGlobalStyle`
 ${reset};
a{
    text-decoration: none;
}
*{
    box-sizing: border-box;
}
body{
background-color: #363A43;
font-size: 20px;
overflow: hidden;
@media (max-width: 500px){
    font-size: 15px;
}
}
`

export default GlobalStyles
