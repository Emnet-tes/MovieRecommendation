import { Router } from "express";
import Mood from "../Models/Mood";

const router = Router();

const getAllMoods = async (_req: any, res: any) => {
	try {
		const moods = await Mood.find();
		res.status(200).json({
			moods: moods.map((m) => m.name),
		});
	} catch (err) {
		res.status(500).json({ message: (err as Error).message });
	}
};

router.get("/", getAllMoods);

export default router;
