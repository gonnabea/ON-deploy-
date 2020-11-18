import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { VideoGrid } from "../Screen/ChatroomStyle"
import Peer from "peerjs"
import io from "socket.io-client"
import { v4 } from "uuid"
import api from "../api"

let peer
const useVideoCall = () => {
  const [loggedUser, setLoggedUser] = useState(null)
  const [streamingVideo, setVideo] = useState()
  const [socket, setSocket] = useState(io.connect("https://our-now.herokuapp.com/"))
  const myPeerId = useRef(null)
  const peerList = useRef({})

  const getLoggedUser = async () => {
    const user = await api.getLoggedUser()
    console.log(user.data.id)
    setLoggedUser(user.data.id)
    return user.data.id
  }

  const createVideoStream = async () => {
    const video = document.createElement("video")
    const videoGrid = document.getElementById("videoGrid")
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { max: 240 }, height: { min: 240 }, facingMode: "user" },
      audio: true,
      echoCancellation: true,
    })

    video.controls = true

    video.srcObject = videoStream
    video.addEventListener("loadedmetadata", () => {
      video.play()
      videoGrid.append(video)
    })

    peersConnection(videoStream, video)
  }

  const peersConnection = async (videoStream, myVideo) => {
    // host와 port를 설정해주어 개인 peerjs 서버를 가동
    peer = new Peer(await getLoggedUser())
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

      // 컨넥팅 받은 피어에게 반응 (방장)
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
      callConn.on("stream", (userVideoStream) => {
        myVideo.muted = true
        const videoGrid = document.getElementById("videoGrid")
        video.srcObject = userVideoStream
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
        videoGrid.append(video)
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

      call.on("stream", (userVideoStream) => {
        console.log(userVideoStream)
        video.srcObject = userVideoStream
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
        const videoGrid = document.getElementById("videoGrid")
        videoGrid.append(video)
      })

      call.on("close", () => {
        video.remove()
      })
    })
  }

  useEffect(() => {
    createVideoStream()
  }, [])

  return <VideoGrid id="videoGrid"></VideoGrid>
}

export default useVideoCall
