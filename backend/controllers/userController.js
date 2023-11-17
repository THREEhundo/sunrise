import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc	Auth user/set token
// route 	POST /api/users/auth
// @access	Public

const authUser = asyncHandler(async (req, res) => {
	// get email & password from body
	const { email, password } = req.body
	// check to see if a current user has that email address
	const user = await User.findOne({ email })

	// matchPassword is method on userSchema
	if (user && (await user.matchPasswords(password))) {
		generateToken(res, user._id)
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(400)
		throw new Error('Invalid email or password.')
	}
})

// @desc	Register a new user
// route 	POST /api/users
// @access	Public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body

	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await User.create({
		name,
		email,
		password
	})

	if (user) {
		generateToken(res, user._id)
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc	Logout user
// route 	POST /api/users/logout
// @access	Public

const logoutUser = asyncHandler(async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0)
	})
	res.status(200).json({ message: 'User logged out.' })
})

// @desc	Get user profile
// route 	GET /api/users/profile
// @access	Private

const getUserProfile = asyncHandler(async (req, res) => {
	res.status(200).json({ message: 'User Profile' })
})

// @desc	Update user profile
// route 	PUT /api/users/profile
// @access	Private

const updateUserProfile = asyncHandler(async (req, res) => {
	res.status(200).json({ message: 'Update user profile' })
})
export { authUser, logoutUser, registerUser, getUserProfile, updateUserProfile }
