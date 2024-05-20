import { Request, Response } from "express";
import { logger } from "../middlewares/logger.middleware";

const testWithoutAuth = async (req: Request, res: Response) => {
    try {
        logger.debug({ message: 'testWithoutAuth'});
        res.status(200).json({ message: 'just a test without auth !!'});
    } catch (e) {
        logger.error(`testWithoutAuth error`, e);
        res.status(500).json({ message: "Oops !, une erreur s'est produite." });
    }
};

const testWithAuth = async (req: Request, res: Response) => {
    try {
        logger.debug('testWithAuth');
        res.status(200).json({ message: 'just a test with auth !!'});
    } catch (e) {
        logger.error(`testWithAuth error`, e);
        res.status(500).json({ message: "Oops !, une erreur s'est produite." });
    }
};

export { testWithoutAuth, testWithAuth }
