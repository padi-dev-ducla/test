const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa mô hình PasswordResetTokenModel
const passwordResetTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Tạo và xuất mô hình PasswordResetTokenModel
const PasswordResetTokenModel = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

module.exports = PasswordResetTokenModel;