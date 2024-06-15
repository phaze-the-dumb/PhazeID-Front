import { onMount } from 'solid-js';

import './OAuth.css'

class OAuthProps{
  setLogText!: ( page: string ) => string;
  setPage!: ( page: string ) => string;
}

let OAuth = ( props: OAuthProps ) => {
  let container: HTMLElement;

  let query: any = {};
  let queryString = window.location.href.split('?')[1];

  if(queryString){
    queryString.split('&').forEach(str => {
      query[str.split('=')[0]] = str.split('=')[1]
    })
  }

  if(!query['oauth'])
    props.setPage('main');

  onMount(() => {
    fetch('https://api.phazed.xyz/id/v1/oauth/app?token='+localStorage.getItem('token')+'&appid='+query['oauth'])
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return window.location.href = '/';

        let accept = () => {
          fetch('https://api.phazed.xyz/id/v1/oauth/accept?token='+localStorage.getItem('token')+'&appid='+query['oauth'])
            .then(data => data.json())
            .then(data => {
              if(!data.ok)
                return props.setLogText('Failed to accept OAuth, ' + data.error);

              window.location.href = data.url + '?token=' + localStorage.getItem('token');
            })
        }
      
        let deny = () => {
          window.location.href = data.appuri + '?denied=yup';
        }

        container.innerHTML = '';
        container.appendChild(<div>
          <h2>Phaze ID</h2>
          <p>Allow { data.appname } to access your account?</p><br />

          <div class="button" style={{ width: '100%', "margin-top": '5px' }} onClick={accept}>Accept</div><br />
          <div class="button" style={{ width: '100%', "margin-top": '5px' }} onClick={deny}>Deny</div>
        </div> as Node);
      })
  })

  

  return (
    <div ref={( el ) => container = el}>
      Loading...
    </div>
  )
}

export default OAuth;