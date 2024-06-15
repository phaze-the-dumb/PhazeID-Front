import CodeInput from '../CodeInput/CodeInput';
import './VerifyEmail.css';
import * as cooki from '../../cookilib';

class VerifyEmailProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let VerifyEmail = ( props: VerifyEmailProps ) => {
  let emailCode = ( code: string ) => {
    fetch('https://api.phazed.xyz/id/v1/email/verify?token='+cooki.getStore('token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Verification Failed: ' + data.error);

          props.setLogText('Verification Success, Fetching User Information.');

          let query: any = {};
          let queryString = window.location.href.split('?')[1];
        
          if(queryString){
            queryString.split('&').forEach(str => {
              query[str.split('=')[0]] = str.split('=')[1]
            })
          }
          
          if(query['oauth'])
            return props.setPage('oauth');

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