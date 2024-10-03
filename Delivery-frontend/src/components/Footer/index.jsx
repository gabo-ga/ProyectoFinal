import styled from "styled-components";

const FooterContainer = styled.footer`
  display: flex;
  width: 100vp;
  height: 112px;
  justify-content: center;
  align-items: center;
  background-color: #1abc9c;
`;

function Footer() {
  return (
    <>
      <FooterContainer>
        <h2>Proyecto de Grado 2/24</h2>
      </FooterContainer>
    </>
  );
}

export default Footer;
