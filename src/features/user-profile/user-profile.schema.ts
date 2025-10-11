import z from "zod";

export const ProfileListSchema = z.object({
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export type ProfileListSchemaType = z.infer<typeof ProfileListSchema>;

export const ProfileParamsSchema = z.object({
  id: z.cuid2(),
});
export type ProfileParamsSchemaType = z.infer<typeof ProfileParamsSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100),
});

export const CreateProfileSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
});
export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;
export type CreateProfileSchemaType = z.infer<typeof CreateProfileSchema>;
