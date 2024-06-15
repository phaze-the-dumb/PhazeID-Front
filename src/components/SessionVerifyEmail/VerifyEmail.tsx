import CodeInput from '../CodeInput/CodeInput';
import './VerifyEmail.css';
import * as cooki from '../../cookilib';

class SessionsVerifyEmailProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let SessionsVerifyEmail = ( props: SessionsVerifyEmailProps ) => {
  let emailCode = ( code: string ) => {
    fetch('https://api.phazed.xyz/id/v1/auth/sessions/verify?token='+cooki.getStore('token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Verification Failed: ' + data.error);

        props.setLogText('Verification Success, Fetching User Information.');
        return props.setPage('main');
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

export default SessionsVerifyEmail