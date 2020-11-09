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
background-color: #D7D8F1;

font-size: 20px;
overflow-x: auto;
overflow-y: hidden;
}
`

export default GlobalStyles
