import CodeInput from '../CodeInput/CodeInput';
import './VerifyMFA.css';
import * as cooki from '../../cookilib';

class SessionsVerifyEmailProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let SessionsVerifyMFA = ( props: SessionsVerifyEmailProps ) => {
  let mfaCode = ( code: string ) => {
    fetch('https://api.phazed.xyz/id/v1/auth/mfa?token='+cooki.getStore('token'), {
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
        Please enter the code from your 2FA app.
      </p><br />

      <CodeInput onChange={mfaCode} />
    </div>
  )
}

export default SessionsVerifyMFA