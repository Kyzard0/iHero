import React, { useState, useEffect } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      window.location.replace('/');
    }
  }, []);

  const onSubmit = e => {
    e.preventDefault();

    const user = {
      username: username,
      password1: password1,
      password2: password2
    };

    fetch('/api/auth/register/', {
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
          setPassword1('');
          setPassword2('');
          localStorage.clear();
          setErrors(true);
        }
      });
  };

  return (
    <div>
      {errors === true && <h2>Cannot signup with provided credentials</h2>}
      <div className='body_form'>
        <form className='form_card' onSubmit={onSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">Sign up</h1>
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
            value={password1}
            required
            onChange={e => setPassword1(e.target.value)}
          />
          <label className='visually-hidden' htmlFor='password2'>Confirm password:</label> <br />
          <input
            className='form-control'
            name='password2'
            type='password'
            placeholder='Confirm Password'
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
          />{' '}
          <br />
          <button className="btn btn-lg btn-primary btn-block" type='submit' value='Login'>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
