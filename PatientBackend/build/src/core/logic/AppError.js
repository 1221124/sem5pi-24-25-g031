"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericAppError = void 0;
const Result_1 = require("./Result");
var GenericAppError;
(function (GenericAppError) {
    class UnexpectedError extends Result_1.Result {
        constructor(err) {
            super(false, {
                message: `An unexpected error occurred.`,
                error: err
            });
            console.log(`[AppError]: An unexpected error occurred`);
            console.error(err);
        }
        static create(err) {
            return new UnexpectedError(err);
        }
    }
    GenericAppError.UnexpectedError = UnexpectedError;
})(GenericAppError || (exports.GenericAppError = GenericAppError = {}));
//# sourceMappingURL=AppError.js.map