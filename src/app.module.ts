import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (): MongooseModuleOptions => {
        try {
          const mongoUri = process.env.MONGO_URI;

          // Kiểm tra nếu mongoUri là undefined hoặc null
          if (!mongoUri) {
            throw new Error(
              'MONGO_URI is not defined in the environment variables',
            );
          }

          return { uri: mongoUri };
        } catch (error: unknown) {
          // Kiểm tra nếu error là instance của Error
          if (error instanceof Error) {
            console.error(
              'Error occurred while setting up MongoDB connection:',
              error.message,
            );
          } else {
            console.error(
              'An unknown error occurred while setting up MongoDB connection',
            );
          }
          throw error; // Ném lại lỗi sau khi đã xử lý
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
