import { Show } from 'solid-js';
import './UserProfile.css';
import * as cooki from '../../cookilib';

class UserProfileProps{
  username?: string;
  avatar?: string;
  id?: string;
  isSelf?: boolean;
  setLogText!: ( page: string ) => string;
}

let UserProfile = ( props: UserProfileProps ) => {
  let fileUpload: HTMLInputElement;

  let onChanged = () => {
    props.setLogText('Loading Image...');
    let reader = new FileReader();

    reader.onload = () => {
      let canvas = document.createElement('canvas');

      canvas.width = 300;
      canvas.height = 300;

      let image = new Image();
      image.src = reader.result!.toString();

      image.onload = () => {
        props.setLogText('Resizing Image...');
        let ctx = canvas.getContext('2d')!;
        let scaledHeight = image.width > image.height;
    
        let width = 0;
        let height = 0;
    
        if(scaledHeight){
          height = 300;
          width = (300 / image.height) * image.width;
        } else{
          width = 300;
          height = (300 / image.width) * image.height;
        }
    
        let x = 150 - width / 2;
        let y = 150 - height / 2;
    
        ctx.drawImage(image, x, y, width, height);
        let formData = new FormData();

        canvas.toBlob(( blob ) => {
          formData.append('img', blob!);

          props.setLogText('Uploading Image...');
          fetch('https://api.phazed.xyz/id/v1/profile/avatar?token='+cooki.getStore('token'), {
            method: 'PUT',
            body: formData
          })
            .then(data => data.json())
            .then(data => {
              if(!data.ok)
                return props.setLogText('Avatar Upload Failed: ' + data.error);
      
              props.setLogText('Avatar Uploaded.');
              window.location.reload();
            })
            .catch(e => {
              console.error(e);
              props.setLogText('Avatar Upload Failed.');
            })
        }, 'image/png');
      }
    }
    
    reader.readAsDataURL(fileUpload.files![0]);
  }

  return (
    <div>
      <div class="profile-pic" style={{ background: 'url("https://cdn.phazed.xyz/id/avatars/' + props.id + '/' + props.avatar + '.png")' }}>
        <Show when={props.isSelf}>
          <input type="file" id="avi-upload" style={{ display: 'none' }} accept="image/jpeg, image/png" ref={( el ) => fileUpload = el} onChange={onChanged} />

          <label for="avi-upload">
            <div class="profile-pic-edit"><i class="fa-solid fa-upload"></i></div>
          </label>
        </Show>
      </div>      

      <div class="username">{ props.username }</div>
    </div>
  )
}

export default UserProfile;