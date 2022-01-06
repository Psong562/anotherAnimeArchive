function registerUser() {
  let newUser = {
    firstName: document.getElementById('rFirstname').value,
    lastName: document.getElementById('rLastname').value,
    username: document.getElementById('rUsername').value,
    email: document.getElementById('rEmail').value,
    password: document.getElementById('rPassword').value
  }

  console.log(newUser)

  axios.post('/api/users/register', newUser)
    .then(res => {
      console.log('user created')
      document.getElementById('rUsername').value = ''
      document.getElementById('rEmail').value = ''
      document.getElementById('rPassword').value = ''
      // alert('User Created')
    })
    .catch(err => alert('Invalid Inputs'))

}

document.getElementById('register').addEventListener('click', event => {
  event.preventDefault()
  registerUser()
  location = '/login.html'
})