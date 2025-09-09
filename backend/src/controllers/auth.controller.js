import userModel from '../models/user.model.js';
import foodPartnerModel from '../models/foodpartner.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ...existing code...

export async function registerUser(req, res) {

    const { fullName, email, password} = req.body; // data from client

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: 'User already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)


    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })

}

export async function loginUser(req, res) {

    const { email, password } = req.body; // data from client

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })

}

export function logoutUser(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: 'User logged out successfully'
    })
}

export async function registerFoodPartner(req, res) {
    const { name, email, password, address, phone, contactName } = req.body; // data from client

    const isAccountExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountExists) {
        return res.status(400).json({
            message: 'Account already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        address,
        phone,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
        
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: 'Food Partner registered successfully',
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName
        }
    })

}

export async function loginFoodPartner(req, res) {
    const { email, password } = req.body; // data from client
    const foodPartner = await foodPartnerModel.findOne({
        email
    })
    if (!foodPartner) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(200).json({
        message: 'Food Partner logged in successfully',
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email
        }
    })

}

export function logoutFoodPartner(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: 'Food Partner logged out successfully'
    })
}

// All functions are exported above as named exports