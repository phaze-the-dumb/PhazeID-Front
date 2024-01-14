import { onMount } from 'solid-js';
import './CodeInput.css'

class CodeInputProps{
  onChange!: ( value: string ) => void
}

let CodeInput = ( props: CodeInputProps ) => {
  let codeInputs: HTMLInputElement[] = [];

  onMount(() => {
    codeInputs.forEach((inpt, i) => {
      inpt.onkeyup = ( e: KeyboardEvent ) => {
        if(inpt.value.length > 1)
          inpt.value = inpt.value[0];

        if(e.key === 'Backspace'){
          if(codeInputs[i - 1])
            codeInputs[i - 1].select();
        } else{
          if(codeInputs[i + 1])
            codeInputs[i + 1].select();
          else
            props.onChange(codeInputs.map(x => x.value).join(''));
        }
      }
    })
  })

  return (
    <div>
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
      <span style={{ margin: '2px' }}> </span>
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
      <input type="text" class="input-code" ref={( el ) => codeInputs.push(el)} />
    </div>
  )
}

export default CodeInput;