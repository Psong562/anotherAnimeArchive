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

