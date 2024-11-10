const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// SIgn in form submit
document.getElementById('signInButton').addEventListener('click', function(event) {
  event.preventDefault(); 

  // Get input values
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  // Check if email and password match the admin credentials
  if (email === 'admin@gmail.com' && password === 'admin') {
    // Redirect to index2.html if credentials match
    window.location.href = 'indexcab.html';
  } else {
    // Show alert if credentials do not match
    alert('Email or password is incorrect. Please try again.');
  }
});
