import { z } from "zod";

export const MapUploaderSchema = z.looseObject({
    Name: z.string(),
});

export const MapSearchResultSchema = z.looseObject({
    OnlineMapId: z.string(),
    MapId: z.number(),
    Uploader: MapUploaderSchema,
    Name: z.string(),
});

export const MapSearchResponseSchema = z.looseObject({
    More: z.boolean(),
    Results: z.array(MapSearchResultSchema),
});

export type MapUploader = z.infer<typeof MapUploaderSchema>;
export type MapSearchResult = z.infer<typeof MapSearchResultSchema>;
export type MapSearchResponse = z.infer<typeof MapSearchResponseSchema>;
