"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userRoute_2 = __importDefault(require("./routes/userRoute"));
const roleRoute_1 = __importDefault(require("./routes/roleRoute"));
const MedicalConditionRoute_1 = __importDefault(require("./routes/MedicalConditionRoute"));
const AllergyRoute_1 = __importDefault(require("./routes/AllergyRoute"));
exports.default = () => {
    var _a;
    const app = (0, express_1.Router)();
    (0, userRoute_1.default)(app);
    (0, userRoute_2.default)(app);
    (0, roleRoute_1.default)(app);
    (0, MedicalConditionRoute_1.default)(app);
    (0, AllergyRoute_1.default)(app);
    (_a = app.stack) === null || _a === void 0 ? void 0 : _a.forEach((middleware) => {
        if (middleware.route) {
            console.log(middleware.route);
        }
    });
    return app;
};
//# sourceMappingURL=index.js.map