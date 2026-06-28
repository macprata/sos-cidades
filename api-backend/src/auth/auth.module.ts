import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importe o módulo
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // ISSO É CRUCIAL: Conecta o Auth com o Users
    JwtModule.register({
      global: true,
      secret: 'SOS_CIDADES_SECRET_KEY_2026',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
