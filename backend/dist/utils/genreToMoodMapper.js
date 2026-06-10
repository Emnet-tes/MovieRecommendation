"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGenresToMoodIds = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MoodSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    genreIds: [Number],
});
const Mood = mongoose_1.default.models.Mood || mongoose_1.default.model("Mood", MoodSchema);
// genre ID → mood name
const genreToMood = {
    28: "excited", // Action
    12: "excited", // Adventure
    16: "nostalgic", // Animation
    35: "happy", // Comedy
    80: "scared", // Crime
    99: "relaxed", // Documentary
    18: "sad", // Drama
    10751: "happy", // Family
    14: "excited", // Fantasy
    36: "nostalgic", // History
    27: "scared", // Horror
    10402: "happy", // Music
    9648: "scared", // Mystery
    10749: "romantic", // Romance
    878: "excited", // Sci-Fi
    10770: "relaxed", // TV Movie
    53: "scared", // Thriller
    10752: "sad", // War
    37: "nostalgic", // Western
};
const mapGenresToMoodIds = async (genreIds) => {
    const moods = await Mood.find({});
    const moodIds = new Set();
    for (const genreId of genreIds) {
        const moodName = genreToMood[genreId];
        if (!moodName)
            continue;
        const mood = moods.find((m) => m.name.toLowerCase() === moodName);
        if (mood)
            moodIds.add(mood._id.toString());
    }
    return Array.from(moodIds);
};
exports.mapGenresToMoodIds = mapGenresToMoodIds;
