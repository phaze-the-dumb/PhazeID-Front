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
import ResetPassword from '../ResetPassword/ResetPassword';
import FinalPassReset from '../FinalPassReset/FinalPassReset';
import OAuth from '../OAuth/OAuth';

let pageHeight: any = {
  'loading': 150,
  'login': 325,
  'signup': 445,
  'verify-email': 175,
  'main': 300,
  'oauth': 200,
  'session-email-verify': 175,
  'session-mfa-verify': 175,
  'settings': 450,
  'reset-password': 175,
  'password-reset': 230,
  'enable-mfa': 410
}

let App = () => {
  let [ logText, setLogText ] = createSignal('Loading Page...');
  let [ page, setPage ] = createSignal('loading');
  let [ containerHeight, setContainerHeight ] = createSignal(275);

  let query: any = {};
  let queryString = window.location.href.split('?')[1];

  if(queryString){
    queryString.split('&').forEach(str => {
      query[str.split('=')[0]] = str.split('=')[1]
    })
  }

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

      if(query['passreset'])
        return setPage('password-reset');

      setLogText('API Up, Checking User Information.');
      let token = localStorage.getItem('token');

      if(!token){
        setPage('login');
        setLogText('No Token Found. Displaying Login Page.');
        return;
      }

      setLogText('Token Found. Checking Validity.');
      let user = await (await fetch('https://api.phazed.xyz/id/v1/profile/@me?token='+token)).json();

      if(!user.ok){
        if(user.error === 'MFA Auth Needed')
          return setPage('session-mfa-verify');

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

      setLogText('Token Valid. Loading User Information.');
      setPage('main');
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
            <ResetPassword setLogText={setLogText} />
          </Match>
          <Match when={page() === 'enable-mfa'}>
            <EnableMFA setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'sessions'}>
            <Sessions setPage={setPage} setLogText={setLogText} />
          </Match>
          <Match when={page() === 'password-reset'}>
            <FinalPassReset setPage={setPage} setLogText={setLogText} resetToken={query['passreset']} />
          </Match>
          <Match when={page() === 'oauth'}>
            <OAuth setPage={setPage} setLogText={setLogText} />
          </Match>
        </Switch>
      </div>
      <div class="dev-logs">{ logText() }</div>
    </>
  )
}

export default App
