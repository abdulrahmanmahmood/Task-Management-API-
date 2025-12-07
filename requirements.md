# Task Management API - Project Requirements

## Project Overview
Build a comprehensive Task Management REST API that allows teams to collaborate on projects, manage tasks, and track progress. This project will help you practice NestJS fundamentals, TypeORM relationships, authentication, and advanced backend concepts.

## Tech Stack
- **Backend Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Core Features

### 1. User Management
- User registration with email verification
- User login with JWT authentication
- User profile management (update profile, change password)
- Role-based access control (Admin, Manager, Member)
- User avatar upload (optional: integrate with cloud storage)

### 2. Organization/Workspace Management
- Create organizations/workspaces
- Invite users to organizations via email
- Manage organization members and their roles
- Organization settings and customization

### 3. Project Management
- Create, read, update, delete projects within an organization
- Assign project managers
- Set project deadlines and descriptions
- Archive/unarchive projects
- Project status tracking (Planning, In Progress, Completed, On Hold)

### 4. Task Management
- CRUD operations for tasks
- Task properties:
  - Title, description, priority (Low, Medium, High, Urgent)
  - Status (To Do, In Progress, In Review, Done)
  - Due date and estimated time
  - Tags/labels
  - Attachments (file uploads)
- Assign tasks to multiple users
- Task dependencies (a task can block another task)
- Subtasks support
- Task comments and activity log

### 5. Board/Sprint Management (Agile-style)
- Create boards within projects
- Organize tasks into columns (Kanban-style)
- Create sprints with start and end dates
- Move tasks between columns
- Sprint reports and velocity tracking

### 6. Notifications System
- Real-time notifications for:
  - Task assignments
  - Task status changes
  - Comments and mentions
  - Approaching deadlines
- Email notifications (optional: integrate SendGrid/Mailgun)
- In-app notification center

### 7. Search and Filtering
- Search tasks by title, description, tags
- Filter tasks by:
  - Status, priority, assignee
  - Date range
  - Project, board
- Sort by various criteria

### 8. Analytics and Reports
- User productivity metrics
- Project progress reports
- Task completion statistics
- Overdue tasks dashboard
- Time tracking and estimation accuracy

## Database Schema

### Key Entities and Relationships

**Users**
- id, email, password (hashed), firstName, lastName, avatar, role, createdAt, updatedAt

**Organizations**
- id, name, description, ownerId, createdAt, updatedAt
- Relationships: Many-to-Many with Users (organization members)

**Projects**
- id, name, description, organizationId, status, startDate, endDate, createdAt, updatedAt
- Relationships: Belongs to Organization, Has Many Tasks

**Tasks**
- id, title, description, projectId, status, priority, dueDate, estimatedHours, createdById, createdAt, updatedAt
- Relationships: Belongs to Project, Many-to-Many with Users (assignees), Has Many Comments

**Comments**
- id, content, taskId, userId, createdAt, updatedAt
- Relationships: Belongs to Task and User

**Boards**
- id, name, projectId, createdAt, updatedAt
- Relationships: Belongs to Project, Has Many Columns

**Columns**
- id, name, boardId, position, createdAt, updatedAt

**Tags**
- id, name, color, organizationId
- Relationships: Many-to-Many with Tasks

## Technical Requirements

### API Structure
```
/api/v1
  /auth
    - POST /register
    - POST /login
    - POST /refresh
    - GET /me
  
  /users
    - GET /:id
    - PATCH /:id
    - DELETE /:id
  
  /organizations
    - POST /
    - GET /
    - GET /:id
    - PATCH /:id
    - DELETE /:id
    - POST /:id/invite
    - GET /:id/members
  
  /projects
    - POST /
    - GET /
    - GET /:id
    - PATCH /:id
    - DELETE /:id
    - GET /:id/tasks
  
  /tasks
    - POST /
    - GET /
    - GET /:id
    - PATCH /:id
    - DELETE /:id
    - POST /:id/comments
    - POST /:id/assign
    - GET /search
  
  /boards
    - POST /
    - GET /project/:projectId
    - PATCH /:id
    - DELETE /:id
```

### Validation and Error Handling
- Use DTOs (Data Transfer Objects) for request validation
- Implement global exception filters
- Return consistent error responses with proper HTTP status codes
- Validate all user inputs

### Security
- Hash passwords using bcrypt
- Implement JWT authentication with refresh tokens
- Add guards for protected routes
- Implement rate limiting
- Sanitize user inputs to prevent SQL injection
- Add CORS configuration

### Database Best Practices
- Use migrations for schema changes
- Implement soft deletes for important entities
- Add database indexes for frequently queried fields
- Use transactions for complex operations
- Implement proper cascading rules

### Testing (Bonus)
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical flows
- Mock external dependencies

## Suggested Development Phases

### Phase 1: Foundation & Authentication (Week 1)

**Features to Export:**
1. User Registration
2. User Login with JWT
3. Get Current User Profile
4. Update User Profile
5. Change Password
6. Basic User CRUD

**Database Schema:**
- Users table (id, email, password, firstName, lastName, role, createdAt, updatedAt)

**Endpoints:**
```
POST   /api/v1/auth/register
       Body: { email, password, firstName, lastName }
       Response: { user, accessToken, refreshToken }

POST   /api/v1/auth/login
       Body: { email, password }
       Response: { user, accessToken, refreshToken }

POST   /api/v1/auth/refresh
       Body: { refreshToken }
       Response: { accessToken, refreshToken }

GET    /api/v1/auth/me
       Headers: { Authorization: Bearer <token> }
       Response: { user }

PATCH  /api/v1/auth/profile
       Headers: { Authorization: Bearer <token> }
       Body: { firstName, lastName }
       Response: { user }

PATCH  /api/v1/auth/change-password
       Headers: { Authorization: Bearer <token> }
       Body: { currentPassword, newPassword }
       Response: { message }

GET    /api/v1/users
       Headers: { Authorization: Bearer <token> }
       Query: ?page=1&limit=10&search=john
       Response: { users[], total, page, limit }

GET    /api/v1/users/:id
       Headers: { Authorization: Bearer <token> }
       Response: { user }
```

**Technical Implementation:**
- Set up NestJS project with `nest new project-name`
- Install dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, `class-validator`
- Create AuthModule, UsersModule
- Implement JwtStrategy and AuthGuard
- Create User entity with TypeORM
- Hash passwords with bcrypt
- Implement DTO validation
- Add global exception filter

**Deliverables:**
✅ Users can register and login
✅ JWT tokens are generated and validated
✅ Protected routes require authentication
✅ Passwords are securely hashed
✅ Input validation is working
✅ Error responses are consistent

---

### Phase 2: Core Business Logic (Week 2)

**Features to Export:**
1. Create and Manage Organizations
2. Invite Members to Organizations
3. Create and Manage Projects
4. Create and Manage Tasks
5. Assign Tasks to Users
6. Add Comments to Tasks

**Database Schema:**
- Organizations table
- OrganizationMembers junction table (user_id, organization_id, role)
- Projects table (with organizationId foreign key)
- Tasks table (with projectId, createdById foreign keys)
- TaskAssignees junction table (task_id, user_id)
- Comments table (with taskId, userId foreign keys)

**Endpoints:**

**Organizations:**
```
POST   /api/v1/organizations
       Headers: { Authorization: Bearer <token> }
       Body: { name, description }
       Response: { organization }

GET    /api/v1/organizations
       Headers: { Authorization: Bearer <token> }
       Response: { organizations[] }

GET    /api/v1/organizations/:id
       Headers: { Authorization: Bearer <token> }
       Response: { organization, members[], projects[] }

PATCH  /api/v1/organizations/:id
       Headers: { Authorization: Bearer <token> }
       Body: { name, description }
       Response: { organization }

DELETE /api/v1/organizations/:id
       Headers: { Authorization: Bearer <token> }
       Response: { message }

POST   /api/v1/organizations/:id/members
       Headers: { Authorization: Bearer <token> }
       Body: { userId, role: 'member' | 'manager' }
       Response: { member }

GET    /api/v1/organizations/:id/members
       Headers: { Authorization: Bearer <token> }
       Response: { members[] }

DELETE /api/v1/organizations/:id/members/:userId
       Headers: { Authorization: Bearer <token> }
       Response: { message }
```

**Projects:**
```
POST   /api/v1/projects
       Headers: { Authorization: Bearer <token> }
       Body: { name, description, organizationId, status?, startDate?, endDate? }
       Response: { project }

GET    /api/v1/projects
       Headers: { Authorization: Bearer <token> }
       Query: ?organizationId=1
       Response: { projects[] }

GET    /api/v1/projects/:id
       Headers: { Authorization: Bearer <token> }
       Response: { project, tasks[], taskStats }

PATCH  /api/v1/projects/:id
       Headers: { Authorization: Bearer <token> }
       Body: { name, description, status, startDate, endDate }
       Response: { project }

DELETE /api/v1/projects/:id
       Headers: { Authorization: Bearer <token> }
       Response: { message }
```

**Tasks:**
```
POST   /api/v1/tasks
       Headers: { Authorization: Bearer <token> }
       Body: { 
         title, 
         description, 
         projectId, 
         status?: 'todo' | 'in_progress' | 'in_review' | 'done',
         priority?: 'low' | 'medium' | 'high' | 'urgent',
         dueDate?,
         estimatedHours?,
         assigneeIds?: []
       }
       Response: { task }

GET    /api/v1/tasks
       Headers: { Authorization: Bearer <token> }
       Query: ?projectId=1&status=todo&priority=high&assigneeId=2
       Response: { tasks[] }

GET    /api/v1/tasks/:id
       Headers: { Authorization: Bearer <token> }
       Response: { task, assignees[], comments[] }

PATCH  /api/v1/tasks/:id
       Headers: { Authorization: Bearer <token> }
       Body: { title, description, status, priority, dueDate }
       Response: { task }

DELETE /api/v1/tasks/:id
       Headers: { Authorization: Bearer <token> }
       Response: { message }

POST   /api/v1/tasks/:id/assign
       Headers: { Authorization: Bearer <token> }
       Body: { userIds: [1, 2, 3] }
       Response: { task, assignees[] }

DELETE /api/v1/tasks/:id/assign/:userId
       Headers: { Authorization: Bearer <token> }
       Response: { message }
```

**Comments:**
```
POST   /api/v1/tasks/:taskId/comments
       Headers: { Authorization: Bearer <token> }
       Body: { content }
       Response: { comment }

GET    /api/v1/tasks/:taskId/comments
       Headers: { Authorization: Bearer <token> }
       Response: { comments[] }

PATCH  /api/v1/comments/:id
       Headers: { Authorization: Bearer <token> }
       Body: { content }
       Response: { comment }

DELETE /api/v1/comments/:id
       Headers: { Authorization: Bearer <token> }
       Response: { message }
```

**Technical Implementation:**
- Create OrganizationsModule, ProjectsModule, TasksModule, CommentsModule
- Implement all entities with proper relationships
- Use TypeORM relations: @ManyToOne, @OneToMany, @ManyToMany
- Add Guards for authorization (check if user belongs to organization)
- Implement query builders for filtering tasks
- Add cascade options for delete operations
- Create DTOs for all requests
- Add pagination for list endpoints

**Deliverables:**
✅ Users can create organizations and invite members
✅ Organization members can create projects
✅ Users can create tasks within projects
✅ Tasks can be assigned to multiple users
✅ Users can comment on tasks
✅ Proper authorization (users can only access their organizations)
✅ All relationships working correctly
✅ Filtering and querying working

---

**Summary:**
- **Phase 1** = 8 endpoints (all authentication + user management)
- **Phase 2** = 25 endpoints (organizations, projects, tasks, comments)
- **Total after Phase 2** = 33 working endpoints

After these two phases, you'll have a fully functional task management system!

### Phase 3: Advanced Features (Week 3)
- Implement boards and columns
- Add comments and file uploads
- Create search and filtering
- Add tags and labels

### Phase 4: Polish and Extras (Week 4)
- Implement notifications
- Add analytics endpoints
- Set up Swagger documentation
- Write tests
- Deploy to production (Heroku, Railway, or AWS)

## Bonus Challenges
- Implement WebSocket for real-time updates
- Add activity/audit logs for all entities
- Create a dashboard with task statistics
- Implement task time tracking
- Add recurring tasks feature
- Export data to CSV/PDF
- Integrate with third-party services (Slack, GitHub)
- Add two-factor authentication
- Implement GraphQL API alongside REST

## Learning Outcomes
By completing this project, you'll gain hands-on experience with:
- NestJS modules, controllers, services, and dependency injection
- TypeORM entities, repositories, and query builder
- Complex database relationships (one-to-many, many-to-many)
- JWT authentication and authorization
- File uploads and cloud storage
- Input validation and error handling
- RESTful API design principles
- Database migrations and seeding
- Testing strategies in NestJS

## Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

Good luck with your project! 🚀