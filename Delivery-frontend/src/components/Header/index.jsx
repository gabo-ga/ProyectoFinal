import styled from "styled-components";
import UserProfile from "../../assets/user.png";

const HeaderContainer = styled.header`
  width: 100vp;
  height: 112px;
  flex-shrink: 0;
  background-color: #1abc9c;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

function Header() {
  return (
    <>
      <HeaderContainer>
        <img
          src={UserProfile}
          alt="user-picture"
          style={{ width: 76, height: 76 }}
        />
      </HeaderContainer>
    </>
  );
}

export default Header;
