import { Match, Switch, createEffect, createSignal } from 'solid-js'
import './App.css'

import LoadingMenu from '../LoadingMenu/LoadingMenu';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import VerifyEmail from '../VerifyEmail/VerifyEmail';
import Main from '../Main/Main';

let pageHeight: any = {
  'loading': 150,
  'login': 295,
  'signup': 445,
  'verify-email': 175,
  'main': 250
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
      if(!statusCheck.ok)
        return setLogText('API Down');

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
        
        setPage('login');
        setLogText('Token Invalid. Displaying Login Page.');
        return;
      }

      setPage('main');
      setLogText('Token Valid. Loading User Information.');
    })
    .catch(e => {
      console.error(e);
      return setLogText('API Down');
    })

  return (
    <>
      <div class="container" style={{ height: containerHeight() + 'px' }}>
        <Switch>
          <Match when={page() === 'loading'}>
            <LoadingMenu />
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
        </Switch>
      </div>
      <div class="dev-logs">{ logText() }</div>
    </>
  )
}

export default App