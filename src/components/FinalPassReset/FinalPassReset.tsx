import './FinalPassReset.css';

class FinalPassResetProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
  resetToken!: string;
}

let FinalPassReset = ( props: FinalPassResetProps ) => {
  let password: HTMLInputElement;
  let passwordConfirm: HTMLInputElement;

  let changePass = async () => {
    if(password.value !== passwordConfirm.value)
      return props.setLogText('Error: Passwords must be the same.');

    let encoder = new TextEncoder();
    let data = encoder.encode(password.value);

    let hashBuffer = await crypto.subtle.digest('SHA-512', data);
    let hashArray = Array.from(new Uint8Array(hashBuffer));

    let hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    let payload = {
      token: props.resetToken,
      password: hashHex
    }

    let req = await fetch('https://api.phazed.xyz/id/v1/auth/resetpassword/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    let res = await req.json();

    if(!res.ok)
      return props.setLogText(res.error);
    
    props.setLogText('Password reset successful');
    props.setPage('login');
  }

  return (
    <div>
      <h2>Reset Password</h2><br />

      <div class="input">
        <input class="input-text" type="password" placeholder="Enter Password..." ref={( el ) => password = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="input">
        <input class="input-text" type="password" placeholder="Confirm Password..." ref={( el ) => passwordConfirm = el}></input>
        <div class="input-underline"></div>
      </div><br /><br />

      <div class="button" onClick={changePass}>
        Change Password
      </div><br />
    </div>
  )
}

export default FinalPassReset;