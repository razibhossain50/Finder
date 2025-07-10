import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend application
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Create super admin if not exists
  const authService = app.get(AuthService);
  await authService.createSuperAdmin();
  
  await app.listen(2000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();