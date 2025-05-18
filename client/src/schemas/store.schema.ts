import { z } from 'zod';

const storeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, {
            message: "Name must be at least 1 character long",
        }),
    address: z
        .string()
        .max(400,
            {
                message: "Address must be at most 400 characters long",
            }
        ),
});

export default storeSchema;