import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import api from "../api"
import Loader from "../Components/Loader"
import UserContextProvider, { UserContext } from "../userContext"

const Container = styled.section`
  width: 100%;
  padding-bottom: 10px;
`

const Form = styled.form``

const Input = styled.input`
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  color: white;
  border-radius: 10px;
  padding: 5px;
  font-weight: 700;
  @media (max-width: 700px) {
    width: 100%;
  }
`

const Submit = styled.input`
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  color: white;
  border-radius: 10px;
  padding: 5px;
  font-weight: 700;
`

const Header = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    text-align: center;
  }
  display: flex;
  align-items: center;
`

const SLink = styled(Link)`
  color: white;
  margin-right: 10px;
`

const MenuTitle = styled.h2`
  padding-bottom: 20px 0;
  font-weight: 700;
`

const Navigation = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const loggedUser = useContext(UserContext)
  console.log(loggedUser)
  const getLoggedUser = () => {
    setUser(loggedUser)
  }

  useEffect(() => {
    getLoggedUser()
    setLoading(false)
  }, [])

  return user ? (
    <Container>
      <Header>
        <SLink to="/">홈으로</SLink>
        <SLink to="/chatroom/lobby">채팅</SLink>
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
      <MenuTitle>로그인</MenuTitle>
      <Form action="https://our-now.herokuapp.com/login" method="post">
        <Input type="text" name="username" placeholder="username" required={true} />
        <Input type="password" name="password" placeholder="password" required={true} />
        <Submit type="submit" value="Login" />
      </Form>
      <MenuTitle>회원가입</MenuTitle>
      <Form action="https://our-now.herokuapp.com/join" method="post">
        <Input type="email" name="email" placeholder="E-mail" required={true} />
        <Input type="text" name="username" placeholder="Username" required={true} />
        <Input type="password" name="password" placeholder="Password" required={true} />
        <Input type="password" name="password2" placeholder="Verify Password" required={true} />
        <Submit type="submit" value="Join" />
      </Form>
    </Container>
  )
}

export default Navigation
