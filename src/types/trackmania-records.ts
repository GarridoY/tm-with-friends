export interface TrackmaniaRecord {
    accountId: string;
    filename: string;
    gameMode: string;
    gameModeCustomData: string;
    mapId: string;
    mapRecordId: string;
    medal: number; // Consider using an enum for medal types (e.g., BronzeMedal, SilverMedal, GoldMedal)
    recordScore: {
        respawnCount: number;
        score: number;
        time: number;
    };
    removed: boolean;
    scopeId: string | null; // Allow null for scopeId
    scopeType: string;
    timestamp: string;
    url: string;
}

export interface TrackmaniaRecordExtended extends TrackmaniaRecord {
    displayName: string
}