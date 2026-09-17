export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} לא נמצא`, 404, "NOT_FOUND");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "אין הרשאה לפעולה הזו") {
    super(message, 403, "FORBIDDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "יש להתחבר כדי להמשיך") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "הנתונים שהוזנו אינם תקינים",
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message = "יש התנגשות עם מידע קיים - נדרשת הכרעה") {
    super(message, 409, "CONFLICT");
  }
}

export class PausedError extends AppError {
  constructor() {
    super("המערכת במצב השהיה זמנית - פעולות חיצוניות חסומות", 503, "PAUSED");
  }
}
