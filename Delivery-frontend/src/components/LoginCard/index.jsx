import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #ffc107;
  border: none;
  color: #fff;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  box-sizing: border-box;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #37474f;
  font-weight: bold;
`;
const Container = styled.div`
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 390px) {
    width: 80%;
  }
`;
const Body = styled.div`
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1abc9c;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25vw;
  padding: 4vw;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;

  @media (min-width: 390px) {
    width: 80%;
    height: 70%;
  }
`;
const H1 = styled.h1`
  margin-bottom: 30px;
  font-size: 1.75rem;
  color: #37474f;

  @media (min-width: 390px) {
    font-size: 1.5rem;
  }
`;

function LoginCard() {
  return (
    <>
      <Body>
        <LoginContainer>
          <H1>INICIAR SESION</H1>
          <Container>
            <EmailInput></EmailInput>
            <PasswordInput></PasswordInput>
          </Container>
          <LoginButton></LoginButton>
        </LoginContainer>
      </Body>
    </>
  );
}

function EmailInput() {
  return (
    <>
      <Label htmlFor="email">Correo electrónico</Label>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Ingrese su correo"
      />
    </>
  );
}

function PasswordInput() {
  return (
    <>
      <Label htmlFor="password">Contraseña</Label>
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Ingrese su contraseña"
      />
    </>
  );
}

function LoginButton() {
  const handleClick = () => {
    console.log("click");
  };
  return (
    <>
      <Button onClick={handleClick}>INICIAR SESION</Button>
    </>
  );
}

export default LoginCard;
