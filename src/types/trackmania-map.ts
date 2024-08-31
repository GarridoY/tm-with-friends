export interface TrackmaniaMap {
    author: string;
    authorScore: number;
    bronzeScore: number;
    collectionName: string;
    createdByGamepadEditor: boolean;
    createdBySimpleEditor: boolean;
    filename: string;
    goldScore: number;
    isPlayable: boolean;
    mapId: string;
    mapStyle: string;
    mapType: string; // Consider using a more specific type for mapType (e.g., enum)
    mapUid: string;
    name: string;
    silverScore: number;
    submitter: string;
    timestamp: string; // Consider using a Date type
    fileUrl: string;
    thumbnailUrl: string;
}