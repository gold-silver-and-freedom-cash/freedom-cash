import { freedomBets, baseURLScan, FC, getContract, getLogger, getProvider } from "./constants-types-infrastructure.ts"
import { ethers, Logger } from "../deps.ts"

export class FreedomBets {

    private static instance
    public static async getInstance() {
        if (FreedomBets.instance === undefined) {
            const logger = await getLogger()
            const provider = getProvider(logger)
            const contract = await getContract(freedomBets, provider, './blockchain/freedom-bets-abi.json')
            const fCcontract = await getContract(FC, provider, './blockchain/freedom-cash-abi.json')
            return new FreedomBets(logger, contract, fCcontract, provider)
        }
    }

    protected logger: Logger
    protected provider: any
    protected contract
    protected fCcontract

    protected constructor(logger: Logger, contract: any, fCcontract: any, provider: any) {
        this.logger = logger
        this.provider = provider
        this.contract = contract
        this.fCcontract = fCcontract
    }
    public async addProject(projectID: bigint, url: string) {
        this.logger.debug(`adding project ${projectID} ${url}`)
        await this.awaitTransaction(await this.contract.addProject(projectID, url))
    }    
    public async addAsset(projectID: bigint, text: string, assetID: number, votingPeriodMinLength: number) {
        this.logger.debug(`adding to ${projectID} asset ${text} ${assetID} ${votingPeriodMinLength}`)
        await this.awaitTransaction(await this.contract.addAsset(projectID, text, assetID, votingPeriodMinLength))
    }
    public async appreciateAsset(assetID: number, amount: number) {
        const parsedAmount = ethers.parseEther(amount.toString())
        const buyPrice = await this.fCcontract.getBuyPrice(BigInt(10 ** 18))
        const cost = buyPrice * BigInt(amount)
        this.logger.debug(`appreciating asset ${assetID} parsedAmount ${parsedAmount} buyPrice ${buyPrice} cost ${cost}`)
        await this.awaitTransaction(await this.contract.appreciateAsset(assetID, parsedAmount, buyPrice, {value: cost}))
    }
    public async depreciateAsset(assetID: number, amount: number) {
        const parsedAmount = ethers.parseEther(amount.toString())
        const buyPrice = await this.fCcontract.getBuyPrice(BigInt(10 ** 18))
        const cost = buyPrice * BigInt(amount)
        this.logger.debug(`depreciating asset ${assetID} parsedAmount ${parsedAmount} buyPrice ${buyPrice} cost ${cost}`)
        await this.awaitTransaction(await this.contract.depreciateAsset(assetID, parsedAmount, buyPrice, {value: cost}))
    }
    public async reconcile(assetID: number) {
        this.logger.debug(`reconcile asset ${assetID}`)
        await this.awaitTransaction(await this.contract.reconcile(assetID))
    }
    public async claimRewards() {
        this.logger.debug(`claiming rewards`)
        await this.awaitTransaction(await this.contract.claimRewards())
    }
    public async getNumberOfWinningVotes(assetID: number, up: boolean) {
        return this.contract.getNumberOfWinningVotes(assetID, up)
    }
    public async getProjects() {
        const numberOfProjects = await this.contract.projectCounter()
        let counter = 0
        const result = []
        while (counter < numberOfProjects) {
            counter++
            const projectURL = await this.contract.projects(counter)
            console.log(projectURL)
            result.push({
                id: counter,
                url: projectURL
            })
        }
        return result
    }
    public async getSumOfLosingVotes(assetID: number, amount: number) {
        return this.contract.getSumOfLosingVotes(assetID, amount)
    }
    public async getClaimableRewards(receiver: string) {
        return this.contract.getClaimableRewards(receiver)
    }
    public async getProjectCounter() {
        const projectCounter = await this.contract.projectCounter()
        return projectCounter
    }
    public async getProjectOwner(projectID: number) {
        return this.contract.projectOwners(projectID)
    }
    public async getAsset(id: number) {
        this.logger.info(`reading asset ${id}`)
        const raw = await this.contract.assets(id)

        return {
            text: raw[0],
            upVoteScore: raw[1],
            downVoteScore: raw[2],
            reconciliationFrom: raw[3],
            reconciled: raw[4]
        }
    }
    public async getVote(id: number) {
        this.logger.info(`reading vote ${id}`)
        const raw = await this.contract.votes(id)

        return {
            from: raw[0],
            amount: raw[1],
            up: raw[2],
            rewardAmount: raw[3],
            claimed: raw[4]
        }
    }
    public async getAssetCounter() {
        return this.contract.assetCounter()
    }
    public async getVoteCounter() {
        return this.contract.voteCounter()
    }
    public async log() {
        const assetCounter = await this.getAssetCounter()
        const voteCounter = await this.getVoteCounter()
        this.logger.debug(`asset counter: ${assetCounter}`)
        this.logger.debug(`vote counter: ${voteCounter}`)
        let counter = 1
        while (assetCounter >= counter) {
            const asset = await this.getAsset(counter)
            this.logger.debug(`asset ${counter} ${asset.upVoteScore} ${asset.downVoteScore} ${asset.reconciliationFrom} ${asset.reconciled}`)
            counter++
        }
        counter = 1
        while (voteCounter >= counter) {
            const vote = await this.getVote(counter)
            this.logger.debug(`vote ${counter} ${vote.from} ${vote.amount} ${vote.up} ${vote.rewardAmount} ${vote.claimed}`)
            counter++
        }
        this.logger.debug(`claimableRewards: ${await this.contract.getClaimableRewards("0xB257CCE82d58Ed21c70B4B0cac6a6089408E5dbE")}`) 
        this.logger.debug(`amount of ETH in contract: ${await this.provider.getBalance(freedomBets)}`)
        this.logger.debug(`amount of FC in contract: ${await this.fCcontract.balanceOf(freedomBets)}`)
    }
    public async isAssetCommunityApproved(assetID: number): Promise<boolean> {
        this.logger.info(`checking if asset community approved ${assetID}`)
        const asset = await this.contract.assets(assetID)

        if (asset.upVoteScore >= asset.downVoteScore) {
            return true
        } else {
            return false
        }
    }    
    private async awaitTransaction(tx: any): Promise<void> {
        this.logger.info(`awaiting transaction ${baseURLScan}tx/${tx.hash}`)
        await tx.wait()
    }
}