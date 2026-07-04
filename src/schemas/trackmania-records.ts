import { z } from "zod";

export const RecordScoreSchema = z.looseObject({
    respawnCount: z.number(),
    score: z.number(),
    time: z.number(),
});

export const TrackmaniaRecordSchema = z.looseObject({
    accountId: z.string(),
    filename: z.string(),
    gameMode: z.string(),
    gameModeCustomData: z.string(),
    mapId: z.string(),
    mapRecordId: z.string(),
    medal: z.number(),
    recordScore: RecordScoreSchema,
    removed: z.boolean(),
    scopeId: z.string().nullable(),
    scopeType: z.string(),
    timestamp: z.string(),
    url: z.string(),
});

export const TrackmaniaRecordExtendedSchema = TrackmaniaRecordSchema.extend({
    displayName: z.string(),
});

export type RecordScore = z.infer<typeof RecordScoreSchema>;
export type TrackmaniaRecord = z.infer<typeof TrackmaniaRecordSchema>;
export type TrackmaniaRecordExtended = z.infer<typeof TrackmaniaRecordExtendedSchema>;
