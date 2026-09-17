import { z } from "zod";

export const taskStatusSchema = z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE", "DELAYED"]);

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
});
