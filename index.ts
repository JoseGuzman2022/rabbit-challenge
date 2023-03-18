import * as fs from 'fs';

const fileName: string = 'domain.txt';
let fileContent = fs.readFileSync(fileName, 'utf8');

function domainCount(fileContent: string, min_hits: number = 0) {
    const domainList = fileContent.split('\n')
    let groupDomain = []
    for (let i = 0; i < domainList.length; i++) {
        const element = domainList[i];
        const domainClean = element.split(/[ .]+/)
        const fourPosition = domainClean[domainClean.length - 1];
        const threePosition = domainClean[domainClean.length - 2];
        const twoPosition = domainClean[domainClean.length - 3];
        const onePosition = domainClean[domainClean.length - 4];
        
        if (twoPosition.length < 3) {
            groupDomain.push({ domain: onePosition, domainClean: `${onePosition}.${twoPosition}.${threePosition}`, count: Number(fourPosition) })
        } else {
            groupDomain.push({ domain: twoPosition, domainClean: `${twoPosition}.${threePosition}`, count: Number(fourPosition) })
        }
    }
    
    const groupAndCountDomain = groupDomain.reduce((acum: any, item: any) => {
        return !acum[item.domain] 
        ? {...acum, [item.domain]: item.count } 
        : { ...acum, [item.domain]: acum[item.domain] + item.count }
        }, {})

    let filterDomain: { domain: string; count: number }[] = []
    for (const property in groupAndCountDomain) {
        filterDomain.push({ domain: property, count: groupAndCountDomain[property] })
    }
    
    filterDomain = filterDomain.filter(x => x.count > min_hits)
    
    filterDomain = filterDomain.sort(function(a, b){ return a.domain.localeCompare(b.domain) });
    
    filterDomain = filterDomain.sort(function(a, b){ return b.count - a.count });
    
    let newDomainArray = []
    let newGroup = []
    
    for (let i = 0; i < filterDomain.length; i++) {
        newGroup = groupDomain.filter((x) => { return x.domain == filterDomain[i].domain })
        newGroup = newGroup.sort(function(a, b){ return b.count - a.count });
        newDomainArray.push({ domain: newGroup[0]?.domainClean || newGroup[0]?.domain, count: filterDomain[i].count })
    }

    let stringDomain = `count_domains(domains_list, ${min_hits}) = '''`
    for (let i = 0; i < newDomainArray.length; i++) {
        stringDomain = stringDomain.concat(` ${newDomainArray[i].domain}(${newDomainArray[i].count})`)
    }
    stringDomain = stringDomain.concat(` '''`)
    return stringDomain
}

const result = domainCount(fileContent, 500)
console.log(result);