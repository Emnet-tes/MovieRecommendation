import { Request, Response } from "express";
import Mood from "../models/Mood";

export const getAllMoods = async (_req: Request, res: Response) => {
  try {
    const moods = await Mood.find();
    res.status(200).json({
      moods: moods.map((m) => m.name),
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
