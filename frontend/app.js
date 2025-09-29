// Health check example
fetch('/api/health')
	.then(res => res.json())
	.then(data => console.log('API Health:', data));

// Login example
function login(username, password) {
	fetch('/api/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	})
	.then(res => res.json())
	.then(data => {
		if (data.token) {
			localStorage.setItem('token', data.token);
			alert('Login successful!');
		} else {
			alert('Login failed: ' + (data.error || 'Unknown error'));
		}
	});
}

// Protected user info example
function getUserInfo() {
	const token = localStorage.getItem('token');
	fetch('/api/me', {
		headers: { 'Authorization': 'Bearer ' + token }
	})
		.then(res => res.json())
		.then(data => console.log('User info:', data));
}