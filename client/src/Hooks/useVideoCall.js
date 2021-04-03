import Peer from "peerjs"
import { useContext } from "react"
import io from "socket.io-client"
import { UserContext } from "../userContext"
import { videoGrid, chatroomList } from "../Screen/Chatroom"

const peerList = {}
const socket = io.connect("https://our-now.herokuapp.com/") // 클라이언트 소켓 통신

// opencv flask 서버 소켓 통신
const flaskSocket = io.connect("http://localhost:5000/", {
  upgrade: false,
  transports: ["websocket"],
})

// 내 카메라 비디오
const activateVideoCall = (loggedUser) => {
  flaskSocket.on("connect-flask", (msg) => {
    console.log(msg)
  })

  let peer
  const createVideoStream = async () => {
    const myVideo = document.createElement("video")
    myVideo.id = "myVideo"
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { max: 240 }, height: { min: 240 }, facingMode: "user" },
      audio: true,
      controls: true,
    })
    myVideo.muted = true
    myVideo.srcObject = videoStream
    myVideo.controls = true
    myVideo.requestPictureInPicture()
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play()
      videoGrid.append(myVideo)
    })
    peersConnection(videoStream, myVideo)
  }

  const peersConnection = async (videoStream, myVideo) => {
    // host와 port를 설정해주어 개인 peerjs 서버를 가동
    const peerOptions = {
      host: "our-now/herokuapp.com",
      debug: true,
      port: 9000,
      proxied: true,
      path: "/peerjs",
    }

    peer = new Peer(loggedUser.id)
    peerList.current.myPeer = peer.id
    console.log(peer)

    peer.on("error", (err) => {
      console.log(err)
    })

    socket.emit("sendPeerId", peer.id)
    socket.on("getPeerId", (id) => {
      console.log(id)
      peerList.current.targetPeer = id

      // 컨넥팅
      const conn = peer.connect(id)

      // 컨넥팅 신청 받은 피어에게 반응 (방장)
      conn.on("open", () => {
        console.log("컨넥션 오픈")
        console.log(conn)
        conn.send("hi!")
      })

      conn.on("error", (err) => {
        console.log(err)
      })

      conn.on("data", (data) => {
        console.log("회원으로 부터 데이터")
        console.log(data)
      })

      const callConn = peer.call(id, videoStream)
      console.log(callConn)
      const video = document.createElement("video")
      video.id = "partnerVideo"
      callConn.on("stream", (userVideoStream) => {
        myVideo.muted = true
        myVideo.requestPictureInPicture() // 통화 연결 시 PIP 모드로 전환, 모바일에선 지원 x.

        video.srcObject = userVideoStream
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
        chatroomList.append(video)
      })
      callConn.on("close", () => {
        video.remove()
      })
    })
    // 컨넥팅 시도한 피어에게 반응 (회원)
    peer.on("connection", (conn) => {
      myVideo.requestPictureInPicture() // 통화 연결 시 PIP 모드로 전환, 모바일에선 지원 x.
      myVideo.muted = true

      conn.on("error", (err) => {
        console.log(err)
      })

      console.log(conn)
      conn.on("data", (data) => {
        console.log(data)
      })
      conn.on("open", () => {
        conn.send("hello!")
      })
    })

    peer.on("call", (call) => {
      call.answer(videoStream)

      const video = document.createElement("video")
      video.id = "partnerVideo"
      call.on("stream", (userVideoStream) => {
        console.log(userVideoStream)
        video.srcObject = userVideoStream
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
        chatroomList.append(video)
      })

      call.on("close", () => {
        video.remove()
      })
    })
  }

  createVideoStream()
}

export default activateVideoCall
