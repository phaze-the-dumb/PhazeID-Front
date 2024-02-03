import { onMount } from 'solid-js';
import './EnableMFA.css';
import CodeInput from '../CodeInput/CodeInput';

class EnableMFAProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let EnableMFA = ( props: EnableMFAProps ) => {
  let qrImage: HTMLImageElement;
  let imageLoader: HTMLElement;

  let qrCode: HTMLElement;
  let inputCode: HTMLElement;
  let prt1Info: HTMLElement;

  onMount(() => {
    fetch('https://api.phazed.xyz/id/v1/auth/mfa/enable?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        qrImage.src = data.secret;

        qrImage.onload = () => {
          imageLoader.style.display = 'none';
          qrImage.style.display = 'block';
        }
      })
  })

  let nextPart = () => {
    qrCode.style.display = 'none';
    inputCode.style.display = 'block';
    prt1Info.style.display = 'none';
  } 

  let codeEnter = ( code: string ) => {
    fetch('https://api.phazed.xyz/id/v1/auth/mfa/enable?token='+localStorage.getItem('token'), { 
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText(data.error);

        props.setLogText('2FA Enabled.');
        props.setPage('settings');
      })
      .catch(e => {
        props.setLogText('Error: ' + e);
      })
  }

  return (
    <div>
      <h2>Enable 2FA</h2><br />

      <div class="mfa-qr" ref={( el ) => qrCode = el}>
        <div class="mfa-qr-loading" ref={( el ) => imageLoader = el}></div>
        <img ref={( el ) => qrImage = el} />
      </div>

      <div style={{ display: 'none' }} ref={( el ) => inputCode = el}>
        <h4>Enter the code displayed on your 2FA app.</h4><br />
        <CodeInput onChange={codeEnter} />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>

      <div ref={( el ) => prt1Info = el}>
        <h4>Scan this QR code with your authentication app.</h4><br />
        <div class="button" style={{ width: '100%' }} onClick={nextPart}>Done</div><br />
      </div>

      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={() => props.setPage('settings')}>Back</div>
    </div>
  )
}

export default EnableMFA;