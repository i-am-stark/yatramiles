const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ['Owner', 'Staff', 'Customer'],
        default: 'Customer',
      },
      isVerified: { type: Boolean, default: false }, // Email verification status
      otp: { type: String }, // OTP sent to the user
      otpExpiresAt: { type: Date }, // Expiration time for the OTP
    },
    { timestamps: true }
  );

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);