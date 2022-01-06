var today = new Date();

var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

// function for logout user to remove from local storage and send back to login screen
async function logoutUser() {
  localStorage.removeItem('username')
  localStorage.removeItem('token')
  location = '/login.html'
}
document.getElementById('logout').addEventListener('click', logoutUser)


// allows profile to be rendered using token, if not sent back to login screen
async function getProfile() {
  try {
    const { data: user } = await axios.get('/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return user

  } catch (err) {
    location = '/login.html'
  }
}

// delete button to remove saved anime from database
document.addEventListener('click', event => {

  if (event.target.className === 'button alert outline mif-cross-light fg-red mx-auto') {
    const index = parseInt(event.target.dataset.index)
    console.log(index)
    axios.delete(`./api/animes/${index}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {

        console.log(event.target.parentNode)
        event.target.parentNode.innerHTML = ''

        console.log('Anime Deleted')
      })
      .catch(err => console.log(err))
  }
})

async function renderPost({ id, title, image, rating, synopsis }) {
  const animeElem = document.createElement('div')
  animeElem.innerHTML = ''
  animeElem.innerHTML = `
      <div id ="results">
          <div class="fade-in">
            <br>
          <img class="img"src='${image}' alt='${title}'">
          </div>
          <h3>${title}</h3>
          <h4>Rating:<span class="mif-star-full fg-yellow"></span> ${rating}</h4>
          <p><strong>Synopsis</strong>: ${synopsis}</p>
          <h6 class="fg-darkGray"> Added on: ${date}</h6> 
      
        </div>
       
          <button id="deleteButton" class="button alert outline mif-cross-light fg-red mx-auto" data-index =${id}>Remove X </button>
      
      `


  //   `
  // <div class="row bg-light p-5 rounded-md mb-2 mt-2">
  //   <h2>${title}</h2><img src='${image}' alt='${title}' style="width:75%;">
  //   <h4>Rating: ${rating}</h4>
  //   <p>Synopsis: ${synopsis}</p>
  //   <button class ="delete" data-index =${id}> Delete </button>
  //   </div>
  //   `
  document.getElementById('posts').prepend(animeElem)
}

async function renderPosts() {

  const { animes } = await getProfile()
  animes.forEach(anime => renderPost(anime))

}


// function to retrieve username from local storage. Used to Show name for profile
async function renderUsername() {
  const username = localStorage.getItem('username')

  document.getElementById('username').textContent = username
}
renderUsername()

renderPosts()