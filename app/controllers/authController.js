'use strict'
const UserModel = require('../models/user')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const _const = require('../config/constant');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PasswordResetTokenModel = require('../models/passwordResetTokenSchema');

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const checkEmailExist = await UserModel.findOne({ email: req.body.email });
            if (checkEmailExist) return res.status(200).json('Email is exist');

            const newUser = await new UserModel({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                phone: req.body.phone,
                role : req.body.role,
                status: 'noactive'
            });

            const user = await newUser.save();
           // Send verification email
           const token = jwt.sign({ user: user._id }, _const.JWT_ACCESS_KEY, { expiresIn: '1h' });

           const transporter = nodemailer.createTransport({
               host: 'smtp-relay.brevo.com',
               port: '587',
               auth: {
                   user: 'h5studiogl@gmail.com',
                   pass: 'fScdnZ4WmEDqjBA1',
               },
           });

           const mailOptions = {
               from: 'coms@gmail.com',
               to: user.email,
               subject: 'Account Verification',
               text: `Please verify your account by clicking the following link: http://localhost:3500/activate/${token}`,
           };

           transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                   console.error(error);
                   return res.status(500).json({ message: 'Failed to send verification email!', status: false });
               }
               console.log(`Email sent: ${info.response}`);
               res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.', status: true });
           });

        } catch (err) {
            res.status(500).json("Register fails");
        }
    },

    activateUser: async (req, res) => {
        try {
            const token = req.params.token;
            const decoded = jwt.verify(token, _const.JWT_ACCESS_KEY);
            const userId = decoded.user;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'Invalid token!', status: false });
            }

            user.status = 'actived';
            await user.save();

            res.status(200).json({ message: 'Account activated successfully!', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({message: "Unregistered account!", status: false});
            }

            // const validatePassword = await bcrypt.compareSync(req.body.password, user.password);
            const validatePassword = true;

            if (!validatePassword) {
                res.status(400).json({message: "wrong password!", status: false});
            }
            if (user && validatePassword) {
                const token = jwt.sign({ user: user }, _const.JWT_ACCESS_KEY, { expiresIn: 10000000 });
                res.header('Authorization', token);
                res.status(200).json({ user, token, status: true });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const token = crypto.randomBytes(20).toString('hex');
            const { email } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Unregistered account!', status: false });
            }

            const expiresAt = new Date(Date.now() + 3600000); // Thời gian hết hạn sau 1 giờ

            const tokenDocument = new PasswordResetTokenModel({
                userId: user._id,
                token,
                expiresAt
            });
            await tokenDocument.save();

            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'fScdnZ4WmEDqjBA1',
                },
            });

            const mailOptions = {
                from: 'coms@gmail.com',
                to: user.email,
                subject: 'Reset Password',
                text: `To reset your password, click on the following link: http://localhost:3500/reset-password/${token}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Failed to send reset email!', status: false });
                }
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({ message: 'Reset email sent!', status: true });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    resetPassword: async (req, res) => {
        try {
            const token = req.body.token;

            // Tìm mã xác thực trong cơ sở dữ liệu
            const resetToken = await PasswordResetTokenModel.findOne({ token });
            if (!resetToken || resetToken.expiresAt < new Date()) {
                return res.status(400).json({ message: 'Invalid or expired token!', status: false });
            }

            // Cập nhật mật khẩu cho người dùng
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

            await UserModel.updateOne({ _id: resetToken.userId }, { password: hashedPassword });

            // Xóa mã xác thực đã sử dụng
            await PasswordResetTokenModel.deleteOne({ token });

            res.status(200).json({ message: 'Password reset successful!', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
}

module.exports = authController;
