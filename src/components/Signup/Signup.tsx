import './Signup.css';
import * as cooki from '../../cookilib';

class SignupProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Signup = ( props: SignupProps ) => {
  let username: HTMLInputElement;
  let email: HTMLInputElement;
  let password: HTMLInputElement;
  let passwordConfirm: HTMLInputElement;
  let inLoad = false;

  let signup = async () => {
    if(inLoad)return;
    inLoad = true;
    
    if(password.value !== passwordConfirm.value)
      return props.setLogText('Error: Passwords must be the same.');

    if(!email.value.match(/[a-zA-z0-9]{1,}[@].{1,}[.].{1,}/gm))
      return props.setLogText('Invalid Email');

    let encoder = new TextEncoder();
    let data = encoder.encode(password.value);

    let hashBuffer = await crypto.subtle.digest('SHA-512', data);
    let hashArray = Array.from(new Uint8Array(hashBuffer));

    let hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    let payload = {
      username: username.value,
      password: hashHex,
      email: email.value
    }

    let req = await fetch('https://api.phazed.xyz/id/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    let res = await req.json();

    if(!res.ok){
      inLoad = false;
      return props.setLogText(res.error);
    }

    cooki.setStore('token', res.session);
    
    props.setLogText('Account Creation Successful. Please Verify Email.');
    props.setPage('verify-email');
  }

  return (
    <div>
      <h1>Phaze ID</h1><br />
      <h3>Signup</h3><br />

      <p>Profile</p>
      <div class="input">
        <input class="input-text" type="text" placeholder="Enter Username..." ref={( el ) => username = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="input">
        <input class="input-text" type="email" placeholder="Enter Email..." ref={( el ) => email = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />
      
      <p>Password</p>
      <div class="input">
        <input class="input-text" type="password" placeholder="Enter Password..." ref={( el ) => password = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="input">
        <input class="input-text" type="password" placeholder="Confirm Password..." ref={( el ) => passwordConfirm = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="button" onClick={signup}>
        Signup
      </div><br />

      <div class="button-text" onClick={() => props.setPage('login')}>
        I already have an account
      </div>
    </div>
  )
}

export default Signup;