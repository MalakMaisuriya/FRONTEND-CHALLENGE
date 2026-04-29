let currentFilter = "all";

$(".filter_link").click(function (e) {
  e.preventDefault();

  $(".filter_link").removeClass("active");
  $(this).addClass("active");

  currentFilter = $(this).data("filter");

  applyFilterAndSearch();
});

$("#search").on("keyup", function () {
  applyFilterAndSearch();
});

function applyFilterAndSearch() {
  let searchValue = $("#search").val().toLowerCase();

  $(".cd-item").each(function () {
    let text = $(this).text().toLowerCase();
    let matchesSearch = text.includes(searchValue);
    let matchesFilter =
      currentFilter === "all" || $(this).hasClass(currentFilter);

    if (matchesSearch && matchesFilter) {
      $(this).fadeIn();
    } else {
      $(this).hide();
    }
  });
}