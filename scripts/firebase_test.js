(async () => {
  try {
    const apiKey = 'AIzaSyAf06xaR14yHFqQBnwTHeS2qWnDYDVEIjA'; // from your config
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const body = { email: 'test@example.com', password: 'test123', returnSecureToken: true };

    // Node 18+ has global fetch
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(text);
    }
  } catch (err) {
    console.error('Request failed:', err && err.message ? err.message : err);
  }
})();
