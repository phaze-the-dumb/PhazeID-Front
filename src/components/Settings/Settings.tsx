import { onMount, Switch, Match } from 'solid-js';
import './Settings.css';

class SettingsProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Settings = ( props: SettingsProps ) => {
  let content: HTMLElement;
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

  let mainSettings = () => {
    content.innerHTML = '';
    content.appendChild(<div>
      <h4>MFA Settings</h4>

      <Switch>
        <Match when={userInfo.hasMfa}>
          <div class="button" style={{ width: '100%' }}>Disable 2FA</div>
        </Match>
        <Match when={!userInfo.hasMfa}>
          <div class="button" style={{ width: '100%' }}>Enable 2FA</div>
        </Match>
      </Switch>
      <br /><br />

      <h4>Profile</h4>

      <div class="button" style={{ width: '100%' }} onClick={changeEmail}>Change Email</div><br />
      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={changeUsername}>Change Username</div><br />
      <div class="button" style={{ width: '100%', 'margin-top': '5px' }} onClick={changePassword}>Change Password</div>
    </div> as Node);
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
  })
  
  return (
    <div>
      <h2>Settings</h2><br />

      <div ref={( el ) => content = el}>Loading...</div><br />

      <div class="button" style={{ width: '100%' }} onClick={() => props.setPage('main')}>Back</div>
    </div>
  )
}

export default Settings;