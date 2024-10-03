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
  width: 350px;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
`;
const H1 = styled.h1`
  margin-bottom: 30px;
  font-size: 24px;
  color: #37474f;
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
      <Container>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Ingrese su correo"
        />
      </Container>
    </>
  );
}

function PasswordInput() {
  return (
    <>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Ingrese su contraseña"
        />
      </div>
    </>
  );
}

function LoginButton() {
  return (
    <>
      <Button>INICIAR SESION</Button>
    </>
  );
}

export default LoginCard;
