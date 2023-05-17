import emailjs from '@emailjs/browser';
import {
	getDoc,
	collection,
	doc,
	setDoc,
	updateDoc,
} from '@firebase/firestore';
import { fireStore } from '../../config';
import { errorMessage } from '../../utils';
const usersRef = collection(fireStore, 'users');
export const userService = {
	loginOrSignUp: async ({ email, password }) => {
		const otp = userService.generateUniqueOTP();
		await userService.sendEmail(email, otp);
		const userData = await userService.checkUserExistOrGet(email);
		if (!userData) {
			await setDoc(doc(usersRef, email), {
				email,
				password,
				otp,
				isOtpUsed: false,
			});
		} else {
			if (userData.email === email && userData.password === password) {
				await userService.updateData(email, { otp: otp, isOtpUsed: false });
			} else {
				throw new Error(errorMessage.invalidCredential);
			}
		}
	},
	sendEmail: async (to, otp) => {
		try {
			const res = await emailjs.send(
				process.env.REACT_APP_EMAILJS_SERVICE_ID ?? '',
				process.env.REACT_APP_EMAILJS_TEMPLATE_ID ?? '',
				{
					from:
						process.env.REACT_APP_OWNER_EMAIL ??
						'afaq.ahmad.developer@gmail.com',
					otp,
					to,
				},
				process.env.REACT_APP_EMAILJS_PUBLIC_KEY ?? ''
			);
			return res;
		} catch (err) {
			console.log('error sending email', err);
		}
	},
	generateUniqueOTP: () => {
		// Create an array of digits from 0 to 9
		const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

		// Generate a random number from 0 to 9999
		let randomNumber = Math.floor(Math.random() * 10000);

		// Convert the random number to a string
		let otp = randomNumber.toString();

		// Check if the OTP is unique
		while (digits.includes(otp)) {
			randomNumber = Math.floor(Math.random() * 10000);
			otp = randomNumber.toString();
		}

		// Return the unique OTP
		return otp;
	},
	checkUserExistOrGet: async (email) => {
		try {
			const docRef = await doc(fireStore, 'users', email);
			const userDoc = await getDoc(docRef);
			return userDoc.data();
		} catch (err) {
			console.log('error: ' + err);
		}
	},
	verifyOtp: async (email, otp) => {
		const data = await userService.checkUserExistOrGet(email);
		if (data) {
			if (data.otp !== otp) {
				throw Error(errorMessage.wrongOtp);
			} else if (data.otp === otp && data.isOtpUsed) {
				throw Error(errorMessage.otpAlreadyUse);
			} else if (data.otp === otp && !data.isOtpUsed) {
				await userService.updateData(email, { isOtpUsed: true });
				return errorMessage.successOtp;
			}
		}
	},
	updateData: async (email, data) => {
		const docRef = await doc(fireStore, 'users', email);
		await updateDoc(docRef, data);
		return;
	},
};
