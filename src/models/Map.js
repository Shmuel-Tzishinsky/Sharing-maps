import mongoose from "mongoose";

const MarkerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  position: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  description: String,
  address: String,
  image: String,
  id: Number,
});

const DataSchema = new mongoose.Schema({
  background: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  markers: [MarkerSchema],
});

const MapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  data: [DataSchema],
});

export default mongoose.models.Map || mongoose.model("Map", MapSchema);
