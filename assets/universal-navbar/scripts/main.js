document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, script initialized');

    // Function to handle form submission
    const handleFormSubmit = async (form, url, successMessage, errorMessage, isSignUp = false) => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted:', data);

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
                form.reset();
                updateUIAfterLogin(result);
            } else {
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
    
        // Hide login/signup modals
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');

        if (loginModal) { 
            loginModal.classList.remove('show');
            loginModal.classList.add('hidden');
        }
        console.log('Login Modal:', loginModal);
        if (signupModal) signupModal.classList.add('hidden');
    
        // Hide login button and show user-info
        const loginButton = document.getElementById('login-button');
        if (loginButton) loginButton.style.display = 'none';
    
        const userInfo = document.getElementById('user-info');
        const usernameBox = document.getElementById('username-box');
        const dropdownMenu = document.getElementById('dropdown-menu');
    
        if (userInfo) userInfo.classList.remove('hidden');
        if (usernameBox) {
            // Set the logged-in username
            usernameBox.textContent = userData.username;
    
            // Add click listener for dropdown only once
            if (!usernameBox.hasListener) {
                usernameBox.addEventListener('click', () => {
                    dropdownMenu.classList.toggle('hidden');
                });
                usernameBox.hasListener = true;
            }
        }
    
        // Populate dropdown dynamically if empty
        if (dropdownMenu && dropdownMenu.children.length === 0) {
            dropdownMenu.innerHTML = ''; // Clear any previous content
            const dropdownItems = [
                { text: 'Profile', action: '#profile' },
                { text: 'Settings', action: '#settings' },
                { text: 'Sign Out', action: '#signout' },
            ];
    
            dropdownItems.forEach(item => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = item.action;
                link.textContent = item.text;
    
                li.appendChild(link);
                li.addEventListener('click', () => {
                    console.log(`Clicked: ${item.text}`);
                    if (item.text === 'Sign Out') signOutUser();
                });
                dropdownMenu.appendChild(li);
            });
        }
    
        console.log('Navbar updated for logged-in user.');
    };
    

    const signOutUser = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    // Observe DOM for form elements
    const observeForms = () => {
        const observer = new MutationObserver(() => {
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');

            if (loginForm) {
                observer.disconnect();
                loginForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    handleFormSubmit(
                        loginForm,
                        'http://localhost:5000/users/login',
                        'Login successful!',
                        'Login failed. Please try again.'
                    );
                });
            }

            if (signupForm) {
                observer.disconnect();
                signupForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    handleFormSubmit(
                        signupForm,
                        'http://localhost:5000/users/register',
                        'Registration successful! Logging you in...',
                        'Sign-up failed. Please try again.',
                        true
                    );
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    observeForms();
});


