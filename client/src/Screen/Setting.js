import React, { useEffect, useState, useRef, useContext } from "react"
import styled from "styled-components"
import Navigation from "../Hooks/useNavigation"
import Book from "../Components/3DBook"
import { Link } from "react-router-dom"
import api from "../api"
import {
  closedBookHeight,
  closedBookWidth,
  treatBookHeight,
  treatBookSpine,
  treatBookWidth,
} from "./ChatroomStyle"
import { UserContext } from "../userContext"

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const BookFront = styled.div`
  width: 100%;
  height: 100%;
  background-color: #314458;
  background-image: url("https://media.images.yourquote.in/post/large/0/0/2/119/xL077112.jpg");
  background-size: 100% 100%;
  box-shadow: 0 0 10px white;
  display: flex;
  flex-direction: column;
`

const Back = styled.section`
  width: 100%;
  height: 100%;
  background-image: url("https://png.pngtree.com/thumb_back/fw800/background/20190313/pngtree-sparkling-stars-night-star-background-image_88891.jpg");
  background-size: 100% 100%;
  transform: scaleX(-1);
`

const Spine = styled.section`
  width: 100%;
  height: 100%;
  color: white;
  font-weight: 700;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
`

const StatusMsgInput = styled.input`
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  box-shadow: 0 0 10px white;
  color: white;
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 5px;
`

const Chatroom = (props) => {
  const userContext = useContext(UserContext)
  const [loggedUser, setLoggedUser] = useState()

  const statusMsg = useRef()

  const setStatusMsg = (e) => {
    e.preventDefault()
    api.setStatusMsg(statusMsg.current.value) // 상태메세지 설정
    statusMsg.current.value = ""
  }

  useEffect(() => {
    try {
      setLoggedUser(userContext)
    } catch (err) {
      console.log(err)
    }
    return () => {
      console.log("cleaned up")
    }
  }, [])

  return (
    <Container>
      <Book
        width={closedBookWidth()}
        height={closedBookHeight()}
        spineWidth={treatBookSpine()}
        backState={true}
        front={
          <BookFront>
            {/* <Head>
                <Navigation />
                {loading === true ? "Now Loading..." : `Welcome ${user ? user.username : ""}!`}
              </Head>
              <Intro>연결책</Intro> */}
          </BookFront>
        }
        back={
          <Back>
            <Navigation />

            <form action="setStatusMsg" method="post" onSubmit={(e) => setStatusMsg(e)}>
              <StatusMsgInput
                ref={statusMsg}
                type="text"
                placeholder="상태메세지 입력"
                name="text"
              />
              <StatusMsgInput type="submit" value="적용" />
            </form>
          </Back>
        }
        spine={<Spine></Spine>}
      />
    </Container>
  )
}

export default Chatroom
