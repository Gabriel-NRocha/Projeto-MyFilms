const overlay = document.getElementById("modal-overlay");
const background = document.getElementById("modal-background");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const botaoSearch = document.getElementById("search-button");
const modalContainer = document.getElementById("modal-conteiner");
const movieListContainer = document.getElementById("movie-list");

let currentMovie = {};

function backgroundClickHandler() {
  overlay.classList.remove("open");
}

function closeModal() {
  overlay.classList.remove("open");
}
function addCurrentToList() {
  if (isMovieAlreadyOnList(currentMovie.imdbID)) {
    notie.alert({ type: "error", text: "Filme já está na sua lista" });
    return;
  }
  addToList(currentMovie);
  upDateUi(currentMovie);
  closeModal();
}

function createModal1(data) {
  currentMovie = data;
  modalContainer.innerHTML = `<h2 id="movie-title">${data.Title} - ${data.Year}</h2>
          <section id="modal-body">
            <img
              src=${data.Poster}
              alt="Imagem Filme" id="movie-poster"
            />
            <div id="movie-info">
             <h3>
               
                 id="movie-plot">
                  ${data.Plot}
                </h3>
             <div>
               <h5> Elenco </h5>
                <p id="movie-cast">${data.Actors}</p>
             </div>
              <div>
                <h5>Gênero</h5>
                <p id="movie-genre">${data.Genre}</p>
              </div>
            </div>
          </section>
          <section id="modal-footer">
            <button id="ad-to-list" onclick = '{addCurrentToList()}'>Adicionar à lista</button>
          </section>`;
}
background.addEventListener("click", backgroundClickHandler);

let movieList = [];

async function searchButtonClickHandler() {
  try {
    const movieNameValue = movieName.value.trim().split(" ").join("+");
    const movieYearValue = movieYear.value.trim();
    let url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieNameValue}&y=${movieYearValue}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log("data: ", data);
    if (data.Error) {
      throw new Error("Filme não encontrado");
    }
    createModal1(data);
    overlay.classList.add("open");
  } catch (error) {
    notie.alert({ type: "error", text: error.message });
  }
}

function movieNameParameter() {
  if (movieName.value === " ") {
    throw new Error("O nome do filme deve ser informado");
  }
  return movieName.value.split(" ").join("+");
}

function movieYearParameter() {
  if (movieYear.value === "") {
    return "";
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error("Digite um número válido");
  }
  return "&y=" + movieYear.value;
}

function addToList(movieObject) {
  movieList.push(movieObject);
}
function isMovieAlreadyOnList(id) {
  function doesThisIdBelong(movieObject) {
    return movieObject.imdbID === id;
  }
  return Boolean(movieList.find(doesThisIdBelong));
}

function upDateUi(movieObject) {
  movieListContainer.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
  <img
    src= ${movieObject.Poster}
    alt="Poster de ${movieObject.Title}"
  />
  <button class="remove-button" onclick="
{removeFilmFromList('${movieObject.imdbID}')}">
<i class="bi bi-trash"></i>Remover
</button>
</article>`;
}
function removeFilmFromList(id) {
  movieList = movieList.filter((movie) => movie.imdbID !== id);
  document.getElementById(`movie-card-${id}`).remove();
}

botaoSearch.addEventListener("click", searchButtonClickHandler);
