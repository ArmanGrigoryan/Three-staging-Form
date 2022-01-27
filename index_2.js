let inputs=document.querySelectorAll('input:not([type="radio"])');
let radios=document.querySelectorAll('input[type="radio"]');
let btns=document.querySelectorAll('.button');
let labelSpans=document.querySelectorAll('label span');
let labels=document.querySelectorAll('label');
let mail=inputs[0];
let pass=inputs[1];
let repeat=inputs[2];
let prev=btns[0];
let next=btns[1];
let mailPattern=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;
let passPattern=/^([a-z0-9.]{0,})$/i;

function debounce(cb, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(cb.bind(this, ...args), delay);
  }
}

inputs.forEach(v => {
  v.addEventListener('focus', function(e) {
    let str='';
    if (!this.value) {
      style(this, 1);
    }
    this.addEventListener('keyup', debounce(function(ev) {
      str=ev.target.value.trim();
      if (ev.target === mail) {
        if(str.length>=10 && str.length<45 && mailPattern.test(str)) 
          style(ev.target);
        else 
          style(ev.target, 1)
      }
      else {
        if(str.length>=6 && str.length<16 && passPattern.test(str)) {
          if (ev.target!==repeat || (ev.target===repeat && str===pass.value))
            style(ev.target)
          else
            style(ev.target, 1)
        }
        else style(ev.target, 1)
      }
    }, 300))
  })
})

function style(elem, state) {
  if (state) {
    elem.style.outline = 'none';
    elem.style.border = '2px solid red'
  }
  else elem.style.border = '2px solid #bebaba'
}

function add(elem, cb) {
  document.addEventListener('click', function cb(ev) { 
    style(elem); 
    this.removeEventListener('click', cb, ev);
  })
}

let throt=true;
prev.addEventListener('click', ev => {
  inputs.forEach(v => v.required = false)
  window.location.href='#prev';
});

next.addEventListener('click', ev => {
  let timeout, input=true, radioUnCheck=0;
  inputs.forEach(v => {
    if(!v.value) {
      input=false;
    }
  })
  radios.forEach(v => !v.checked ? ++radioUnCheck : 1);
  if(radioUnCheck===2) {
    labelSpans.forEach((v) => {
      style(v, 1);
      setTimeout(add, 10, v);
    })
    return;
  }
  if (throt && input) {
    throt=false;
    window.location.href='#next';
    timeout=setTimeout(() => throt=true, 4000);
  }
});
