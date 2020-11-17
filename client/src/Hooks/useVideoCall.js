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

  const streamForSending = async () => {
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 360, height: 240 },
      audio: true,
      echoCancellation: true,
    })
    return videoStream
  }

  const createVideoStream = async () => {
    const video = document.createElement("video")
    const videoGrid = document.getElementById("videoGrid")
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 360, height: 240 },
      audio: false,
      echoCancellation: true,
    })
    video.srcObject = videoStream
    video.addEventListener("loadedmetadata", () => {
      video.play()
      videoGrid.append(video)
    })

    peersConnection()
  }

  const peersConnection = async () => {
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

      //
      conn.on("open", () => {
        console.log("컨넥션 오픈")
        conn.send("hi!")
      })

      // 피어가 컨넥팅 되는 것을 리슨
      peer.on("connection", (conn) => {
        console.log(conn)
        conn.on("data", (data) => {
          console.log(data)
        })
        conn.on("open", () => {
          conn.send("hello!")
        })
      })
    })
  }

  useEffect(() => {
    createVideoStream()
  }, [])

  return <VideoGrid id="videoGrid"></VideoGrid>
}

export default useVideoCall
