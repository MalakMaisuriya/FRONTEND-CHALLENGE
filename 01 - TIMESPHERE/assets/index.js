let selectedZone = "Asia/Kolkata";

window.addEventListener("DOMContentLoaded", () => {

  // Country dropdown change
  const countrySelect = document.getElementById("country");
  if (countrySelect) {
    countrySelect.addEventListener("change", (e) => {
      selectedZone = e.target.value;
    });
  }

  new BouncyBlockClock(".clock");
});

class BouncyBlockClock {
  constructor(qs) {
    this.el = document.querySelector(qs);
    this.time = { a: [], b: [] };
    this.rollClass = "clock__block--bounce";
    this.loop();
  }

  animateDigits() {
    const groups = this.el.querySelectorAll("[data-time-group]");
    Array.from(groups).forEach((group, i) => {
      if (this.time.a[i] !== this.time.b[i]) {
        group.classList.add(this.rollClass);
      }
    });

    setTimeout(() => {
      groups.forEach(g => g.classList.remove(this.rollClass));
    }, 900);
  }

  displayTime() {
    const timeDigits = [...this.time.b];
    const ap = timeDigits.pop();

    this.el.ariaLabel = `${timeDigits.join(":")} ${ap}`;

    ["a","b"].forEach(letter => {
      const els = this.el.querySelectorAll(`[data-time="${letter}"]`);
      els.forEach((el, i) => {
        el.textContent = this.time[letter][i];
      });
    });

    const ampm = document.getElementById("ampm");
    if (ampm) ampm.textContent = ap;
  }

  loop() {
    this.updateTime();
    this.displayTime();
    this.animateDigits();
    setTimeout(() => this.loop(), 1000);
  }

  updateTime() {
    const now = new Date().toLocaleString("en-US", {
      timeZone: selectedZone
    });

    const date = new Date(now);

    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ap = h < 12 ? "AM" : "PM";

    if (h === 0) h = 12;
    if (h > 12) h -= 12;

    this.time.a = [...this.time.b];
    this.time.b = [
      h.toString().padStart(2,"0"),
      m.toString().padStart(2,"0"),
      s.toString().padStart(2,"0"),
      ap
    ];

    if (!this.time.a.length) {
      this.time.a = [...this.time.b];
    }
  }
}