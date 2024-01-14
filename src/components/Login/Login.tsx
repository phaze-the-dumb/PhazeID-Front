import './Login.css';

class LoginProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Login = ( props: LoginProps ) => {
  let username: HTMLInputElement;
  let password: HTMLInputElement;

  let login = async () => {
    let encoder = new TextEncoder();
    let data = encoder.encode(password.value);

    let hashBuffer = await crypto.subtle.digest('SHA-512', data);
    let hashArray = Array.from(new Uint8Array(hashBuffer));

    let hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    let payload = {
      username: username.value,
      password: hashHex
    }

    let req = await fetch('https://api.phazed.xyz/id/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    let res = await req.json();

    if(!res.ok)
      return props.setLogText(res.error);

    localStorage.setItem('token', res.session);
    props.setLogText('Success.');

    if(res.valid)
      return props.setPage('main');

    if(res.requiresMfa)
      return props.setPage('mfa');

    props.setPage('session-email-verify');
  }

  return (
    <div>
      <h1>Phaze ID</h1><br />
      <h3>Login</h3><br />

      <div class="input">
        <input class="input-text" type="text" placeholder="Enter Username..." ref={( el ) => username = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />
      
      <div class="input">
        <input class="input-text" type="password" placeholder="Enter Password..." ref={( el ) => password = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="button" onClick={login}>
        Login
      </div><br />

      <div class="button-text" onClick={() => props.setPage('signup')}>
        I don't have an account
      </div>
    </div>
  )
}

export default Login;