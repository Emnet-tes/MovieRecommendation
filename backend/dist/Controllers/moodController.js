"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMoods = void 0;
const Mood_1 = __importDefault(require("../models/Mood"));
const getAllMoods = async (_req, res) => {
    try {
        const moods = await Mood_1.default.find();
        res.status(200).json({
            moods: moods.map((m) => m.name),
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllMoods = getAllMoods;
