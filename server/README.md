# Server

Backend folder for the chat application.

Planned architecture:

```txt
Route -> Controller -> Service -> Repository -> MongoDB
```

Main folders:

- `src/config`: database and environment configuration
- `src/controllers`: request and response handling
- `src/services`: business logic
- `src/repositories`: database access helpers
- `src/routes`: Express route definitions
- `src/middlewares`: auth, validation, and error middleware
- `src/models`: Mongoose schemas
- `src/sockets`: Socket.IO events
- `src/utils`: reusable helpers
- `src/validators`: request validation rules
- `src/constants`: shared constants
- `src/helpers`: small support functions
- `src/events`: event name definitions
