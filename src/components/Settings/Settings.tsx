import { onMount, Switch, Match, Show } from 'solid-js';
import './Settings.css';
import CodeInput from '../CodeInput/CodeInput';

class SettingsProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

const PATREON_TIER_MESSAGES: any = {
  '23051636': 'Thank you for being a Patreon!',
  '23052574': 'Thank you for being a VIP Patreon!'
}

let Settings = ( props: SettingsProps ) => {
  let content: HTMLElement;
  let patreonAd: HTMLElement;
  let patreonThanks: HTMLElement;
  let patreonMessage: HTMLElement;
  let userInfo: any;

  let changeEmail = () => {
    let value: string | null = null;
    let submit = () => {
      content.innerHTML = 'Loading...';

      fetch('https://api.phazed.xyz/id/v1/profile/email?token='+localStorage.getItem('token'), {
        method: 'PUT',
        body: JSON.stringify({ email: value! }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
        .then(data => {
          if(!data.ok){
            content.innerHTML = 'Error Changing Email: ' + data.error;
            props.setLogText('Error Changing Email: ' + data.error);
            
            return;
          }

          props.setPage('verify-email');
        })
        .catch(e => {
          content.innerHTML = 'Error Changing Email: ' + e;
          props.setLogText('Error Changing Email: ' + e);
        })
    }

    content.innerHTML = '';
    content.appendChild(<div>
      <h4>Change Email</h4>

      <div class="input" style={{ 'margin-top': '5px'}}>
        <input class="input-text" type="text" placeholder="Enter New Email..." onInput={( el ) => value = el.target.value}></input>
        <div class="input-underline"></div>
      </div><br /><br />
      
      <div class="button" style={{ width: '100%' }} onClick={submit}>Save</div><br /><br /><br /><br />
      <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={mainSettings}>Cancel</div>
    </div> as Node);
  }  
  
  let changePassword = () => {
    let oldPass: string | null = null;
    let newPass: string | null = null;
    let confirmNewPass: string | null = null;
    let mfaCode: string | null = null;

    let submit = async () => {
      content.innerHTML = 'Loading...';

      if(newPass !== confirmNewPass){
        content.innerHTML = 'Passwords must be the same.';
        props.setLogText('Failed to set password.');

        return;
      }

      let encoder = new TextEncoder();

      let oldHashBuffer = await crypto.subtle.digest('SHA-512', encoder.encode(oldPass!));
      let oldHashArray = Array.from(new Uint8Array(oldHashBuffer));

      let oldHashHex = oldHashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      let newHashBuffer = await crypto.subtle.digest('SHA-512', encoder.encode(newPass!));
      let newHashArray = Array.from(new Uint8Array(newHashBuffer));

      let newHashHex = newHashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      fetch('https://api.phazed.xyz/id/v1/auth/password?token='+localStorage.getItem('token'), {
        method: 'PUT',
        body: JSON.stringify({
          password: newHashHex,
          previousPass: oldHashHex,
          mfaCode: mfaCode
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
        .then(data => {
          if(!data.ok){
            content.innerHTML = 'Error Changing Username: ' + data.error;
            props.setLogText('Error Changing Username: ' + data.error);

            return;
          }

          mainSettings();
        })
        .catch(e => {
          content.innerHTML = 'Error Changing Username: ' + e;
          props.setLogText('Error Changing Username: ' + e);
        })
    }

    let codeChange = ( val: string ) => { mfaCode = val };

    content.innerHTML = '';
    content.appendChild(<div>
      <h4>Change Password</h4>

      <div class="input" style={{ 'margin-top': '5px'}}>
        <input class="input-text" type="password" placeholder="Enter Old Password..." onInput={( el ) => oldPass = el.target.value}></input>
        <div class="input-underline"></div>
      </div><br />

      <div class="input" style={{ 'margin-top': '5px'}}>
        <input class="input-text" type="password" placeholder="Enter New Password..." onInput={( el ) => newPass = el.target.value}></input>
        <div class="input-underline"></div>
      </div><br />

      <div class="input" style={{ 'margin-top': '5px'}}>
        <input class="input-text" type="password" placeholder="Confirm New Password..." onInput={( el ) => confirmNewPass = el.target.value}></input>
        <div class="input-underline"></div>
      </div><br />

      <Show when={userInfo.hasMfa}>
        <CodeInput onChange={codeChange} /><br />
      </Show>
      
      <br />
      <div class="button" style={{ width: '100%' }} onClick={submit}>Save</div><br />
      <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={mainSettings}>Cancel</div>
    </div> as Node);
  }
  
  let changeUsername = () => {
    let value: string | null = null;
    let submit = () => {
      content.innerHTML = 'Loading...';

      fetch('https://api.phazed.xyz/id/v1/profile/username?token='+localStorage.getItem('token'), {
        method: 'PUT',
        body: JSON.stringify({ username: value! }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
        .then(data => {
          if(!data.ok){
            content.innerHTML = 'Error Changing Username: ' + data.error;
            props.setLogText('Error Changing Username: ' + data.error);

            return;
          }

          mainSettings();
        })
        .catch(e => {
          content.innerHTML = 'Error Changing Username: ' + e;
          props.setLogText('Error Changing Username: ' + e);
        })
    }

    content.innerHTML = '';
    content.appendChild(<div>
      <h4>Change Username</h4>

      <div class="input" style={{ 'margin-top': '5px'}}>
        <input class="input-text" type="text" placeholder="Enter New Username..." onInput={( el ) => value = el.target.value}></input>
        <div class="input-underline"></div>
      </div><br /><br />
      
      <div class="button" style={{ width: '100%' }} onClick={submit}>Save</div><br /><br /><br /><br />
      <div class="button" style={{ width: '100%', 'margin-top': '7px' }} onClick={mainSettings}>Cancel</div>
    </div> as Node);
  }

  let logout = () => {
    fetch('https://api.phazed.xyz/id/v1/auth/sessions?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Error Logging Out (Fetching Sessions): ' + data.error);

        fetch('https://api.phazed.xyz/id/v1/auth/sessions?token=' + localStorage.getItem('token') + '&sessionId=' + data.currentSession, { method: 'DELETE' })
          .then(data => data.json())
          .then(data => {
            if(!data.ok)
              return props.setLogText('Error Logging Out (Deleting Session): ' + data.error);

            props.setLogText('Logged Out Successfully.');
            window.location.reload();
          })     
          .catch(e => {
            props.setLogText('Error Logging Out (Deleting Session): ' + e);
          })   
      })   
      .catch(e => {
        props.setLogText('Error Logging Out (Fetching Sessions): ' + e);
      })
  }

  let disableMFA = () => {
    fetch('https://api.phazed.xyz/id/v1/auth/mfa/disable?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText(data.error);

        props.setLogText('MFA Disabled. Reloading...');
        window.location.reload();
      })
      .catch(e => {
        props.setLogText('Error: '+e);
      })
  }

  let mainSettings = () => {
    content.innerHTML = '';
    content.appendChild(<div>
      <h4>Security</h4>

      <Switch>
        <Match when={userInfo.hasMfa}>
          <div class="button" style={{ width: '100%' }} onClick={() => disableMFA()}>Disable 2FA</div>
        </Match>
        <Match when={!userInfo.hasMfa}>
          <div class="button" style={{ width: '100%' }} onClick={() => props.setPage('enable-mfa')}>Enable 2FA</div>
        </Match>
      </Switch>
      <br />
      
      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={() => props.setPage('sessions')}>Authenticated Devices</div>
      <br /><br />

      <h4>Profile</h4>

      <div class="button" style={{ width: '100%' }} onClick={changeEmail}>Change Email</div><br />
      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={changeUsername}>Change Username</div><br />
      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={changePassword}>Change Password</div><br /><br />
      <div class="button-danger" style={{ width: '100%' }} onClick={() => logout()}>Logout</div><br />
    </div> as Node);
  }

  let refreshPatreon = () => {
    props.setLogText('Refreshing Patreon data.');
    fetch('https://api.phazed.xyz/id/v1/patreon/refresh?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok){
          return props.setLogText('Error Refreshing Patreon data: ' + data.error);
        }

        fetch('https://api.phazed.xyz/id/v1/patreon/tiers?token='+localStorage.getItem('token'))
          .then(data => data.json())
          .then(data => {
            if(!data.ok)return;

            patreonAd.style.display = 'none';
            patreonThanks.style.display = 'block';

            data.tiers.forEach(( t: any ) => {
              if(PATREON_TIER_MESSAGES[t.id]){
                patreonMessage.innerText = PATREON_TIER_MESSAGES[t.id];
              }
            })
          })
      })
  }

  onMount(() => {
    props.setLogText('Requesting User Information.');
    fetch('https://api.phazed.xyz/id/v1/profile/@me?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok){
          props.setPage('login');
          props.setLogText(data.error);
        }

        userInfo = data;

        console.log(data);
        props.setLogText('Loaded User Information.');

        mainSettings();        
      })

    fetch('https://api.phazed.xyz/id/v1/patreon/tiers?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok)return;

        patreonAd.style.display = 'none';
        patreonThanks.style.display = 'block';

        data.tiers.forEach(( t: any ) => {
          if(PATREON_TIER_MESSAGES[t.id]){
            patreonMessage.innerText = PATREON_TIER_MESSAGES[t.id];
          }
        })
      })
  })
  
  return (
    <div>
      <h2>Settings</h2><br />

      <div ref={( el ) => content = el}>Loading...</div><br />

      <div class="button" style={{ width: '100%' }} onClick={() => props.setPage('main')}>Back</div>

      <div ref={( el ) => patreonAd = el} class="patreon-button" onClick={() => window.open('https://api.phazed.xyz/id/v1/patreon?token='+localStorage.getItem('token')!)}>Link Patreon Account</div>
      <div style={{ display: 'none' }} ref={( el ) => patreonThanks = el}>
        <div class="patreon-button" onClick={() => refreshPatreon()}>Refresh Patreon Account</div><br />

        <div ref={( el ) => patreonMessage = el}>
          You can find my Patreon page <span class="link" onClick={() => window.open('https://www.patreon.com/_phaz')}>here</span>
        </div>
      </div>
    </div>
  )
}

export default Settings;