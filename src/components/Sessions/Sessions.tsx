import { onMount, For, Show } from 'solid-js';
import './Sessions.css'

class SessionsProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Sessions = ( props: SessionsProps ) => {
  let sessionsList: HTMLElement;

  let formatDate = ( date: number ): string => {
    let days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
    let month = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

    let d = new Date(date);
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + month[d.getMonth()] + ' (' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') + ')';
  }

  let deleteSession = ( sesId: string ) => {
    fetch('https://api.phazed.xyz/id/v1/auth/sessions?token=' + cooki.getStore('token') + '&sessionId=' + sesId, { method: 'DELETE' })
      .then(data => data.json())
      .then(data => {
        if(!data.ok)
          return props.setLogText('Error Deleting Session: ' + data.error);

        props.setLogText('Successfully Deleted Session.');
        loadSessions();
      })     
      .catch(e => {
        props.setLogText('Error Deleting Session: ' + e);
      })
  }

  let loadSessions = () => {
    fetch('https://api.phazed.xyz/id/v1/auth/sessions?token='+cooki.getStore('token'))
      .then(data => data.json())
      .then((data: any) => {
        sessionsList.innerHTML = '';
        sessionsList.appendChild(<div>
          <br />
          <For each={data.sessions}>
            { ( item ) => <div class="session">
              <h4>{ item.loc.ip } <span class="session-time">{ formatDate(item.createdOn) }</span></h4>
              <p style={{ 'font-weight': '100', 'color': '#ccc' }}>
                <Show when={data.currentSession === item._id}>
                  (This Session)<br />
                </Show>
                { item.loc.region } { item.loc.city }<br />
                { item.loc.org }
              </p>

              <Show when={data.currentSession !== item._id}>
                <br /><div class="button-danger" style={{ width: '100%' }} onClick={() => deleteSession(item._id)}>Remove Device</div>
              </Show>
            </div>}
          </For>
          <br />
        </div> as Node);
      })
  }

  onMount(() => {
    loadSessions();
  })

  return (
    <div>
      <h2>Sessions</h2>

      <div class="sessions-list" ref={( el ) => sessionsList = el}>
        Loading...
      </div>

      <div class="button" style={{ width: '100%' }} onClick={() => props.setPage('settings')}>Back</div>
    </div>
  )
}

export default Sessions;