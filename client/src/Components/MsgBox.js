import React from "react"
import styled from "styled-components"

const Container = styled.section`
  background-image: linear-gradient(to right top, #202730, #172328, #141f1e, #131a16, #12140e);
  max-width: 200px;
  border-radius: 10px;
  box-shadow: 0 0 5px white;
  margin-bottom: 5px;
`

const Username = styled.span`
  color: white;
  font-weight: 600;
  position: relative;
  left: 5px;
  top: 2px;
`

const Message = styled.p`
  font-size: 16px;
  margin: 10px;
  color: white;
  position: relative;
  left: 5px;
`

const MsgBox = ({ msg, username, avatar }) => (
  <Container>
    <Username>{username}</Username>
    <Message>{msg}</Message>
  </Container>
)

export default MsgBox
