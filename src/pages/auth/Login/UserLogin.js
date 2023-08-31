import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { auth } from '../../../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const initState = { email: '', password: '' }

export default function UserLogin() {
	const [state, setState] = useState(initState);

	const navigate = useNavigate()

	const handleChange = (e) => {
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}
	const handleSubmit = () => {
		const { email, password } = state;

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log("user Successfully Sign in", user);
				navigate('/Home');
			})
			.catch((error) => {
				console.error("user Credential Error", error);
			});
	}


	return (
		<>
			<div className="m-0" style={{ backgroundColor: '#0088cc', overflow: "hidden" }}>
				<div className="row d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
					<Form
						name="basic"
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						style={{ maxWidth: 600 }}
						initialValues={{ remember: true }}
					>
						<Form.Item
							label="Email"
							name="email"
							rules={[{ required: true, message: 'Please input your userEmail!' }]}
						>
							<Input name="email" onChange={handleChange} />
						</Form.Item>
						<Form.Item
							label="Password"
							name="password"
							rules={[{ required: true, message: 'Please input your password!' }]}
						>
							<Input.Password name="password" onChange={handleChange} />
						</Form.Item>
						<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>
						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" onClick={handleSubmit}>Submit</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	)
}
