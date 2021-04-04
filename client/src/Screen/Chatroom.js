import React, { useEffect, useState, useRef, useContext } from "react"
import Navigation from "../Hooks/useNavigation"
import Book from "../Components/3DBook"
import io from "socket.io-client"
import MsgBox from "../Components/MsgBox"
import MyMsgBox from "../Components/MyMsgBox"
import NeonLineButton from "../Components/NeonLineButton"
import GroupChatModal from "../Components/GroupChatModal"
import api from "../api"
import { useLocation } from "react-use"
import Peer from "peerjs"

import {
  Container,
  FrontContainer,
  ChatBox,
  ChatScreen,
  GreetingNotice,
  ChatForm,
  ChatText,
  ChatSubmit,
  BookFront,
  FrontBgImg,
  Inside,
  UserList,
  ChatRoomLink,
  UserInfo,
  Username,
  StatusMsg,
  ChatroomList,
  VideoCallBtn,
  showVideoCall,
  VideoGrid,
  treatBookWidth,
  treatBookHeight,
  ButtonContainer,
  VideoOptionBox,
} from "./ChatroomStyle"

import Loader from "../Components/Loader"
import { UserContext } from "../userContext"
import activateVideoCall from "../Hooks/useVideoCall"

const Chatroom = () => {
  const [isLoading, setLoading] = useState(true)
  const [messages, setMessages] = useState([]) // DB에서 가져오는 메세지들
  const [userList, setUserList] = useState() // 모든 유저리스트
  const currentRoom = useRef() // 지정된 유저 정보
  const [submit, setSubmit] = useState(0) // submit시 리렌더링 위해 작동시키는 useState
  const screenRef = useRef()
  const [flash, setFlash] = useState() // 타 유저가 접속했을 시 알림
  const [modalDisplay, setModalDisplay] = useState("none") // 그룹챗 모달 창 토글
  const [chatrooms, setChatroomList] = useState([]) // 현재 접속유저의 채팅룸 id 리스트
  const [videoCall, setVideoCall] = useState(false)
  const newMsgs = useRef([])
  const location = useLocation()
  const peerList = useRef({})
  const userContext = useContext(UserContext)
  const [loggedUser, setLoggedUser] = useState(null)
  const [socket, setSocket] = useState(io.connect("https://our-now.herokuapp.com/")) // 클라이언트 소켓 통신

  // 유저가 특정 채팅방에 들어왔을 때
  const createUserRoom = async ({ chatroom, previousRoom }) => {
    // 상대의 영상 처리 효과 상태 받기
    socket.on("patnerCVOption", (CVOption) => {
      console.log(CVOption)
      if (CVOption === "gray") {
        grayForPartner()
      } else if (CVOption === "rabbit") {
        rabbitForPartner()
      }
    })

    // 채팅방 이동 시 이전 채팅방 소켓 채널 제거
    if (previousRoom.current) {
      socket.emit("leaveRoom", { roomID: previousRoom.current.id })
    }

    let currentRoomID = chatroom ? chatroom.id : null
    if (currentRoomID && currentRoomID.username) currentRoomID = location.hash.substring(11)
    newMsgs.current = [] // 방을 이동할 시 주고받았던 메세지 초기화
    currentRoom.current = chatroom
    api.findChatroom(chatroom.id, currentRoomID)
    const roomID = currentRoomID

    // 서버에 접속, 소켓 ID 전달
    socket.emit("welcome", {
      msg: `${loggedUser ? loggedUser.username : "손님"} 접속`,
      roomID,
    })

    // 타 클라이언트 접속 메세지 리스닝
    socket.on("welcome", (msg) => {
      setFlash(msg)
    })

    // 동일 메세지 중복 전송 방지 https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d
    socket.off("sendMsg").on("sendMsg", (msg) => {
      addNewMsg(msg)
    }) // 타 클라이언트에게 메세지 받기 , recieving message

    getOriginMsg(currentRoomID)
  }

  const getOriginMsg = async (user, currentRoomID) => {
    const originMessage = await api.getOriginMsg(user, currentRoomID) // 백엔드로 타겟 유저와의 채팅기록을 요청

    originMessage.data.sort((a, b) => {
      if (a.id > b.id) {
        return 1 // 뒤로 가라 (나중에 나와라)
      } else {
        return -1 // 앞으로 와라 (먼저 나와라)
      }
    })
    // 오브젝트 배열 정렬: id 프로퍼티 오름차순으로 정렬

    // console.log(originMessage.data.sort((a,b) => a.id > b.id)) // 위와 같지만 더 심플

    // array.sort 메소드 참고: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/

    setMessages(
      originMessage.data.map((msg) => {
        return { text: msg.text, username: msg.User.username }
      })
    ) // 메세지들을 업데이트함
    screenRef.current &&
      screenRef.current.scrollTo({
        top: screenRef.current.scrollHeight + 100,
        behavior: "smooth",
      }) // 채팅창 진입 시 자동 스크롤 내리기
  }

  // opencv flask 서버 소켓 통신
  const flaskSocket = io.connect("http://localhost:5000/", {
    upgrade: false,
    transports: ["websocket"],
  })

  function videoToBase64(socketChannel, myVideo) {
    const canvas = document.createElement("canvas")

    canvas.width = 240
    canvas.height = 240
    canvas.getContext("2d").drawImage(myVideo, 0, 0, 240, 240)

    console.log(`동영상 base64 ${socketChannel} 이미지 전송 중...`)
    flaskSocket.emit(socketChannel, canvas.toDataURL("image/webp"))
  }

  // 영상처리를 위해 flask 소켓으로 보내고 있는 영상
  let streamToSocket
  function giveGrayEffect() {
    console.log("흑백 효과")
    const myVideo = document.getElementById("myVideo")
    if (streamToSocket) {
      clearInterval(streamToSocket)
    }
    imageCatcher("gray-video", "me")
    streamToSocket = setInterval(() => videoToBase64("gray-video", myVideo), 1000 / 30)
  }

  function giveRabbitEffect() {
    console.log("토끼 효과")
    const myVideo = document.getElementById("myVideo")

    if (streamToSocket) {
      clearInterval(streamToSocket)
    }
    imageCatcher("face-detection", "me")
    streamToSocket = setInterval(() => videoToBase64("face-detection", myVideo), 1000 / 15)
  }

  let partnerVidSocket
  function grayForPartner() {
    console.log("파트너 흑백 효과")
    const partnerVideo = document.getElementById("partnerVideo")
    if (partnerVidSocket) {
      clearInterval(partnerVidSocket)
    }
    imageCatcher("gray-video", "partner")
    partnerVidSocket = setInterval(() => videoToBase64("gray-video", partnerVideo), 1000 / 30)
  }

  function rabbitForPartner() {
    console.log("파트너 토끼 효과")
    const partnerVideo = document.getElementById("partnerVideo")

    if (partnerVidSocket) {
      clearInterval(partnerVidSocket)
    }
    imageCatcher("face-detection", "partner")
    partnerVidSocket = setInterval(() => videoToBase64("face-detection", partnerVideo), 1000 / 15)
  }

  const imageContainer = new Image()
  const partnerImgContainer = new Image()
  // 영상처리 소켓 리스너 활성화
  function imageCatcher(socketChannel, target) {
    flaskSocket.on(socketChannel, (base64Img) => {
      const chatroomList = document.getElementById("chatroomList")

      // https://stackoverflow.com/questions/59430269/how-to-convert-buffer-object-to-image-in-javascript
      function toBase64(arr) {
        arr = new Uint8Array(arr) // if it's an ArrayBuffer
        return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ""))
      }

      if (target === "me") {
        imageContainer.src = "data:image/webp;base64," + toBase64(base64Img)
        chatroomList.appendChild(imageContainer)
      }

      if (target === "partner") {
        partnerImgContainer.src = "data:image/webp;base64," + toBase64(base64Img)
        chatroomList.appendChild(partnerImgContainer)
      }

      console.log("Creating Image...")
    })
  }

  // 실시간으로 주고 받은 메세지 추가 함수
  const addNewMsg = (msg) => {
    newMsgs.current.push(msg)
    setSubmit((submit) => submit + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = document.getElementById("text")
    const { username } = loggedUser
    const newMessage = { username, text: message.value }
    const currentRoomID = location.hash.substring(11)
    api.sendMsg(message.value, currentRoomID) // 메세지를 백엔드 DB에 저장 요청

    const roomID = location.hash.substring(11)
    console.log(roomID)
    socket.emit("sendMsg", { roomID, newMessage }) // 채팅메세지 전송 소켓
    addNewMsg(newMessage)
    message.value = ""
    setTimeout(
      () =>
        screenRef.current &&
        screenRef.current.scrollTo({
          top: screenRef.current.scrollHeight,
          behavior: "smooth",
        }),
      0
    )
    // 메세지 보냈을 시 자동 스크롤 내리기 (★화면에 새로운 채팅 생성 후 작동해야 끝까지 내려감: setTimeout 사용)
  } // 메세지 보냈을 때 처리

  const handleApi = async () => {
    const allUsers = await api.getAllUsers() // 모든 유저정보 불러오기

    if (userContext) {
      setLoggedUser(userContext)
      setUserList(allUsers.data)
      setChatroomList(userContext.chatrooms)
    }
  }

  useEffect(() => {
    try {
      handleApi()
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
    return () => {}
  }, [])

  // 그룹챗 모달 창 토글 함수
  const startGroupChat = () => {
    if (modalDisplay === "none") {
      setModalDisplay("block")
    } else {
      setModalDisplay("none")
    }
  }

  const videoGrid = document.getElementById("videoGrid")
  const chatroomList = document.getElementById("chatroomList")

  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <Book
        width={treatBookWidth()}
        height={treatBookHeight()}
        spineWidth="50px"
        state={true}
        front={
          <BookFront>
            <Navigation />
            <FrontBgImg src="https://media.images.yourquote.in/post/large/0/0/2/119/xL077112.jpg" />
            <ButtonContainer onClick={startGroupChat}>
              <NeonLineButton width={"150px"} color={"white"} text={"+ Add Room"} />
            </ButtonContainer>
            <ChatroomList id="chatroomList">
              {chatrooms.map((chatroom, index) => {
                return (
                  <ChatRoomLink
                    key={index}
                    onClick={() => createUserRoom({ chatroom, previousRoom: currentRoom })}
                    to={{
                      pathname: `/chatroom/${chatroom.id}`,
                    }}
                  >
                    <UserInfo>
                      <Username>{chatroom.text}</Username>
                    </UserInfo>
                  </ChatRoomLink>
                )
              })}
            </ChatroomList>
          </BookFront>
        }
        inside1={
          <Inside>
            <GroupChatModal display={modalDisplay} friends={userList} loggedUser={loggedUser} />
            <ChatBox>
              <GreetingNotice>{flash}</GreetingNotice> {/* 새로운 유저가 접속했을 때 */}
              <ChatScreen id="chatScreen" ref={screenRef}>
                {messages
                  ? messages.map((
                      message,
                      index // 원래 DB에 저장되어 있었던 메세지들 표시
                    ) =>
                      loggedUser && message.username === loggedUser.username ? (
                        <MyMsgBox key={index} msg={message.text} username={message.username} /> // 내가 보낸 메세지
                      ) : (
                        <MsgBox key={index} msg={message.text} username={message.username} /> // 받은 메세지
                      )
                    )
                  : null}
                {newMsgs.current
                  ? newMsgs.current.map((
                      message,
                      index // 메시지 송신 시 가상으로 생성한 DOM, 소켓으로 받은 새로운 메세지들 표시
                    ) =>
                      loggedUser && message.username === loggedUser.username ? (
                        <MyMsgBox key={index} msg={message.text} username={message.username} /> // 내가 보낸 메세지
                      ) : (
                        <MsgBox key={index} msg={message.text} username={message.username} /> // 받은 메세지
                      )
                    )
                  : null}
                <VideoGrid id="videoGrid"></VideoGrid>
                {videoCall && videoGrid.innerHTML !== "" // 이미 화상 통화 중 페이지 렌더링 시 중복 실행 방지
                  ? activateVideoCall(loggedUser, videoGrid, chatroomList, socket, flaskSocket)
                  : null}
              </ChatScreen>
              <ChatForm onSubmit={handleSubmit} action="chat" method="post">
                <ChatText id="text" type="text" name="content" required={true} />
                <ChatSubmit type="submit" value="전송" />
              </ChatForm>
              {/* 채팅방 내의 유저가 2명일 경우만 보임, 버튼 클릭 시 사라짐 */}
              {currentRoom && showVideoCall(currentRoom.current) ? (
                <VideoCallBtn
                  onClick={(e) => {
                    const videoGrid = document.getElementById("videoGrid")
                    const chatScreen = document.getElementById("chatScreen")
                    setVideoCall(true)
                    e.target.remove()
                    videoGrid.style.display = "flex"
                    videoGrid.style.flexDirection = "column"

                    // 화상채팅 시 영상효과 옵션 선택 버튼
                    const videoOptionBox = document.createElement("div")
                    const grayBtn = document.createElement("button")
                    grayBtn.innerHTML = "흑백"
                    grayBtn.addEventListener("click", () => {
                      socket.emit("patnerCVOption", "gray")
                      giveGrayEffect()
                    })

                    const rabbitBtn = document.createElement("button")
                    rabbitBtn.innerHTML = "토끼"
                    rabbitBtn.addEventListener("click", () => {
                      socket.emit("patnerCVOption", "rabbit")
                      giveRabbitEffect()
                    })
                    videoOptionBox.appendChild(grayBtn)
                    videoOptionBox.appendChild(rabbitBtn)

                    chatScreen.appendChild(videoOptionBox)
                  }}
                >
                  🎥
                </VideoCallBtn>
              ) : (
                console.log("p2p 아니라서 화상채팅 불가!")
              )}
            </ChatBox>
          </Inside>
        }
      />
    </Container>
  )
}

export default Chatroom
