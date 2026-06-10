"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const movies_1 = __importDefault(require("./routes/movies"));
const moods_1 = __importDefault(require("./routes/moods"));
const favourite_1 = __importDefault(require("./routes/favourite"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/movies", movies_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/moods", moods_1.default);
app.use("/api/favourite", favourite_1.default);
exports.default = app;
