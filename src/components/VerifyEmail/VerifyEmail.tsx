import CodeInput from '../CodeInput/CodeInput';
import './VerifyEmail.css';

class VerifyEmailProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let VerifyEmail = ( props: VerifyEmailProps ) => {
  let emailCode = ( code: string ) => {
    fetch('https://api.phazed.xyz/id/v1/email/verify?token='+localStorage.getItem('token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Verification Failed: ' + data.error);

          props.setLogText('Verification Success, Fetching User Information.');
          props.setPage('main');
      })
      .catch(e => {
        console.error(e);
        return props.setLogText('API Down');
      })
  }

  return (
    <div>
      <h1>Phaze ID</h1><br />
      <p>
        We've sent a code to your email address.<br />
        Please enter it here to verify your email.
      </p><br />

      <CodeInput onChange={emailCode} />
    </div>
  )
}

export default VerifyEmail