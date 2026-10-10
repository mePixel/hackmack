/**
 * Sections/Tab+image — click-driven tabs, matching the Framer component's
 * Desktop 1-4 / Mobile 1-4 variants. The panel cross-fades on the project's
 * default spring. There is no scroll pinning: the section scrolls normally.
 */
export function init(reduced) {
  const section = document.getElementById('delegation');
  if (!section) return;
  const buttons = Array.from(section.querySelectorAll('.feature__btn'));
  const mocks = Array.from(section.querySelectorAll('.mock'));
  if (!buttons.length) return;

  const inner = section.querySelector('.delegation__inner');
  const stage = section.querySelector('.stage');
  const mobile = window.matchMedia('(max-width: 810px)');
  let selected = 0;
  let collapsed = false;
  let panelAnimation;

  const select = (step, collapse = false) => {
    const wasCollapsed = collapsed;
    const height = stage.getBoundingClientRect?.().height;
    if (panelAnimation) {
      panelAnimation.onfinish = null;
      panelAnimation.cancel();
    }
    const animateClose = collapse && mobile.matches && !reduced && stage.animate;
    selected = step;
    collapsed = collapse;
    stage.inert = collapse;
    stage.hidden = collapse && !animateClose;
    // Tablet and phone place the stage directly beneath the active feature;
    // flex order does that without moving nodes.
    if (inner) inner.style.setProperty('--stage-order', String(step * 2 + 1));
    buttons.forEach((b) => {
      const on = !collapse && Number(b.dataset.step) === step;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = Number(b.dataset.step) === step ? 0 : -1;
      b.closest('.feature').classList.toggle('is-active', on);
    });
    mocks.forEach((m) => {
      const on = (!collapse || animateClose) && Number(m.dataset.step) === step;
      m.classList.toggle('is-active', on);
      m.hidden = !on;
      if (on && !collapse && !reduced && m.animate) {
        m.animate(
          { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0)'] },
          { duration: 540, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
        );
      }
    });
    if (animateClose || (wasCollapsed && !collapse && mobile.matches && !reduced && stage.animate)) {
      panelAnimation = stage.animate(
        { height: collapse ? [`${height}px`, '0px'] : ['0px', `${stage.getBoundingClientRect().height}px`], opacity: collapse ? [1, 0] : [0, 1] },
        { duration: 300, easing: 'ease-in-out' }
      );
      if (collapse) panelAnimation.onfinish = () => {
        stage.hidden = true;
        mocks.forEach(m => { m.hidden = true; });
      };
    }
  };

  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      const step = Number(b.dataset.step);
      select(step, mobile.matches && selected === step && !collapsed);
    });
  });
  mobile.addEventListener('change', () => select(selected));

  // Roving focus across the tablist, as expected of role="tab".
  section.querySelector('.features').addEventListener('keydown', (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % buttons.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + buttons.length) % buttons.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = buttons.length - 1;
    if (next === null) return;
    e.preventDefault();
    buttons[next].focus();
    select(Number(buttons[next].dataset.step));
  });

  select(0);
}
