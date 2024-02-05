import { Match, Switch, createEffect, createSignal } from 'solid-js'
import './App.css'

import LoadingMenu from '../LoadingMenu/LoadingMenu';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import VerifyEmail from '../VerifyEmail/VerifyEmail';
import Main from '../Main/Main';
import SessionsVerifyEmail from '../SessionVerifyEmail/VerifyEmail';
import Settings from '../Settings/Settings';
import DownMenu from '../DownMenu/DownMenu';
import EnableMFA from '../EnableMFA/EnableMFA';
import SessionsVerifyMFA from '../SessionVerifyMFA/VerifyMFA';
import Sessions from '../Sessions/Sessions';

let pageHeight: any = {
  'loading': 150,
  'login': 325,
  'signup': 445,
  'verify-email': 175,
  'main': 250,
  'session-email-verify': 175,
  'settings': 450,
  'reset-password': 175,
  'enable-mfa': 410
}

let App = () => {
  let [ logText, setLogText ] = createSignal('Loading Page...');
  let [ page, setPage ] = createSignal('loading');
  let [ containerHeight, setContainerHeight ] = createSignal(275);

  createEffect(() => {
    setContainerHeight(pageHeight[page()]);
  })

  setLogText('Checking API Status');
  fetch('https://api.phazed.xyz/api/status')
    .then(data => data.json())
    .then(async statusCheck => {
      if(!statusCheck.ok){
        setPage('down');
        return setLogText('API Down');
      }

      setLogText('API Up, Checking User Information.');
      let token = localStorage.getItem('token');

      if(!token){
        setPage('login');
        setLogText('No Token Found. Displaying Login Page.');
        return ;
      }

      setLogText('Token Found. Checking Validity.');
      let user = await (await fetch('https://api.phazed.xyz/id/v1/profile/@me?token='+token)).json();

      if(!user.ok){
        if(user.error === 'Verify Email'){
          setPage('verify-email');
          setLogText('Email Needs Verifying.');
          return;
        }
        
        if(user.error === 'Session requires verification'){
          setPage('session-email-verify');
          setLogText('Email Needs Verifying.');
          return;
        }
        
        setPage('login');
        setLogText('Token Invalid. Displaying Login Page.');
        return;
      }

      setPage('main');
      setLogText('Token Valid. Loading User Information.');
    })
    .catch(e => {
      console.error(e);
      setPage('down');
      return setLogText('API Down');
    })

  return (
    <>
      <div class="container" style={{ height: containerHeight() + 'px' }}>
        <Switch>
          <Match when={page() === 'loading'}>
            <LoadingMenu />
          </Match>
          <Match when={page() === 'down'}>
            <DownMenu />
          </Match>
          <Match when={page() === 'login'}>
            <Login setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'signup'}>
            <Signup setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'verify-email'}>
            <VerifyEmail setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'main'}>
            <Main setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'session-email-verify'}>
            <SessionsVerifyEmail setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'session-mfa-verify'}>
            <SessionsVerifyMFA setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'settings'}>
            <Settings setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'reset-password'}>
            <Settings setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'enable-mfa'}>
            <EnableMFA setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'sessions'}>
            <Sessions setPage={setPage} setLogText={setLogText} />
          </Match>
        </Switch>
      </div>
      <div class="dev-logs">{ logText() }</div>
    </>
  )
}

export default App
