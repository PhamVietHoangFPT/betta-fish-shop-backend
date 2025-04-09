import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import mongoose from 'mongoose'
export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: string

  @Prop({ required: true, trim: true })
  name: string

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string

  @Prop({ required: true, select: false })
  password: string

  @Prop({ default: 0 })
  point: number

  @Prop({ default: null })
  phone_number: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: mongoose.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' })
  facility: mongoose.Types.ObjectId
}

export const AccountSchema = SchemaFactory.createForClass(Account)
