import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { Account } from '../schemas/account.schema'

@Exclude()
export class AccountResponseDto {
  @Expose()
  @ApiProperty({ example: '605e3f5f4f3e8c1d4c9f1e1a' })
  _id: string

  @Expose()
  @ApiProperty({ example: 'Trần Văn C' })
  name: string

  @Expose()
  @ApiProperty({ example: 'vanc@example.com' })
  email: string

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean

  @Expose()
  @ApiProperty({ example: 0 })
  point: number

  @Expose()
  @ApiProperty({ example: '0987654321' })
  phone_number: string

  constructor(partial: Partial<Account & { _id?: string }>) {
    this._id = partial._id ? partial._id.toString() : ''
    this.name = partial.name ?? ''
    this.email = partial.email ?? ''
    this.isActive = partial.isActive ?? true
    this.point = partial.point ?? 0
    this.phone_number = partial.phone_number ?? ''
  }
}
