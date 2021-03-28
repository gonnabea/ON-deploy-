import React from "react"
import styled from "styled-components"

const Container = styled.section`
  display: ${(props) => props.display};
  position: absolute;
  background-image: linear-gradient(to right top, #080809, #101214, #15191b, #192021, #1f2725);

  z-index: 999;
`

const Title = styled.h1``

const SearchFriends = styled.input``

const FriendsList = styled.ul`
  padding: 0 10px 10px 0;
`

const Friend = styled.li``

const ProfileImg = styled.img``

const FriendName = styled.cite`
  color: white;
  border-radius: 10px;
  padding: 5px;
  font-weight: 700;
  box-shadow: 0 0 white 2px;
`

const SubmitForm = styled.form``

const Checkbox = styled.input``

const SubmitBtn = styled.input`
  background-color: #dd4849;
  color: white;
  border-radius: 10px;
  padding: 5px;
  font-weight: 700;
`

const GroupChatModal = ({ friends, display = "none", loggedUser }) => (
  <Container display={display}>
    <Title>대화상대 선택</Title>
    <SubmitForm action="create-groupchat" method="post">
      <FriendsList>
        {friends && loggedUser
          ? friends.map((friend) =>
              loggedUser.username !== friend.username ? ( // 본인은 목록에서 제거
                <Friend>
                  <ProfileImg>{friend.profileImg ? friend.profileImg : null}</ProfileImg>
                  <Checkbox
                    type="checkbox"
                    name={"targetUsers"}
                    value={`${friend.id}/${friend.username}`}
                  />
                  <FriendName>{friend.username}</FriendName>
                </Friend>
              ) : null
            )
          : null}
      </FriendsList>
      <SubmitBtn type="submit" value="드루와!" />
    </SubmitForm>
  </Container>
)

export default GroupChatModal
