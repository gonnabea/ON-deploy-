import React from "react"
import styled from "styled-components"
import Book from "../Components/3DBook"
import Navigation from "../Hooks/useNavigation"
import { closedBookHeight, closedBookWidth } from "../Screen/ChatroomStyle"

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Head = styled.div`
  width: 100%;
`

const BookFront = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: #314458; */
  background-image: url("https://media.images.yourquote.in/post/large/0/0/2/119/xL077112.jpg");
  background-size: 100% 100%;
  box-shadow: 0 0 10px white;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Intro = styled.main``

// 반응형을 위한 이벤트리스너
window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 500px)").matches) {
  }
  if (window.matchMedia("(max-width: 700px)").matches) {
    window.location.reload()
  }
  if (window.matchMedia("(max-width: 950px)").matches) {
    window.location.reload()
  }
  if (window.matchMedia("(max-width: 1150px)").matches) {
    window.location.reload()
  }
})

export default ({ user, loading }) => (
  <Container>
    {console.log(user)}
    <Book
      width={closedBookWidth()}
      height={closedBookHeight()}
      spineWidth="50px"
      front={
        <BookFront>
          <Head>
            <Navigation />
            {user ? `안녕하세요 ${user ? user.username : ""}님!` : ""}
          </Head>
          <Intro></Intro>
        </BookFront>
      }
    />
  </Container>
)
