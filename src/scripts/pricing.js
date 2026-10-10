/** Ported verbatim from the reference static build. */
export function init(reduced) {
  document.querySelectorAll('.plans').forEach((group) => {
    const cards = Array.from(group.querySelectorAll('.plan'));
    cards.forEach((card) => {
      const activate = () => cards.forEach((other) => {
        other.classList.toggle('is-featured', other === card);
      });
      card.addEventListener('pointerenter', activate);
      card.addEventListener('focusin', activate);
      card.addEventListener('click', activate);
    });
  });

  // ============ PRICING TOGGLE ============
  const toggleBtns = Array.from(document.querySelectorAll(".toggle__btn"));
  toggleBtns.forEach((b) => {
    b.addEventListener("click", () => {
      toggleBtns.forEach((other) => {
        const active = other === b;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  });
}
