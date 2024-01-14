import { onMount } from 'solid-js';
import './Main.css';
import UserProfile from '../UserProfile/UserProfile';

class MainProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Main = ( props: MainProps ) => {
  let headingText: HTMLElement;
  let profile: HTMLElement;

  onMount(() => {
    props.setLogText('Requesting User Information.');
    fetch('https://api.phazed.xyz/id/v1/profile/@me?token='+localStorage.getItem('token'))
      .then(data => data.json())
      .then(data => {
        if(!data.ok){
          props.setPage('login');
          props.setLogText(data.error);
        }

        console.log(data);
        props.setLogText('Loaded User Information.');

        headingText.innerText = 'Welcome Back, ' + data.username + '.';

        profile.innerHTML = '';
        profile.appendChild(<div><UserProfile setLogText={props.setLogText} id={data.id} username={data.username} avatar={data.avatar} isSelf={true} /></div> as Node);
      })
  })

  return (
    <div>
      <h2 ref={( el ) => headingText = el}>Welcome Back</h2><br />

      <div ref={( el ) => profile = el}>
        <UserProfile setLogText={props.setLogText} />
      </div><br />

      <div style={{ "text-align": 'right', "margin-top": '-200px' }}>
        <div class="button" style={{ padding: '10px' }} onClick={() => props.setPage('settings')}><i class="fa-solid fa-gear"></i></div>
      </div>
    </div>
  )
}

export default Main;