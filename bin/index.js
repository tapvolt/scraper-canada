"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const cheerio = require("cheerio");
const config = require("config");
const req = require("tinyreq");
const log = require("winston");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        [
            "target.domain",
            "target.path",
            "target.suffix",
            "target.min",
            "target.max",
            "cssSelector.pageAnchor",
        ].forEach((key) => {
            assert(config.has(key), "Missing key in config");
        });
        const target = config.get("target"), selector = config.get("cssSelector");
        let urlsToVisit = [], businesses = [];
        for (let i = target.min; i <= target.max; i++) {
            urlsToVisit = extracted(target, i, selector);
            for (const url of urlsToVisit) {
                const page = yield fetch(url);
                const breakpoint = true;
            }
        }
    });
}
exports.main = main;
function fetch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            req(url, (err, body) => {
                if (err) {
                    throw err;
                }
                log.info(`fetching ${url}`);
                resolve(cheerio.load(body));
            });
        });
    });
}
function extracted(target, i, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        const urls = [], $ = yield fetch(target.domain + target.path + i + target.suffix), elements = $(selector.pageAnchor);
        elements.each((index, el) => {
            const path = cheerio(el).attr("href");
            urls.push(target.domain + path);
        });
        return urls;
    });
}
if (require.main === module) {
    main().catch((err) => {
        log.error("error encountered", err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map