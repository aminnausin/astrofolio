import { defineCollection, z } from "astro:content";

const experiences = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        company: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        location: z.string(),
        skills: z.array(z.string()).optional(),
        snapshot: z.string().optional(),
        description: z.array(z.string()).optional(),
        forceDescription: z.boolean().optional(),
    }),
});

const projects = defineCollection({
    type: "data",
    schema: z.object({
        order: z.number().nonnegative().default(Infinity),
        title: z.string(),
        date: z.string(),
        tech: z.array(z.string()),
        snapshot: z.string().optional(),
        description: z.array(z.string()).optional(),
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
        link: z.string().url().optional(),
        picture: z.string().optional(),
    }),
});

const education = defineCollection({
    type: "data",
    schema: z.object({
        degree: z.string(),
        school: z.string(),
        location: z.string(),
        dates: z.string(),
        description: z.array(z.string()).optional(),
    }),
});

const skills = defineCollection({
    type: "data",
    schema: z.record(z.array(z.string())),
});

export const collections = {
    projects,
    experiences,
    education,
    skills,
};
