async function testSignup() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test User",
        email: "test" + Date.now() + "@example.com",
        password: "Password123!",
        organization: "Test Org",
        plan: "basic"
      })
    });
    const data = await res.json();
    console.log("Signup status:", res.status);
    console.log("Signup data:", data);
  } catch (err) {
    console.error("Signup failed:", err);
  }
}

testSignup();
