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
      audio: true,
      echoCancellation: true,
    })
    video.srcObject = videoStream
    video.addEventListener("loadedmetadata", () => {
      video.play()
      videoGrid.append(video)
    })
    // host와 port를 설정해주어 개인 peerjs 서버를 가동
    peer = new Peer(await getLoggedUser(), {
      host: "/",
      port: "3004",
    })
    peerList.current.myPeer = peer.id
    myPeerId.current = peer.id
    console.log(myPeerId)
    peer.on("error", (err) => {
      console.log(err)
    })

    socket.emit("sendPeerId", myPeerId.current)
    socket.on("getPeerId", async (id) => {
      console.log(id)
      console.log(peerList)
      peerList.current.targetUser = id
      peer.on("open", (userID) => {
        console.log(userID)
      })
      const connection = peer.connect(id, {
        metadata: { id: myPeerId.current },
      })

      connection.on("error", (err) => {
        console.log(err)
      })

      peer.on("connection", (conn) => {
        console.log("연결 생성됨")
        console.log(conn)
        conn.on("data", (data) => {
          console.log("받음", data)
        })

        conn.send("Hello Connection!")
      })

      const mediaConnection = peer.call(id, videoStream)

      mediaConnection.on("error", (err) => {
        console.log(err)
      })

      console.log(connection)
    })
  }

  useEffect(() => {
    createVideoStream()
  }, [])

  return <VideoGrid id="videoGrid"></VideoGrid>
}

export default useVideoCall
