import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { VideoGrid } from "../Screen/ChatroomStyle"
import Peer from "peerjs"
import io from "socket.io-client"
import { v4 } from "uuid"
import api from "../api"

const peers = {}
const useVideoCall = () => {
  const [loggedUser, setLoggedUser] = useState(null)
  const [streamingVideo, setVideo] = useState()
  const [socket, setSocket] = useState(io.connect("https://our-now.herokuapp.com/"))
  const myPeerId = useRef(null)

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
      video: { width: 320, height: 240 },
      audio: true,
      echoCancellation: true,
    })
    video.srcObject = videoStream
    video.addEventListener("loadedmetadata", () => {
      video.play()
      videoGrid.append(video)
    })
    const peer = new Peer(await getLoggedUser())
    myPeerId.current = peer.id
    console.log(myPeerId)
    socket.emit("sendPeerId", myPeerId.current)
    socket.on("sendPeerId", (id) => {
      console.log(id)
      const connection = peer.connect(id, {
        metadata: { id: myPeerId.current },
      })
      connection.on("open", (msg) => {
        connection.send("hi!")
        console.log("유저가 접속해서 컨넥션 오픈됨, 상대에게 hi라고 보냄")
        console.log(msg)
      })
      console.log(connection)
    })

    peer.on("connection", (connection) => {
      connection.on("data", (data) => {
        console.log(data)
      })
      connection.on("open", () => {
        connection.send("hello!")
      })
    })
  }

  useEffect(() => {
    createVideoStream()
  }, [])

  return <VideoGrid id="videoGrid"></VideoGrid>
}

export default useVideoCall
