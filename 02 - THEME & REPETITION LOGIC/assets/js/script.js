document.addEventListener("DOMContentLoaded", function () {

  let themeSwitch = document.getElementById("themeSwitch");

  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
  }

  function switchTheme() {
    document.body.classList.toggle("dark");

    let theme = document.body.classList.contains("dark")
      ? "dark"
      : "light";

    localStorage.setItem("theme", theme);
  }

  themeSwitch.addEventListener("change", () => {
    if (document.startViewTransition) {
      document.startViewTransition(switchTheme);
    } else {
      switchTheme();
    }
  });

  let boxCount = localStorage.getItem("boxCount");

  if (!boxCount) {
    boxCount = parseInt(prompt("How many input boxes do you want? (Max 100)", "5"));

    if (isNaN(boxCount) || boxCount <= 0) boxCount = 5;
    if (boxCount > 100) boxCount = 100;

    localStorage.setItem("boxCount", boxCount);
  } else {
    boxCount = parseInt(boxCount);
  }

  for (let i = 1; i <= boxCount; i++) {
    $("#box-container").append(`<input type="number" id="box${i}" class="input-box">`);
  }

  $("#random").click(function () {
    for (let i = 1; i <= boxCount; i++) {
      $(`#box${i}`).val(Math.floor(Math.random() * 100));
    }
  });

  $("#clear").click(function () {
    $(".input-box").val("");
    $("#result").text("");
  });

  $("#max").click(function () {
    let max = -Infinity;
    $(".input-box").each(function () {
      let val = parseInt($(this).val());
      if (!isNaN(val)) max = Math.max(max, val);
    });
    $("#result").text("Max: " + max);
  });

  $("#min").click(function () {
    let min = Infinity;
    $(".input-box").each(function () {
      let val = parseInt($(this).val());
      if (!isNaN(val)) min = Math.min(min, val);
    });
    $("#result").text("Min: " + min);
  });

  $("#sum").click(function () {
    let sum = 0;
    $(".input-box").each(function () {
      let val = parseInt($(this).val());
      if (!isNaN(val)) sum += val;
    });
    $("#result").text("Sum: " + sum);
  });

  $("#avg").click(function () {
    let sum = 0, count = 0;
    $(".input-box").each(function () {
      let val = parseInt($(this).val());
      if (!isNaN(val)) {
        sum += val;
        count++;
      }
    });
    $("#result").text("Avg: " + (sum / count || 0).toFixed(2));
  });

});