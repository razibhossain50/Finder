// Import polyfills first
import './polyfills';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from uploads/public directory
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/',
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Temporarily allow unknown properties
      transform: true,
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('API documentation for the backend application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // -----------------------------
  // CORS setup - Production ready
  // -----------------------------
  console.log('Setting up CORS...');
  console.log('FRONTEND_URL env:', process.env.FRONTEND_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  const allowedOrigins = [
    'https://mawami.com',
    'https://www.mawami.com',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  console.log('Allowed origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin',
      'Cache-Control',
      'X-File-Name'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  // Add manual CORS headers as backup
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Create super admin if not exists
  const authService = app.get(AuthService);
  await authService.createSuperAdmin();

  // Use custom port variables with fallbacks
  const port = process.env.BE_PORT || process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}

void bootstrap();
