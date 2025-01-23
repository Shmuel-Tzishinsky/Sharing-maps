import mongoose from "mongoose";

const MapSchema = new mongoose.Schema({
  mapName: {
    type: String,
    required: true,
  },
  geojson: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Map || mongoose.model("Map", MapSchema);
