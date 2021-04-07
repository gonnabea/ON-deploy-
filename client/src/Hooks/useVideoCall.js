import Peer from "peerjs"
import io from "socket.io-client"

const peerList = {}

// 내 카메라 비디오
const activateVideoCall = (
  loggedUser,
  videoGrid,
  chatroomList,
  socket,
  flaskSocket,
  currentRoomId
) => {
  console.log(currentRoomId)
  flaskSocket.on("connect-flask", (msg) => {
    console.log(msg)
  })

  let peer
  const createVideoStream = async () => {
    console.log(loggedUser)

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
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play()
      videoGrid.append(myVideo)
    })
    peersConnection(videoStream, myVideo, currentRoomId)
  }

  const peersConnection = async (videoStream, myVideo, currentRoomId) => {
    console.log(loggedUser)
    // host와 port를 설정해주어 개인 peerjs 서버를 가동
    const peerOptions = {
      host: "our-now/herokuapp.com",
      debug: true,
      port: 9000,
      proxied: true,
      path: "/peerjs",
    }

    peer = new Peer(loggedUser.id)

    // 통화 종료 버튼
    const endCallBtn = document.createElement("button")
    endCallBtn.innerHTML = "통화 종료"
    endCallBtn.addEventListener("click", (e) => {
      peer.destroy()
      e.target.remove()
      myVideo.remove()
      videoGrid.remove()
      const tracks = videoStream.getTracks()
      tracks.forEach(function (track) {
        track.stop()
      })

      // 영상채팅 옵션 버튼 박스 제거
      const videoOptionBox = document.getElementById("videoOptionBox")
      videoOptionBox.remove()
    })
    videoGrid.appendChild(endCallBtn)

    peerList.myPeer = peer.id
    console.log(peer)
    peer.on("error", (err) => {
      console.log(err)
    })

    socket.emit("sendPeerId", { peerId: peer.id, roomId: currentRoomId })
    socket.on("getPeerId", (id) => {
      console.log(id)
      peerList.targetPeer = id

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
      const video = document.createElement("video")
      video.id = "partnerVideo"
      callConn.on("stream", (userVideoStream) => {
        myVideo.muted = true

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

      // 통화 종료 버튼
      const endCallBtn = document.createElement("button")
      endCallBtn.innerHTML = "통화 종료"
      endCallBtn.addEventListener("click", () => {
        call.close()
      })
      videoGrid.appendChild(endCallBtn)

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
