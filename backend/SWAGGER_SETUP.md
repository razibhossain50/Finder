# Swagger API Documentation Setup

This document explains the Swagger/OpenAPI documentation setup for the backend API.

## What's Been Configured

### 1. Dependencies Installed
- `@nestjs/swagger` - NestJS Swagger module
- `swagger-ui-express` - Swagger UI for Express

### 2. Main Configuration (main.ts)
- Swagger document builder with JWT authentication support
- API documentation available at `/api/docs`
- Bearer token authentication configured
- Persistent authorization in Swagger UI

### 3. Controller Documentation
- Added `@ApiTags()` for grouping endpoints
- Added `@ApiOperation()` for endpoint descriptions
- Added `@ApiResponse()` for response documentation
- Added `@ApiBody()` for request body documentation
- Added `@ApiBearerAuth()` for protected endpoints

### 4. DTO Documentation
- Added `@ApiProperty()` for required fields
- Added `@ApiPropertyOptional()` for optional fields
- Included examples, descriptions, and validation rules

## Accessing the Documentation

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3001/api/docs
   ```

## Using the Swagger UI

### Authentication
1. Click the "Authorize" button in the top right
2. Enter your JWT token in the format: `Bearer your-jwt-token-here`
3. Click "Authorize" to apply the token to all protected endpoints

### Testing Endpoints
1. Click on any endpoint to expand it
2. Click "Try it out" to enable the form
3. Fill in the required parameters
4. Click "Execute" to make the request
5. View the response below

## Adding Documentation to New Controllers

### Basic Controller Setup
```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Your Module Name')
@Controller('your-route')
export class YourController {
  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of items' })
  findAll() {
    // Your implementation
  }
}
```

### Protected Endpoints
```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@Post()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Create new item' })
@ApiResponse({ status: 201, description: 'Item created successfully' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
createItem() {
  // Your implementation
}
```

### DTO Documentation
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Sample Item',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description',
    example: 'This is a sample item',
  })
  description?: string;
}
```

## Best Practices

1. **Use Descriptive Summaries**: Make `@ApiOperation` summaries clear and concise
2. **Document All Responses**: Include both success and error responses
3. **Provide Examples**: Use realistic examples in `@ApiProperty`
4. **Group Related Endpoints**: Use `@ApiTags` to organize endpoints logically
5. **Document Authentication**: Use `@ApiBearerAuth` for protected routes
6. **Keep It Updated**: Update documentation when you change endpoints

## Common Decorators

- `@ApiTags('tag-name')` - Groups endpoints under a tag
- `@ApiOperation({ summary: 'Description' })` - Describes the endpoint
- `@ApiResponse({ status: 200, description: 'Success' })` - Documents responses
- `@ApiBody({ type: DtoClass })` - Documents request body
- `@ApiParam({ name: 'id', description: 'Item ID' })` - Documents path parameters
- `@ApiQuery({ name: 'search', required: false })` - Documents query parameters
- `@ApiBearerAuth('JWT-auth')` - Requires JWT authentication
- `@ApiExcludeEndpoint()` - Excludes endpoint from documentation

## Environment Variables

The Swagger setup uses these environment variables:
- `BE_PORT` or `PORT` - Backend server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Next Steps

1. Add documentation to all your existing controllers
2. Create response DTOs for better documentation
3. Add validation decorators to all DTOs
4. Consider adding API versioning if needed
5. Set up automated API documentation generation in CI/CD