import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { VideoGrid } from "../Screen/ChatroomStyle"
import Peer from "peerjs"
import io from "socket.io-client"
import { useLocation } from "react-use"
import { v4 } from "uuid"

const peers = {}
const useVideoCall = ({ loggedUser = v4() }) => {
  const [streamingVideo, setVideo] = useState()
  const [socket, setSocket] = useState(io.connect("https://our-now.herokuapp.com/"))
  const myPeerId = useRef(null)

  const createVideoStream = async () => {
    const video = document.createElement("video")
    const videoGrid = document.getElementById("videoGrid")
    const videoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: 320, height: 240 },
    })
    video.srcObject = videoStream
    video.addEventListener("loadedmetadata", () => {
      video.play()
      videoGrid.append(video)
    })
    const peer = new Peer(loggedUser)
    myPeerId.current = peer.id
    console.log(myPeerId)
    socket.emit("sendPeerId", myPeerId.current)
    socket.on("sendPeerId", (id) => {
      console.log(id)
      const connection = peer.connect(id, {
        metadata: { id: myPeerId.current },
      })
      connection.on("open", () => {
        connection.send("hi!")
      })
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
