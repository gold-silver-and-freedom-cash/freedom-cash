// I buy and sell https://FreedomCash.org

import { FreedomBets } from "./mod.ts"
import {sleep} from "https://deno.land/x/sleep@v1.3.0/mod.ts"

const votingPeriodMinLength = 60
const freedomBets = await FreedomBets.getInstance()

let projectCounter = await freedomBets.getProjectCounter()
// await freedomBets.addProject(projectCounter + BigInt(1), "https://FreedomCash.org")
// projectCounter = await freedomBets.getProjectCounter()
// await freedomBets.addProject(projectCounter + BigInt(1), "https://freedom-enterprise.org")
// projectCounter = await freedomBets.getProjectCounter()

// let counter = 0

// while (counter < projectCounter) {
//     counter++
//     const owner = await freedomBets.getProjectOwner(counter)
//     console.log(owner)
//     await freedomBets.addAsset(counter, `hello free world in project ${counter}`, votingPeriodMinLength)
//     await freedomBets.addAsset(counter, `we hope you enjoy freedom cash in self hosted wallets in project ${counter}`, votingPeriodMinLength)
//     await freedomBets.addAsset(counter, `wuff in project ${counter}`, votingPeriodMinLength)
//     const projectAssets = await freedomBets.getProjectAssets(counter)
//     console.log(projectAssets)
    
//     for (const projectAssetID of projectAssets) {
//         if((projectAssetID % BigInt(2)) == BigInt(0)) {
//             await freedomBets.appreciateAsset(projectAssetID, 9)
//             await freedomBets.depreciateAsset(projectAssetID, 18)
//         } else {
//             await freedomBets.appreciateAsset(projectAssetID, 3)
//             await freedomBets.depreciateAsset(projectAssetID, 1)
//         }
//         console.log(await freedomBets.assets(projectAssetID))
//         await sleep(votingPeriodMinLength)
//         await freedomBets.reconcile(projectAssetID)
//     }
    
//     await freedomBets.claimRewards()    
// }

// await freedomBets.log()

// console.log(await freedomBets.getProjects())