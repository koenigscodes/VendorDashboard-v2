import type{ Request, Response } from "express";

const getHealth = (_req: Request, res: Response) => {
    res.json({ status: "ok" })
};

export default getHealth;