import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  // Put,
  HttpCode,
  HttpStatus,
  Inject, // <-- Thêm Inject
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'

import { IAccountsService } from './interfaces/iaccount.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { AccountResponseDto } from './dto/account-response.dto'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto'
import { ApiResponseDto } from 'src/common/dto/api-response.dto'
@ApiTags('accounts')
@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountsController {
  // Inject Service bằng Interface Token
  constructor(
    @Inject(IAccountsService)
    private readonly accountsService: IAccountsService, // <-- Thay đổi cách inject
  ) {}

  // Các phương thức xử lý route giữ nguyên, chúng chỉ gọi AccountsService đã inject

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ApiResponseDto<AccountResponseDto>,
  })
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<ApiResponseDto<AccountResponseDto>> {
    const newAccountData: AccountResponseDto =
      await this.accountsService.createAccount(createAccountDto)
    return new ApiResponseDto<AccountResponseDto>({
      data: [newAccountData],
      success: true,
      message: 'Tài khoản được tạo thành công',
      statusCode: HttpStatus.CREATED,
    })
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Số lượng mục trên mỗi trang (mặc định: -1)',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    type: Number,
    description: 'Số trang (mặc định: -1)',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tài khoản.',
    type: PaginatedResponseDto<AccountResponseDto>,
  }) // Cập nhật Swagger response
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true, // Kích hoạt transform để Type() hoạt động
        transformOptions: { enableImplicitConversion: true }, // Cho phép chuyển đổi ngầm định
        forbidNonWhitelisted: true,
      }),
    ) // Loại bỏ các thuộc tính không có trong DTO
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<AccountResponseDto>> {
    // Sử dụng DTO hoặc Interface
    const { pageNumber, pageSize } = paginationQuery

    // Call the service method to fetch paginated accounts
    const accounts = await this.accountsService.findAllAccounts(
      pageNumber ? pageNumber : 1,
      pageSize ? pageSize : 10,
    )

    // Return the response directly without redundant mapping
    return {
      ...accounts,
      data: accounts.data.map((account) => new AccountResponseDto(account)),
      success: true,
      message: 'Lấy danh sách tài khoản thành công',
      statusCode: HttpStatus.OK,
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ApiResponseDto<AccountResponseDto>,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<AccountResponseDto>> {
    const dataAccount = await this.accountsService.findAccountById(id)
    return {
      data: [dataAccount],
      message: 'Lấy thông tin tài khoản thành công',
      success: true,
      statusCode: HttpStatus.OK,
    }
  }

  // @Put(':id')
  // @ApiOperation({ summary: 'Cập nhật thông tin người dùng (With Interface)' })
  // @ApiParam({ name: 'id', type: String })
  // @ApiBody({ type: UpdateUserDto })
  // @ApiResponse({ status: HttpStatus.OK, type: AccountResponseDto })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND })
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<AccountResponseDto> {
  //   return this.AccountsService.updateUser(id, updateUserDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Xóa tài khoản thành công.',
  }) // Giữ lại cái này
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy tài khoản.',
  }) // Giữ lại cái này
  // Xóa @ApiResponse({ type: AccountResponseDto })
  @HttpCode(HttpStatus.NO_CONTENT) // Giữ lại cái này để đảm bảo trả về 204
  async remove(@Param('id') id: string): Promise<void> {
    // <-- Sửa Promise<void>
    await this.accountsService.deleteAccount(id) // Chỉ cần gọi service
    // Không cần return gì cả, hoặc return;
  }
}
