"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinates = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
/**
 * Query Google Maps API and return the coordinates of an address
 *
 * @param address Address to query
 * @returns null if none found, or an object with the coordinates
 */
const getCoordinates = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = yield (0, node_fetch_1.default)(url);
    const data = yield response.json();
    if (!data || data.status != "OK") {
        console.log(data, GOOGLE_MAPS_API_KEY);
        return null;
    }
    else {
        console.log(data, GOOGLE_MAPS_API_KEY);
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
    }
});
exports.getCoordinates = getCoordinates;
