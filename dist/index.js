"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const fileName = 'domain.txt';
let fileContent = fs.readFileSync(fileName, 'utf8');
function domainCount(fileContent, min_hits = 0) {
    var _a, _b;
    const domainList = fileContent.split('\n');
    let groupDomain = [];
    for (let i = 0; i < domainList.length; i++) {
        const element = domainList[i];
        const domainClean = element.split(/[ .]+/);
        const fourPosition = domainClean[domainClean.length - 1];
        const threePosition = domainClean[domainClean.length - 2];
        const twoPosition = domainClean[domainClean.length - 3];
        const onePosition = domainClean[domainClean.length - 4];
        if (twoPosition.length < 3) {
            groupDomain.push({ domain: onePosition, domainClean: `${onePosition}.${twoPosition}.${threePosition}`, count: Number(fourPosition) });
        }
        else {
            groupDomain.push({ domain: twoPosition, domainClean: `${twoPosition}.${threePosition}`, count: Number(fourPosition) });
        }
    }
    const groupAndCountDomain = groupDomain.reduce((acum, item) => {
        return !acum[item.domain]
            ? Object.assign(Object.assign({}, acum), { [item.domain]: item.count }) : Object.assign(Object.assign({}, acum), { [item.domain]: acum[item.domain] + item.count });
    }, {});
    let filterDomain = [];
    for (const property in groupAndCountDomain) {
        filterDomain.push({ domain: property, count: groupAndCountDomain[property] });
    }
    filterDomain = filterDomain.filter(x => x.count > min_hits);
    filterDomain = filterDomain.sort(function (a, b) { return a.domain.localeCompare(b.domain); });
    filterDomain = filterDomain.sort(function (a, b) { return b.count - a.count; });
    let newDomainArray = [];
    let newGroup = [];
    for (let i = 0; i < filterDomain.length; i++) {
        newGroup = groupDomain.filter((x) => { return x.domain == filterDomain[i].domain; });
        newGroup = newGroup.sort(function (a, b) { return b.count - a.count; });
        newDomainArray.push({ domain: ((_a = newGroup[0]) === null || _a === void 0 ? void 0 : _a.domainClean) || ((_b = newGroup[0]) === null || _b === void 0 ? void 0 : _b.domain), count: filterDomain[i].count });
    }
    let stringDomain = `count_domains(domains_list, ${min_hits}) = '''`;
    for (let i = 0; i < newDomainArray.length; i++) {
        stringDomain = stringDomain.concat(` ${newDomainArray[i].domain}(${newDomainArray[i].count})`);
    }
    stringDomain = stringDomain.concat(` '''`);
    return stringDomain;
}
const result = domainCount(fileContent, 500);
console.log(result);
