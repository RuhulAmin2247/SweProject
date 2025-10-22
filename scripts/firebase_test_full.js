(async () => {
  try {
    const apiKey = 'AIzaSyAf06xaR14yHFqQBnwTHeS2qWnDYDVEIjA';
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    const body = { email: 'test@example.com', password: 'test123', returnSecureToken: true };

    const signInRes = await fetch(signInUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const signInText = await signInRes.text();
    let signInJson;
    try { signInJson = JSON.parse(signInText); } catch(e) { signInJson = { raw: signInText }; }
    console.log('SIGNIN RESPONSE:');
    console.log(JSON.stringify(signInJson, null, 2));

    if (signInRes.ok) {
      console.log('Sign-in succeeded.');
      return;
    }

    console.log('Attempting sign-up...');
    const signUpRes = await fetch(signUpUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const signUpText = await signUpRes.text();
    let signUpJson;
    try { signUpJson = JSON.parse(signUpText); } catch(e) { signUpJson = { raw: signUpText }; }
    console.log('SIGNUP RESPONSE:');
    console.log(JSON.stringify(signUpJson, null, 2));

  } catch (err) {
    console.error('Request failed:', err && err.message ? err.message : err);
  }
})();
