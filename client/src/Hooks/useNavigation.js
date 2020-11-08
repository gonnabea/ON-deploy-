import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import api from "../api"

const Container = styled.section`
  width: 100%;
`

const Form = styled.form``

const Input = styled.input``

const Submit = styled.input``

const Header = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
`

const SLink = styled(Link)`
  color: white;
  margin-right: 10px;
`

const Navigation = () => {
  const [user, setUser] = useState(null)

  const getLoggedUser = async () => {
    const userData = await api.getLoggedUser()
    console.log(userData)
    const User = userData.data
    setUser(User)
  }

  useEffect(() => {
    getLoggedUser()
  }, [])

  return user ? (
    <Container>
      <Header>
        {console.log(user)}
        <SLink to="/">홈으로</SLink>
        <SLink to="/chatroom">채팅</SLink>
        <SLink to="/setting">설정</SLink>
        <Form action="https://our-now.herokuapp.com/logout" method="post">
          <Input type="submit" value="로그아웃" />
        </Form>
      </Header>
    </Container>
  ) : (
    <Container>
      <Header>
        <SLink to="/">홈으로</SLink>
        <SLink to="/chatroom/lobby">채팅</SLink>
      </Header>
      <Form action="https://our-now.herokuapp.com/login" method="post">
        <Input type="text" name="username" placeholder="username" required={true} />
        <Input type="password" name="password" placeholder="password" required={true} />
        <Submit type="submit" value="Login!" />
      </Form>
      <Form action="https://our-now.herokuapp.com/join" method="post">
        <Input type="email" name="email" placeholder="E-mail" required={true} />
        <Input type="text" name="username" placeholder="Username" required={true} />
        <Input type="password" name="password" placeholder="Password" required={true} />
        <Input type="password" name="password2" placeholder="Verify Password" required={true} />
        <Submit type="submit" value="Join!" />
      </Form>
    </Container>
  )
}

export default Navigation
