let inputs=document.querySelectorAll('#second input');
let selects=document.querySelectorAll('select');
let btn=document.querySelector('.button');
let checkbox=document.querySelector('input[type="checkbox"]');
let sh_city=document.getElementById('sh_city');
let sh_addr=document.getElementById('sh_addr');
let sh_post=document.getElementById('sh_post');
let city=document.getElementById('city');
let addr=document.getElementById('addr');
let post=document.getElementById('post');
let namePattern=/^([a-z-]{0,})$/i;
let addrPattern=/^([a-z0-9,.-\s/]{0,})$/i;
let postPattern=/^([0-9]{0,})$/;
let countries=selects[0];
let sh_countries=selects[1];

function debounce(cb, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(cb.bind(this, ...args), delay);
  }
}

countries.addEventListener('change', ev => {
  if(checked) sh_countries.value = (ev.target.value===ev.target[0].innerText) ? sh_countries[0].innerText : ev.target.value;
})

inputs.forEach(v => {
  v.addEventListener('focus', function(e) {
    let str='';
    if (!this.value) {
      style(this, 1);
    }
    this.addEventListener('keyup', debounce(function(ev) {
      str=ev.target.value.trim();
      if (ev.target.id==='addr' || ev.target.id==='sh_addr') {
        if(str.length!==0 && str.length<50 && addrPattern.test(str)) {
          style(ev.target);
          if(checked) sh_addr.value = ev.target.value        
        }
        else style(ev.target, 1)
      }
      else if (ev.target.id==='post' || ev.target.id==='sh_post') {
        if(str.length>=4 && str.length<=10 && postPattern.test(str)) {
          style(ev.target)
          if(checked) sh_post.value = ev.target.value
        }
        else style(ev.target, 1)
      }
      else {
        if(str.length!==0 && str.length<25 && namePattern.test(str)) {
          style(ev.target)
          if (checked && ev.target.id==='city') sh_city.value = ev.target.value
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

let checkbox_change=0, checked=false;
checkbox.addEventListener('change', (ev) => {
  if(++checkbox_change%2 === 1) {
    checked=!checked
    render(1);
  }
  else {
    checked=!checked
    render();
  }
})

function render(state) {
  if(state) {
    sh_city.disabled = true;
    sh_addr.disabled = true;
    sh_post.disabled = true;
    sh_countries.disabled = true;
    sh_addr.value=addr.value ?? sh_addr.value
    sh_city.value=city.value || sh_city.value
    sh_post.value=post.value ?? sh_post.value
    if(countries.value !== 'Choose your country') sh_countries.value=countries.value
  }
  else {
    sh_city.disabled = false;
    sh_addr.disabled = false;
    sh_post.disabled = false;
    sh_countries.disabled = false;
    sh_city.value = '';
    sh_city.placeholder = 'Shipping city...';
    sh_addr.value = '';
    sh_addr.placeholder = 'Shipping address...';
    sh_post.value = '';
    sh_post.placeholder = 'Shipping postal code...';
    sh_countries.value = 'Choose shipping country';
  }
}

let throt=true;
btn.addEventListener('click', ev => {
  let timeout, input=true, select=true;
  inputs.forEach(v => {
    if(!v.value) {
      input=false;
    }
  })
  selects.forEach(v => {
    if(v.value==='Choose your country' || v.value==='Choose shipping country') {
      select=false;
    }
  })
  if (throt && input && select) {
    throt=false;
    window.location.href='#';
    timeout=setTimeout(() => throt=true, 4000);
  }
})
