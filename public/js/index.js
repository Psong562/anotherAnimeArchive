// Anime Search function

let page = 1

function searchFnc(searchInfo, page) {
  // Here we define our query as a multi-line string
  // Storing it in a separate .graphql/.gql file is also possible
  const query = `
                    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media(id: $id, search: $search, sort: POPULARITY_DESC) {
                id
                idMal
                title {
                  romaji
                  english
                  native
                }
                type
                endDate {
                  year
                  month
                  day
                }
                startDate {
                  year
                  month
                  day
                }
                studios(isMain: true) {
                  nodes {
                    name
                  }
                }
                isAdult
                source
                genres
                volumes
                episodes
                chapters
                siteUrl
                status
                averageScore
                meanScore
                popularity
                description
                favourites
                coverImage {
                  extraLarge
                  medium
                  large
                  color
                }
              }
            }
  }`;

  // Define our query variables and values that will be used in the query request
  var variables = {
    search: searchInfo,
    page: page,
    perPage: 5
  };

  // Define the config we'll need for our Api request
  var url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

  // Make the HTTP Api request
  fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData(data) {
    console.log(data);
    let animeResult = data.data.Page.media
    console.log(data.data.Page.media[0].title.english)

    animeResult.forEach(anime => {
      let searchId = anime.id;
      let searchURL = anime.coverImage.medium;
      let searchTitle = anime.title.english;
      let searchSynopsis = anime.description;
      let searchScore = anime.meanScore;

      let searchElem = document.createElement('div');
      searchElem.classList = " ";

      searchElem.innerHTML =
        `
              <div class="oneAnime borderBottom">
              <div class="fade-in">
              <img src='${searchURL}' alt='${searchTitle}'">
              </div>
              <button class="button link saveBtn fg-green" data-index="${searchId}"
              data-role="popover" data-popover-text="Anime Saved!"data-popover-trigger="click">+
              </button>

              <h3>${searchTitle}</h3>
              <h4>Rating: <span class="mif-star-full fg-yellow"></span> ${searchScore}</h4>
              <p><strong>Synopsis</strong>: ${searchSynopsis}</p>
              </div>
              `;







      // click even to save and push to database using ID/data-index
      document.addEventListener('click', event => {

        const index = parseInt(event.target.dataset.index)
        if (event.target.className === 'button link saveBtn fg-green' && index == searchId) {



          console.log(index)
          console.log(searchId)


          // console.log(searchResults)
          const anime = {
            title: `${searchTitle}`,
            image: `${searchURL}`,
            rating: `${searchScore}`,
            synopsis: `${searchSynopsis}`
          }
          console.log(anime)

          axios.post('/api/animes', anime, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(() => console.log(`anime saved`))
            .catch(err => location = 'login.html')
        }
      });


      document.getElementById(`results`).append(searchElem)
    })



  }

  function handleError(error) {
    alert('Error, check console');
    console.error(error);
  }


}



// click event for searching anime
document.getElementById(`search`).addEventListener(`click`, event => {
  event.preventDefault()
  const searchInfo = document.getElementById(`searchInfo`).value
  console.log(searchInfo)

  // removes previous search from innerHTML 
  document.getElementById('results').innerHTML = ''
  document.getElementById('more').innerHTML = ''

  // adds more results button after first search (currently only using 10 results)
  let moreResults = document.createElement('button');
  moreResults.classList = "more button success";
  moreResults.innerHTML = "More Results";
  moreResults.id = "moreResults"

  document.getElementById('more').append(moreResults)


  searchFnc(searchInfo, page)

  document.getElementById('moreResults').addEventListener('click', event => {
    event.preventDefault()

    page++
    searchFnc(searchInfo, page)

  })


})







// function for logout user to remove from local storage and send back to login screen
async function logoutUser() {
  localStorage.removeItem('username')
  localStorage.removeItem('token')
  location = '/login.html'
}
document.getElementById('logout').addEventListener('click', logoutUser)



// function to retrieve username from local storage. Used to Show name for profile
async function renderUsername() {
  const username = localStorage.getItem('username')

  document.getElementById('username').textContent = username
}
renderUsername()







// start trending, most popular section
let trending = "TRENDING_DESC"
let allTimePopular = "POPULARITY_DESC"
let userRated = "SCORE_DESC"
let userFavorited = "FAVOURITES_DESC"




function renderAnime(sort) {
  const query = `
          query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
      }
      media(search: $search, type: ANIME, sort: ${sort}) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        type
        genres
        description
        averageScore
        meanScore
        coverImage {
          extraLarge
          medium
          large
          color
        }
      }
    }
  }
  `;

  let variables = {
    page: 1,
    perPage: 12,
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Define the config we'll need for our Api request
  var url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

  // Make the HTTP Api request
  fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleData({ data }) {
    console.log(data);


    let anime = data.Page.media
    anime.forEach(anime => {
      let synopsis = anime.description
      let unquotedSynopsis = synopsis.replace(/["]+/g, '')
      let genres = anime.genres


      let rating = anime.meanScore
      let engTitle = anime.title.english
      let japTitle = anime.title.romanji
      let searchImg = anime.coverImage.large

      // peters changes
      let trendingId = anime.id


      let trendingList = document.getElementById(sort)

      let trendingAnime = document.createElement('div')
      trendingAnime.classList.add('cell-lg-2')
      trendingAnime.classList.add('cell-md-4')
      trendingAnime.classList.add('cell-sm-6')
      trendingAnime.classList.add('media-card')

      if (anime.title.english) {
        trendingAnime.innerHTML = `
            <div class="img-container thumbnail bg-black fg-white">
              <img src="${anime.coverImage.large}" alt="anime cover image" class="coverImg"
              data-role="popover"
              data-popover-position="right"
              data-hide-on-leave="true"
              data-popover-text="
              <h6 class='title animeTitle'>
                ${anime.title.english}
              </h6>
              <hr>
              <p>${unquotedSynopsis}</p>
              <hr>
              <div></div>
              "
              >
              <button class="button link mt-1 fg-green saveBtn2" data-index="${trendingId}"
              data-role="popover" data-popover-text="Anime Saved!"data-popover-trigger="click">+</button>
            </div>
            `


        document.addEventListener('click', event => {
          const index = parseInt(event.target.dataset.index)


          if (event.target.className === 'button link mt-1 fg-green saveBtn2' && index == trendingId) {
            console.log(index)


            // console.log(searchResults)
            const anime = {
              title: `${engTitle}`,
              image: `${searchImg}`,
              rating: `${rating}`,
              synopsis: `${unquotedSynopsis}`
            }
            console.log(anime)

            axios.post('/api/animes', anime, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
              .then(() => console.log(`anime saved`))
              .catch(err => location = 'login.html')
          }
        });

      }
      else {
        trendingAnime.innerHTML = `
            <div class="img-container thumbnail bg-black fg-white">
              <img src="${anime.coverImage.large}" alt="anime cover image" class="coverImg"
              data-role="popover"
              data-popover-position="right"
              data-hide-on-leave="true"
              data-popover-text="
              <h6 class='title animeTitle'>
                ${anime.title.romaji}
              </h6>
              <hr>
              <p>${unquotedSynopsis}</p>
              "
              >
              <button class="button link mt-1 fg-green saveBtn2 data-index="${trendingId}"
              data-role="popover" data-popover-text="Anime Saved!"data-popover-trigger="click">+</span></button>
            </div>
            `
        // peters changes
        document.addEventListener('click', event => {

          const index = parseInt(event.target.dataset.index)

          if (event.target.className === 'button link mt-1 fg-green saveBtn2' && index == trendingId) {

            // console.log(searchResults)
            const anime = {
              title: `${japTitle}`,
              image: `${searchImg}`,
              rating: `${rating}`,
              synopsis: `${unquotedSynopsis}`
            }
            console.log(anime)

            axios.post('/api/animes', anime, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
              .then(() => console.log(`anime saved`))
              .catch(err => location = 'login.html')
          }
        });



      }


      trendingList.append(trendingAnime)
    })
  }

  function handleError(error) {
    alert('Error, check console');
    console.error(error);
  }

}

renderAnime(userRated)
renderAnime(trending)
renderAnime(allTimePopular)
renderAnime(userFavorited)
