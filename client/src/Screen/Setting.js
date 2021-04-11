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
  background-image: url("https://res.cloudinary.com/twenty20/private_images/t_watermark-criss-cross-10/v1609958132000/photosp/18c97ef2-c67d-49b5-88cd-d615f8c45427/stock-photo-star-blue-background-starry-sky-stars-glitter-starry-glitters-starry-background-starry-night-sky-18c97ef2-c67d-49b5-88cd-d615f8c45427.jpg");
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

const StatusMsgForm = styled.form`
  margin-left: 10px;
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

// 반응형을 위한 이벤트리스너
window.addEventListener("resize", () => {
  if (window.innerWidth > 600) {
    if (window.matchMedia("(max-width: 700px)").matches) {
      window.location.reload()
    }
    if (window.matchMedia("(max-width: 950px)").matches) {
      window.location.reload()
    }
    if (window.matchMedia("(max-width: 1150px)").matches) {
      window.location.reload()
    }
  }
})

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

            <StatusMsgForm action="setStatusMsg" method="post" onSubmit={(e) => setStatusMsg(e)}>
              <StatusMsgInput
                ref={statusMsg}
                type="text"
                placeholder="상태메세지 입력"
                name="text"
              />
              <StatusMsgInput type="submit" value="적용" />
            </StatusMsgForm>
          </Back>
        }
        spine={<Spine></Spine>}
      />
    </Container>
  )
}

export default Chatroom
