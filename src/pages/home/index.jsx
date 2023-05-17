import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, notification } from 'antd';
import { userService } from '../../services';

export const HomePage = () => {
	const [api, contextHolder] = notification.useNotification();
	const [busy, setBusy] = useState(false);
	const [verify, setVerify] = useState(false);
	const [email, setEmail] = useState('');
	const onLoginFinish = async (values) => {
		setBusy(true);
		try {
			await userService.loginOrSignUp(values);
			setEmail(values.email);
			setVerify(true);
			api.success({
				message: 'Email Sent!',
				description: 'Email has been sent to ' + values.email,
				placement: 'topRight',
			});
		} catch (err) {
			console.log('error:', err);
		}
		setBusy(false);
	};
	const onOtpFinish = async (values) => {
		setBusy(true);
		try {
			let otp = '';
			otp += values.otp1.toString();
			otp += values.otp2.toString();
			otp += values.otp3.toString();
			otp += values.otp4.toString();
			const res = await userService.verifyOtp(email, otp);
			api.success({
				message: 'Email Verification!',
				description: res,
				placement: 'topRight',
			});
			setVerify(false);
		} catch (err) {
			api.error({
				message: 'Email Verification!',
				description: err.message,
				placement: 'topRight',
			});
		}
		setBusy(false);
	};
	return (
		<div
			style={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: 'auto',
			}}
		>
			{contextHolder}
			{!verify && (
				<Form
					name="basic"
					labelCol={{
						span: 10,
					}}
					// wrapperCol={{
					// 	span: 16,
					// }}
					style={{
						maxWidth: 600,
					}}
					initialValues={{
						email: 'afaqahmad.se@gmail.com',
						password: '12345',
					}}
					onFinish={onLoginFinish}
					onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}
					autoComplete="off"
				>
					<Form.Item
						label="Email Address"
						name="email"
						rules={[
							{
								type: 'email',
							},
							{
								required: true,
								message: 'Please input your email!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: 'Please input your password!',
							},
							{
								min: 5,
								message: 'Minimum 5 characters for password!',
							},
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16,
						}}
					>
						<Button
							type="primary"
							htmlType="submit"
							loading={busy}
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			)}
			{verify && (
				<Form
					name="horizontal_login"
					layout="inline"
					onFinish={onOtpFinish}
				>
					<Form.Item
						name="otp1"
						rules={[
							{
								required: true,
								message: 'required!',
							},
						]}
					>
						<InputNumber />
					</Form.Item>
					<Form.Item
						name="otp2"
						rules={[
							{
								required: true,
								message: 'required!',
							},
						]}
					>
						<InputNumber />
					</Form.Item>
					<Form.Item
						name="otp3"
						rules={[
							{
								required: true,
								message: 'required!',
							},
						]}
					>
						<InputNumber />
					</Form.Item>
					<Form.Item
						name="otp4"
						rules={[
							{
								required: true,
								message: 'required!',
							},
						]}
					>
						<InputNumber />
					</Form.Item>
					<Form.Item shouldUpdate>
						{() => (
							<Button
								type="primary"
								htmlType="submit"
								loading={busy}
							>
								Verify
							</Button>
						)}
					</Form.Item>
				</Form>
			)}
		</div>
	);
};
