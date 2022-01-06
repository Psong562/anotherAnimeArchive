async function loginUser(user) {
  try {
    const { data } = await axios.post('/api/users/login', user)
    return data

  } catch (err) {
    alert('Something Went Wrong. Please Try Again.')
  }
}
document.getElementById('login').addEventListener('click', async function (event) {
  event.preventDefault()

  const { username, token } = await loginUser({
    username: document.getElementById('lUsername').value,
    password: document.getElementById('lPassword').value
  })

  if (token) {
    localStorage.setItem('username', username)
    localStorage.setItem('token', token)
    location = '/'
  } else {
    alert('Invalid Username Or Password. Please Try Again.')
  }
})