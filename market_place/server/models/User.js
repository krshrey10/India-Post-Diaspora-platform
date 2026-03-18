import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['buyer', 'seller', 'admin'], 
    default: 'buyer' 
  },
  profile: {
    firstName: { 
      type: String, 
      required: true,
      trim: true
    },
    lastName: { 
      type: String, 
      required: true,
      trim: true
    },
    phone: { 
      type: String,
      trim: true
    },
    gender: { 
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    dateOfBirth: { 
      type: Date 
    }
  },
  businessDetails: {
    businessName: { 
      type: String,
      trim: true
    },
    businessType: { 
      type: String,
      enum: ['individual', 'partnership', 'private-limited', 'llp', 'huf', 'proprietorship']
    },
    taxId: { 
      type: String,
      trim: true
    },
    establishmentDate: { 
      type: Date 
    },
    businessLicense: { 
      type: String // File path or URL
    },
    businessAddress: {
      street: { 
        type: String,
        trim: true
      },
      city: { 
        type: String,
        trim: true
      },
      state: { 
        type: String,
        trim: true
      },
      zipCode: { 
        type: String,
        trim: true
      },
      country: { 
        type: String, 
        default: 'India',
        trim: true
      }
    },
    annualTurnover: { 
      type: Number 
    },
    website: { 
      type: String,
      trim: true
    },
    description: { 
      type: String,
      trim: true
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationDate: { 
      type: Date 
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  phoneVerified: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Add index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'businessDetails.isVerified': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Method to check if user is seller and verified
userSchema.methods.isSellerVerified = function() {
  return this.role === 'seller' && this.businessDetails.isVerified === true;
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.__v;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;