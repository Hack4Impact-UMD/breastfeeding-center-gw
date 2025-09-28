"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const acuityRoutes_1 = __importDefault(require("./routes/acuityRoutes"));
const app = (0, express_1.default)();
//TODO: Enforce stricter cors rules when this is deployed, currently all origins are allowed
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/acuity", acuityRoutes_1.default);
app.get("/", (_, res) => {
  res.status(200).json({
    status: "OK",
  });
});
exports.default = app;
//# sourceMappingURL=app.js.map
