document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, script initialized');

    // Function to handle form submission
    const handleFormSubmit = async (form, url, successMessage, errorMessage, isSignUp = false) => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted:', data);

        // Validate passwords for sign-up
        if (isSignUp && data.password !== data.confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('Server response:', result);

            if (response.ok) {
                console.log(successMessage);
                if (isSignUp) {
                    console.log('Sign-up successful! Proceeding as logged-in user...');
                }

                form.reset(); // Clear form fields
                updateUIAfterLogin(result); // Update UI for logged-in user
            } else {
                console.error(errorMessage);
                alert(result.message || errorMessage);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Function to update UI after login or sign-up
    const updateUIAfterLogin = (userData) => {
        console.log('Updating UI with user data:', userData);

        // Fade out login or signup modal
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (loginModal) loginModal.classList.add('hidden');
        if (signupModal) signupModal.classList.add('hidden');

        // Hide the login button
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.style.display = 'none';
        }

        // Update navbar with username and dropdown
        const usernameBox = document.getElementById('username-box');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const userInfo = document.getElementById('user-info');

        usernameBox.textContent = userData.username; // Show the username in the box
        userInfo.classList.remove('hidden');

        // Populate the dropdown menu with `li` items if not already added
        if (dropdownMenu.children.length === 0) {
            const dropdownItems = [
                { text: 'Profile', action: '#profile' },
                { text: 'Settings', action: '#settings' },
                { text: 'Sign Out', action: '#signout' },
            ];

            dropdownItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.text;
                li.addEventListener('click', () => {
                    console.log(`Clicked: ${item.text}`);
                    if (item.text === 'Sign Out') {
                        localStorage.removeItem('user');
                        window.location.reload(); // Reload the page or redirect
                    }
                });
                dropdownMenu.appendChild(li);
            });
        }

        // Show dropdown when username box is clicked
        usernameBox.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });

        console.log('Navbar updated for logged-in user.');
    };

    // Attach event listeners for login form
    const checkLoginForm = setInterval(() => {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            clearInterval(checkLoginForm); // Stop checking
            console.log('Login form found:', loginForm);

            loginForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default submission
                handleFormSubmit(
                    loginForm,
                    'http://localhost:5000/users/login',
                    'Login successful!',
                    'Login failed. Please try again.'
                );
            });
        }
    }, 100);

    // Attach event listeners for signup form
    const checkSignupForm = setInterval(() => {
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            clearInterval(checkSignupForm); // Stop checking
            console.log('Signup form found:', signupForm);

            signupForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default submission
                handleFormSubmit(
                    signupForm,
                    'http://localhost:5000/users/register',
                    'Registration successful! Logging you in...',
                    'Sign-up failed. Please try again.',
                    true // Indicate this is a sign-up
                );
            });
        }
    }, 100);
});
