function LoginCard() {
    return (
        <>
        <div className="login-container">
    <h1>INICIAR SESION</h1>
    <div className="input-group">
        <EmailInput></EmailInput>
        <PasswordInput></PasswordInput>
    </div>
    <LoginButton></LoginButton>
</div>   
        </>
    );
}

function EmailInput(){
    return (
        <>
        <div>
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="Ingrese su correo"/>
            </div>
        </>
    );
}

function PasswordInput(){
    return(
        <>
        <div>
        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" placeholder="Ingrese su contraseña"/>
        </div>
        </>
    );
}

function LoginButton(){
    return (
        <>
        <button className="btn-login">INICIAR SESION</button>
        </>
    );
}

export default LoginCard;
