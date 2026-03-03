(function () {
  'use strict';

  function mount() {
    if (document.getElementById('zuoweimen-pet')) return;

    var wrap = document.createElement('div');
    wrap.id = 'zuoweimen-pet';
    wrap.style.position = 'fixed';
    wrap.style.right = '26px';
    wrap.style.bottom = '22px';
    wrap.style.zIndex = '9990';
    wrap.style.width = '118px';
    wrap.style.cursor = 'pointer';
    wrap.innerHTML =
      '<img src="/img/zuoweimen.svg" alt="胖嘟嘟左卫门">' +
      '<div class="zuoweimen-bubble">正義夥伴 左衛門參上</div>';

    var img = wrap.querySelector('img');
    if (img) {
      img.style.display = 'block';
      img.style.width = '100%';
    }

    wrap.addEventListener('click', function () {
      wrap.classList.remove('zuoweimen-wave');
      void wrap.offsetWidth;
      wrap.classList.add('zuoweimen-wave');
    });

    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  document.addEventListener('pjax:complete', mount);
})();
