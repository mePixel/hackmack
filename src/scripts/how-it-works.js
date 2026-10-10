/** Keep the template's pill interaction; event content replaces SaaS animations. */
export function init() {
  const panel = document.getElementById('hiw-panel');
  if (!panel) return;
  const pills = Array.from(panel.querySelectorAll('.hiw__pill'));
  const stages = Array.from(panel.querySelectorAll('.hiw__lottie'));
  pills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
      pills.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
        item.setAttribute('aria-pressed', String(i === index));
      });
      stages.forEach((stage, i) => {
        stage.hidden = i !== index;
        stage.classList.toggle('is-active', i === index);
      });
    });
  });
}
