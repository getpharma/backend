import logger from "../util/logger.util";
import * as requestPromise from "request-promise";
import { ENV_ERROR_WEBHOOK } from "../util/secrets.util";

class MattermostService {
    private constructor() {
        logger.silly("[N-FT] MattermostService");
    }

    static getInstance(): MattermostService {
        return new MattermostService();
    }

    async send(text: string): Promise<void> {
        const response = await requestPromise.post(ENV_ERROR_WEBHOOK, {
            body: {
                "text": text
            },
            json: true
        });

        return;
    }
}

export const mattermostService = MattermostService.getInstance();
