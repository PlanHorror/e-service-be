# GitHub Copilot Instructions

## Project Overview
This is a NestJS backend project using:
- NestJS framework with TypeScript
- Prisma ORM for PostgreSQL database
- JWT for authentication and authorization
- Multer for file uploads
- Swagger for API documentation
- Bcrypt for password hashing
- Cron for scheduled tasks

Follow the project structure and coding guidelines below when generating code.

---

## Project Structure
When creating new files, always place them inside src following this layout:

src/
  auth/                      # Authentication module: login, register, JWT guards
    auth.service.ts
    auth.controller.ts
    dto/
    guards/

  account/                   # User account management
    account.service.ts
    account.controller.ts
    dto/

  proposal/                  # Proposal-related modules
    proposal-type/           # Proposal types
      proposal-type.service.ts
      proposal-type.controller.ts
      dto/
    activity/                # Activities linked to proposal types
      activity.service.ts
      activity.controller.ts
      dto/
    document-template/       # Document templates for activities
      document-template.service.ts
      document-template.controller.ts
      dto/
    document/                # Proposal documents
    review/                  # Proposal reviews

  common/                    # Shared utilities, constants, file handling
    utils/
    decorators/
    interfaces/

  cron/                      # Scheduled jobs (e.g., file cleanup)

  prisma.service.ts          # Prisma database service
  main.ts                    # Application entry point
  app.module.ts              # Root module

prisma/                      # Prisma schema and migrations
  schema.prisma

attachments/                 # Uploaded files storage

test/                        # End-to-end tests

---

## Coding Conventions
- Always use **TypeScript** (`.ts` files).
- Use **Prisma** for database operations (queries, migrations).
- Use **DTOs** for input validation with class-validator and class-transformer.
- Services must handle business logic; controllers handle HTTP requests/responses.
- Use **Swagger decorators** (@ApiTags, @ApiOperation) for API documentation.
- File uploads use **Multer**; store files in attachments with unique names.
- Authentication uses **JWT**; protect routes with guards.
- Use **transactions** for multi-step operations (e.g., creating activity with templates).
- Keep utilities in `common/`; avoid duplicating code.
- Use absolute imports if configured (e.g., from src).
- Modules must export services/controllers for dependency injection.
- Error handling: Use NestJS exceptions (e.g., NotFoundException, BadRequestException).
- Naming: `PascalCase` for classes, `camelCase` for methods/properties, `kebab-case` for files.

---

## Output Format for Copilot
**Every time you generate code, you MUST:**
1. Clearly state the **full file path** where this code should be placed (relative to project root).
2. Provide only the code for that file in a fenced code block.
3. If multiple files are needed, list them in order with separate headings and fenced code blocks for each.
4. Do not include explanations outside of code unless explicitly asked.
5. Always follow the project folder structure when deciding file location.

**Example Output:**
File: "src/proposal/activity/activity.service.ts"
```typescript
// your code here
```
File: "src/common/utils/file.utils.ts"
```typescript
// your code here
```

## Additional Notes
- Use Prisma schema for database models; run migrations after changes.
- Validate DTOs with decorators (e.g., @IsNotEmpty, @IsUUID).
- For file handling, use utilities like `saveFile`, `deleteFile` from `common/`.
- Keep services stateless; inject dependencies via constructor.
- Test with Jest for unit tests; use e2e for integration.
- Always add TypeScript types for parameters, returns, and Prisma models.