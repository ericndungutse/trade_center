import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    sector: {
      type: String,
      enum: ['manufacturing', 'finance', 'technology'],
      required: true,
      lowercase: true,
    },

    companyLogo: {
      type: String,
    },

    location: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      // Array of coordinates, Longitude First, latitude last
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    versionKey: false,
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
