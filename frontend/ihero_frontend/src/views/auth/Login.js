import React, { useState, useEffect } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      window.location.replace('/');
    } else {
      setLoading(false);
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();

    const user = {
      username: username,
      password: password
    };

    fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (data.key) {
          localStorage.clear();
          localStorage.setItem('token', data.key);
          window.location.replace('/');
        } else {
          setUsername('');
          setPassword('');
          localStorage.clear();
          setErrors(true);
        }
      });
  };

  return (
    <div>
      {errors === true && <h2>Cannot log in with provided credentials</h2>}
      {loading === false && (
        <div className='body_form'>
          <form className='form_card' onSubmit={onSubmit}>
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label className='visually-hidden' htmlFor='username'>Username:</label> <br />
            <input
              className='form-control'
              name='username'
              type='username'
              placeholder='Username'
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />{' '}
            <label className='visually-hidden' htmlFor='password'>Password:</label> <br />
            <input
              className='form-control'
              name='password'
              type='password'
              placeholder='Password'
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />{' '}
            <br />
            <button className="btn btn-lg btn-primary btn-block" type='submit' value='Login'>Sign in</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
