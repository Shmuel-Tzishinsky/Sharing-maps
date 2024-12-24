import mongoose, { Schema } from 'mongoose'

const LocationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  position: { type: [Number], required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  phone: String,
})

export default mongoose.model('Location', LocationSchema)
