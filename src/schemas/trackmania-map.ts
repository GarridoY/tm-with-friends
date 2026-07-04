import { z } from "zod";

export const TrackmaniaMapSchema = z.looseObject({
    author: z.string(),
    authorScore: z.number(),
    bronzeScore: z.number(),
    collectionName: z.string(),
    createdByGamepadEditor: z.boolean().optional(),
    createdBySimpleEditor: z.boolean().optional(),
    filename: z.string(),
    goldScore: z.number(),
    isPlayable: z.boolean(),
    mapId: z.string(),
    mapStyle: z.string(),
    mapType: z.string(),
    mapUid: z.string(),
    name: z.string(),
    silverScore: z.number(),
    submitter: z.string(),
    timestamp: z.string(),
    fileUrl: z.string(),
    thumbnailUrl: z.string(),
});

export type TrackmaniaMap = z.infer<typeof TrackmaniaMapSchema>;
