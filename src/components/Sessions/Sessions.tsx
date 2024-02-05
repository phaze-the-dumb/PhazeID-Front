import './Sessions.css'

class SessionsProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Sessions = ( props: SessionsProps ) => {
  return (
    <div>
      <h2>Sessions</h2>

      <div class="sessions-list">

      </div>

      <div class="button" style={{ width: '100%' }} onClick={() => props.setPage('settings')}>Back</div>
    </div>
  )
}

export default Sessions;