let page = 1;
var perPage = 10;

function loadMovieData(title = null) {
  let url;
  let pagination = document.querySelector(".pagination");
  if (title) {
    url = `http://localhost:8080/api/movies?page=${page}&perPage=${perPage}&title=${title}`;
    page = 1;
    pagination.classList.add("d-none");
  } else {
    url = `http://localhost:8080/api/movies?page=${page}&perPage=${perPage}`;
    pagination.classList.remove("d-none");
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let rows = `
  ${data
    .map(
      (movie) =>
        `<tr id="${movie._id}">
        <td>${movie.year}</td>
        <td>${movie.title}</td>
        <td>${movie.plot}</td>
        <td>${movie.rated}</td>
        <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60)
          .toString()
          .padStart(2, "0")}</td>
        </tr>
        `
    )
    .join("")}
`;
      document.querySelector("#moviesTable tbody").innerHTML = rows;
      document.querySelector("#current-page").innerHTML = page;
      document.querySelectorAll("#moviesTable tbody tr").forEach((row) => {
        row.addEventListener("click", (e) => {
          console.log("here");
          let dataId = row.id;
          let url = `http://localhost:8080/api/movies/${dataId}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              document.querySelector("#detailsModal .modal-title").innerHTML =
                data.title;
              let modal = `
                ${
                  data.poster
                    ? `<img class="img-fluid w-100" src="${data.poster}" alt=""><br><br>`
                    : ""
                }
                <strong>Directed By:</strong> ${data.directors.join(
                  ","
                )}<br><br>
                <p>${data.fullplot}</p>
                <strong>Cast:</strong> ${
                  data.cast ? data.cast.join(",") : "N/A"
                }<br><br>
                <strong>Awards:</strong> ${data.awards.text}<br>
                <strong>IMDB Rating:</strong> ${data.imdb.rating} (${
                data.imdb.votes
              } votes)
                `;
              document.querySelector("#detailsModal .modal-body").innerHTML =
                modal;
              let bModal = new bootstrap.Modal(
                document.getElementById("detailsModal"),
                {
                  backdrop: "static",
                  keyboard: false,
                  focus: true,
                }
              );
              bModal.show();
            });
        });
      });
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadMovieData();
  let prev = document.querySelector("#previous-page");
  prev.addEventListener("click", function () {
    if (page > 1) {
      page -= 1;
      loadMovieData();
    }
  });
  let next = document.querySelector("#next-page");
  next.addEventListener("click", function () {
    page += 1;
    loadMovieData();
  });
  const searchform = document.querySelector("#searchForm");
  searchform.addEventListener("submit", function (event) {
    page = 1;
    event.preventDefault();
    let title = document.getElementById("title").value;
    loadMovieData(title);
  });
  const clearform = document.querySelector("#clearForm");
  clearform.addEventListener("click", function (event) {
    document.getElementById("title").value = "";
    loadMovieData();
  });
});
