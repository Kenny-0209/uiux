(() => {
  'use strict';
  document.querySelectorAll('.figure-marker').forEach(marker => {
    marker.addEventListener('click', event => {
      const detail = document.getElementById(marker.hash.slice(1));
      if (!detail) return;
      event.preventDefault();
      detail.open = true;
      detail.scrollIntoView({behavior: 'smooth', block: 'start'});
      detail.querySelector('summary')?.focus({preventScroll: true});
      history.replaceState(null, '', marker.hash);
    });
  });
  const initial = document.getElementById(location.hash.slice(1));
  if (initial?.matches('details[id^="sfm-point-"]')) initial.open = true;
})();
