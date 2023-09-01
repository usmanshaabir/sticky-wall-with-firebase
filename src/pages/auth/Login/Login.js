import React, { useEffect, useState } from 'react';
import "../../../scss/Login.scss"
import { Button, Checkbox, Form, Input } from 'antd';
import { auth } from '../../../config/firebase'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../../contexts/AuthContext';

const initState = { email: '', password: '' }

export default function Login() {
  const [state, setState] = useState(initState);
  const { setUser } = useAuth()

  const navigate = useNavigate()

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = () => {
    const { email, password } = state

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user Founded", user)
        setUser(false)
        navigate("/Home")
      })
      .catch((error) => {
        console.error("signInWithEmailAndPassword", error)
      });
  }
  const handleRegister = () => {
    navigate("/Register")
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <>
      <div className="m-0" style={{ backgroundColor: '#87CEEB', overflow: "hidden" }}>
        <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Form
            name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }} initialValues={{ remember: true }}>
            <h1 className='text-center text-capitalize text-warning mb-4' style={{ paddingLeft: '150px' }}>Login</h1>
            <Form.Item
              label="Email" name="email"
              rules={[{ required: true, message: 'Please input your userEmail!' }]}>
              <Input name="email" onChange={handleChange} />
            </Form.Item>
            <Form.Item
              label="Password" name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password name="password" onChange={handleChange} />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <div className='d-flex '>
                <Button type="primary" onClick={handleSubmit}>Login</Button>
                <Button onClick={handleRegister} style={{ marginLeft: '200px' }} className='bg-info'>Register Now</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div >
    </>
  )
}
