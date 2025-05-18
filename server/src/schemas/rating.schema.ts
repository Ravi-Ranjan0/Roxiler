import { z } from 'zod';

export const ratingSchema = z.object({
    rating: z
        .number()
        .min(
            1,
            {
                message: "Rating must be at least 1",
            }
        )
        .max(
            5,
            {
                message: "Rating must be at most 5",
            }
        ),
});

export default ratingSchema;