import './Settings.css';

class SettingsProps{
  setPage!: ( page: string ) => string;
  setLogText!: ( page: string ) => string;
}

let Settings = ( _props: SettingsProps ) => {
  return (
    <div>
      <h2>Settings</h2>
    </div>
  )
}

export default Settings;