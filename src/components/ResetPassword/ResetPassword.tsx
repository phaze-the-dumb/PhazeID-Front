import './ResetPassword.css'

class ResetPasswordProps{
  setLogText!: ( page: string ) => string;
}

let ResetPassword = ( props: ResetPasswordProps ) => {
  let email: HTMLInputElement;
  let container: HTMLElement;

  let reset = () => {
    if(!email.value.match(/[a-zA-z]{1,}[@].{1,}[.].{1,}/gm))
      return props.setLogText('Invalid Email');

    fetch('https://api.phazed.xyz/id/v1/auth/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Error: '+data.error);

        container.innerHTML = 'Please check your emails for a password reset link.';
        props.setLogText('Successfully sent email');
      })
  }

  return (
    <div>
      <h2>Reset Password</h2><br />

      <div ref={( el ) => container = el}>
        <div class="input">
          <input class="input-text" type="email" placeholder="Enter Email..." ref={( el ) => email = el}></input>
          <div class="input-underline"></div>
        </div><br /><br />

        <div class="button" onClick={reset}>
          Reset Password
        </div><br />
      </div>
    </div>
  )
}

export default ResetPassword