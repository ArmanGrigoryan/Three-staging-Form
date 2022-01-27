let inputs=document.querySelectorAll('input:not([type="submit"])');
let btns=document.querySelectorAll('.button');
let card=inputs[0];
let name=inputs[1];
let cvc=inputs[2];
let date=inputs[3];
let prev=btns[0];
let next=btns[1];
let unit={}
let cardPattern=/[0-9]/;
let namePattern=/^[a-zA-Z- ]+$/;
let validDate=/^[0-9/]+$/i;
let datePattern=/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

inputs.forEach(v => unit[v.id]=false)

function debounce(cb, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(cb.bind(this, ...args), delay);
  }
}

inputs.forEach(v => {
  v.addEventListener('focus', function(e) {
    let str='', curr='';
    if (!this.value) {
      unit[this.id]=false
      style(this, 1);
    }
    if (e.target===card || e.target===cvc) {
      e.target.addEventListener('keypress', function(ev) {
        if (!validate(ev, cardPattern)) ev.preventDefault();
      })
      this.addEventListener('keyup', debounce(function(ev) {
        str=ev.target.value;
        str=str.replaceAll(' ', '');
        if(ev.target===card && str.length===16) {
          curr = str.split('').map((v,i) => (i+1)%4===0 ? v+' ' : v).join('').trim();
          ev.target.value=curr;
          style(ev.target);
          unit[this.id]=true
        }
        else if(ev.target===cvc && str.length>2 && str.length<5) {
          style(ev.target);
          unit[this.id]=true
        }
        else {
          style(ev.target, 1)
          unit[this.id]=false
        }
      }, 300))
    }
    else {
      this.addEventListener('keyup', debounce(function(ev) {
        str=ev.target.value;
        if (e.target===name) {
          if(str.length>=10 && str.length<=100 && namePattern.test(str)) {
            style(e.target);
            unit[this.id]=true
          }
          else {
            style(e.target, 1);
            unit[this.id]=false
          }
        }
        else {
          if(new Date(str)>Date.now() && datePattern.test(str)) {
            style(ev.target)
            unit[this.id]=true
          }
          else {
            style(ev.target, 1)
            unit[this.id]=false
          }
        }
      }, 300))
    }
  })
})

function validate(evt, pattern) {
  if (evt.type === 'paste') {
    key = evt.clipboardData.getData('text/plain');
  } else {
    var key = evt.keyCode || evt.which;
    key = String.fromCharCode(key);
  }
  return !pattern.test(key) ? false : true;
}

function style(elem, state) {
  if (state) {
    elem.style.outline = 'none';
    elem.style.border = '2px solid red'
  }
  else elem.style.border = '2px solid #bebaba'
}

let throt=true;
prev.addEventListener('click', ev => {
  inputs.forEach(v => v.required = false)
  window.location.href='#prev';
});

let end=document.getElementById('end');
next.addEventListener('click', ev => {
  let timeout, input=true, ok=true;
  inputs.forEach(v => {
    if(!v.value) {
      input=false;
    }
  })
  for (let i in unit) {
    if(!unit[i]) 
      ok=false;
  }
  if (1) {
    throt=false;
    document.querySelector('#first').style.display='none';
    document.querySelector('#second').style.display='none';
    end.style.display='block';
    window.location.href='#next';
    timeout=setTimeout(() => throt=true, 10000);
  }
});
