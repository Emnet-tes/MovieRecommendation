"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagementToken = getManagementToken;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function getManagementToken() {
    // Log presence of required Auth0 env vars (mask secrets)
    const domain = process.env.AUTH0_DOMAIN || "";
    const clientId = process.env.AUTH0_CLIENT_ID || "";
    const audience = process.env.AUTH0_AUDIENCE || "";
    const secretPresent = !!process.env.AUTH0_CLIENT_SECRET;
    console.log("Auth0 config:", {
        domain: domain || "MISSING",
        clientId: clientId ? "present" : "MISSING",
        clientSecret: secretPresent ? "present" : "MISSING",
        audience: audience || "MISSING",
    });
    try {
        console.log("Fetching Auth0 management token...");
        const response = await axios_1.default.post(`https://${domain}/oauth/token`, {
            client_id: clientId,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: audience,
            grant_type: "client_credentials",
        });
        return response.data.access_token;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Auth0 error response:", error.response?.status, error.response?.data || error.message);
            const details = error.response?.data || error.message;
            throw new Error(typeof details === "object" ? JSON.stringify(details) : String(details));
        }
        else {
            console.error("Unexpected error:", error);
            throw new Error(String(error));
        }
    }
}
