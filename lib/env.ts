function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`חסר משתנה סביבה נדרש: ${name}`);
  }
  return value;
}

export const env = {
  sessionSecret: () => required("SESSION_SECRET"),
  isPaused: () => process.env.APP_PAUSED === "true",
};
