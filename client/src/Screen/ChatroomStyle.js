import styled from "styled-components"
import { Link } from "react-router-dom"

export const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: moveBook 0.7s forwards;
  // 책 열었을 떄 오른쪽으로 움직이는 애니메이션 (반응형)
  @keyframes moveBook {
    to {
      transform: translateX(150px);
    }
  }
  @media (max-width: 800px) {
    @keyframes moveBook {
      to {
        transform: translateX(20vw);
      }
    }
  }
`

export const FrontContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

export const ChatBox = styled.div`
  width: 100%;
  height: 100%;
  color: #363883;
  border-radius: 5px;
  box-shadow: 0 0 10px black;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ChatScreen = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 70px 20px;
  width: 100%;
`

export const GreetingNotice = styled.p`
  position: fixed;
  font-weight: 700;
  margin-top: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 10px 5px;
  border-radius: 5px;
  z-index: 100;
`

export const ChatForm = styled.form`
  width: 100%;
  height: 10%;
  position: absolute;
  bottom: 0;
`

export const ChatText = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 10px white;
  padding-right: 30%;
  font-size: 18px;
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  outline: none;
`

export const ChatSubmit = styled.input`
  position: relative;
  left: 70%;
  bottom: 85%;
  width: 25%;
  background-color: #dd4849;
  box-shadow: 0 0 10px white;
  color: white;
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 5px;
  @media (max-width: 500px) {
    display: none;
  }
`

export const BookFront = styled.div`
  width: 100%;
  height: 100%;
  background-image: background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  overflow: auto;
  /* background-image: url("/cover.jpg"); */
  background-size: 100% 100%;

  box-shadow: 0 0 20px black;
  display: flex;
  flex-direction: column;
  transform: scaleX(-1);
`

export const FrontBgImg = styled.img`
  z-index: -999;
  width: 100%;
  height: 100%;
  position: absolute;
  animation: hideImg 0.5s forwards;
  @keyframes hideImg {
    to {
      opacity: 0;
    }
  }
`

export const Inside = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;

  box-shadow: 0 0 10px white;
  display: flex;
`

export const UserList = styled.ul`
  display: flex;
  flex-direction: column;
`

export const ChatRoomLink = styled(Link)`
  color: white;
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
  height: 70px;
  display: flex;
  align-items: center;
`

export const UserInfo = styled.span`
  display: flex;
  flex-direction: column;
`

export const Username = styled.span`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
`

export const StatusMsg = styled.span`
  font-size: 15px;
  opacity: 0.8;
`
export const ChatroomList = styled.ul`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`
export const VideoCallBtn = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  border-radius: 100%;
  color: orange;
  outline: none;
  font-size: 20px;
  padding: 10px;
  box-shadow: 0 0 5px white;
  text-align: center;
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);
`

export const VideoGrid = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  overflow: auto;
  min-height: 240px;
`

export const ButtonContainer = styled.span`
  width: 150px;
`

// 화상채팅 버튼을 보여줄 지 안보여줄 지 판단
export const showVideoCall = (chatroom) => {
  let userList

  if (chatroom) {
    userList = chatroom.text.split(",")
  }
  if (chatroom && userList.length === 2) {
    return true
  } else {
    return false
  }
}

// 책 사이즈 반응형 구현
export const treatBookWidth = () => {
  let width = "500px"
  if (window.matchMedia("(max-width: 700px)").matches) {
    width = "50vw"
    return width
  }
  if (window.matchMedia("(max-width: 950px)").matches) {
    width = "350px"
    return width
  }
  if (window.matchMedia("(max-width: 1150px)").matches) {
    width = "400px"
    return width
  }
  return width
}

export const treatBookHeight = () => {
  let height = "650px"
  if (window.matchMedia("(max-width: 700px)").matches) {
    height = "70vh"
    return height
  }
  if (window.matchMedia("(max-width: 950px)").matches) {
    height = "600px"
    return height
  }
  return height
}

export const closedBookWidth = () => {
  let width = "500px"
  if (window.matchMedia("(max-width: 700px)").matches) {
    width = "90vw"
    return width
  }
  if (window.matchMedia("(max-width: 950px)").matches) {
    width = "350px"
    return width
  }
  if (window.matchMedia("(max-width: 1150px)").matches) {
    width = "400px"
    return width
  }
  return width
}

export const closedBookHeight = () => {
  let height = "650px"
  if (window.matchMedia("(max-width: 700px)").matches) {
    height = "90vh"
    return height
  }
  if (window.matchMedia("(max-width: 950px)").matches) {
    height = "600px"
    return height
  }
  return height
}

export const treatBookSpine = () => {
  let spine = "50px"
  if (window.matchMedia("(max-width: 700px)").matches) {
    spine = "25px"
    return spine
  }
}
