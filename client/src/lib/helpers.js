import { ethers } from 'ethers';
import { freedomBets, freedomBetsABI, freedomCashABI, freedomCash, targetChainId } from '../constants';

export const isEthereumWalletAddress = (address) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (
        /^(0x)?[0-9a-f]{40}$/.test(address) ||
        /^(0x)?[0-9A-F]{40}$/.test(address)
    ) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        throw new Error(
            `I guess it's fine toLowerCase the input as a client`
        );
    }
};

export const getInfoMessageToBeSigned = (assetURL, description) => {
    let infoMessageToBeSigned =
        `This signature ensures that only invited wallets can upload content, invite friends etc. in order to foster high quality content right from the start.`;
    infoMessageToBeSigned = `${infoMessageToBeSigned} Data: ${assetURL} ${description}`

    return infoMessageToBeSigned
}

export const getPublicWalletAddressFromSignature = async (signature, dataThatWasSigned, web3) => {
    const publicWalletAddress = await web3.eth.personal.ecRecover(
        dataThatWasSigned,
        signature
    );

    return publicWalletAddress
}

export const getFirstLinkInText = (text) => {

    let link = ""
    let indexOfFirstLinkStart = text.indexOf("https://")

    if (indexOfFirstLinkStart === -1) {

        // no https:// link in text // we might add ipfs:// links handling in the future

    } else {

        let restText = text.substr(indexOfFirstLinkStart, text.length)
        let indexOfFirstLinkEnd = restText.indexOf(" ") - 1

        if (indexOfFirstLinkEnd === -2) { // if end of link equals end of text
            link = restText
        } else {
            link = restText.substr(0, indexOfFirstLinkEnd)
        }
    }

    return link
}


export const replaceContentToShowClickableLinks = (content) => {

    if (content !== undefined && content.length >= 9 && content.indexOf('http:') === -1) {
        var exp_match =
            /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
        var element_content = content.replace(
            exp_match,
            `<a class="linkInText" href='$1' target="_blank">$1</a>`
        );
        var new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim
        var new_content = element_content.replace(
            new_exp_match,
            '$1<a class="linkInText" target="_blank" href="http://$2">$2</a>'
        )
        return new_content
    }

    return content

}

export const isBefore = (input1, input2) => {
    const date1 = getDateFromString(input1)
    const date2 = getDateFromString(input2)

    return date1 < date2
}


export const getDateFromString = (input) => {
    const year = Number(input.substr(0, 4))
    const month = Number(input.substr(5, 2)) - 1
    const dayte = Number(input.substr(8, 2))

    return new Date(Date.UTC(year, month, dayte, 0, 0, 0, 0))
}


export const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
}


export const getFormattedUTCDateFromDate = (date) => {
    return (
        [
            //   date.getFullYear(),
            date.getUTCFullYear(),
            padTo2Digits(date.getUTCMonth() + 1),
            padTo2Digits(date.getUTCDate()),
        ].join("-") +
        " " +
        [
            padTo2Digits(date.getUTCHours()),
            padTo2Digits(date.getUTCMinutes()),
            padTo2Digits(date.getUTCSeconds()),
        ].join(":")
    )
}


export const getLastMomentOfTodayFromString = (input) => {
    const part1 = input.split(" ")[0]
    const part2 = "23:59:59"

    return `${part1} ${part2}`
}


export const getLastMomentOfTodayFromDate = (date) => {
    const formattedUTCDateFromDate = getFormattedUTCDateFromDate(date)
    return getLastMomentOfTodayFromString(formattedUTCDateFromDate)
}

export const getDateOfLastMomentOfTodayFromDate = (date) => {
    const formattedUTCDateFromDate = getFormattedUTCDateFromDate(date)
    return getLastMomentOfTodayFromString(formattedUTCDateFromDate)
}

export const addOneDay = (input) => {

    const year = Number(input.substr(0, 4))
    const month = Number(input.substr(5, 2)) - 1
    const dayte = Number(input.substr(8, 2))

    const currentDate = new Date(Date.UTC(year, month, dayte))

    const oneDayLaterTimestamp = currentDate.setDate(currentDate.getDate() + 1)

    const result = getFormattedUTCDateFromDate(new Date(oneDayLaterTimestamp))

    return result
}

export const loadAssets = async (contract, projectID) => {
    let assets = [];
    if (projectID === 0) {
        let countProjects = 0;
        const projectCounter = await contract.projectCounter();
        while (countProjects < projectCounter) {
            countProjects++;
            assets = assets.concat(await getAssetsForProjectID(contract, countProjects))
        }
    } else {
        assets = await getAssetsForProjectID(contract, projectID);
    }
    return assets
}
export const getAssetsForProjectID = async (contract, projectID) => {
    const projectAssets = await contract.getProjectAssets(projectID);
    let counter = 0;
    let assets = []
    while (counter < projectAssets.length) {
        let assetRaw = await contract.assets(projectAssets[counter]);
        const asset = {
            id: Number(projectAssets[counter]),
            text: assetRaw.text,
            upVoteScore: Number(ethers.formatEther(assetRaw.upVoteScore)),
            downVoteScore: Number(ethers.formatEther(assetRaw.downVoteScore)),
            reconciliationFrom: Number(assetRaw.reconciliationFrom),
            reconciled: assetRaw.reconciled,
            embedLink: '',
            imageLink: '',
            lat: '',
            lon: ''
        };
        let startIndex = asset.text.indexOf('https://rumble.com/embed/');
        if (startIndex !== -1) {
            const rest = asset.text.substr(startIndex, asset.text.length - 1);
            console.log(rest);
            const endIndex = rest.indexOf(' ');
            const rumbleLink = asset.text.substr(startIndex, endIndex);
            console.log(rumbleLink);
            if (endIndex === -1) {
                asset.embedLink = rest;
            } else {
                asset.embedLink = rest.substr(0, endIndex);
            }
        }
        if (asset.text.indexOf('{') === 0) {
            const parsed = JSON.parse(asset.text);
            asset.lat = parsed.lat;
            asset.lon = parsed.lon;
            asset.text = parsed.txt;
            startIndex = asset.text.indexOf('https://mega.nz/file/');
            if (startIndex !== -1) {
                const rest = asset.text.substr(startIndex, asset.text.length - 1);
                console.log(rest);
                const endIndex = rest.indexOf(' ');
                const megaLink = asset.text.substr(startIndex, endIndex- 1);
                console.log(megaLink);
                if (endIndex === -1) {
                    asset.imageLink = rest;
                } else {
                    asset.imageLink = rest.substr(0, endIndex -1);
                }
            }
        }
        assets.push(asset);
        counter++;
    }
    return assets
}

export const getTextWithoutLink = (text, link) => {
    const startIndex = text.indexOf(link);
    const endIndex = startIndex + link.length;
    const part1 = text.substr(0, text.indexOf(link));
    const part2 = text.substr(endIndex, text.length);
    return `${part1}${part2}`;
}

export const connectToBlockchain = async () => {
    let connectionData = {
        provider: {},
        contract: {},
        publicWalletAddressOfVisitor: ""
    }
    try {
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        });

        if (chainId !== targetChainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: targetChainId }]
                });
            } catch (error) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: targetChainId,
                            chainName: 'Polygon zkEVM',
                            rpcUrls: ['https://zkevm-rpc.com'],
                            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                            blockExplorerUrls: ['https://zkevm.polygonscan.com']
                        }
                    ]
                });
            }
        }
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        connectionData.provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await connectionData.provider.getSigner();
        connectionData.contract = new ethers.Contract(freedomCash, freedomCashABI, signer);
        connectionData.fBContract = new ethers.Contract(freedomBets, freedomBetsABI, signer);
        connectionData.publicWalletAddressOfVisitor = accounts[0];
        window.ethereum.on('chainChanged', handleChainChanged);
        connectionData.visitorIsConnectedViaBrowserWallet = true;
    } catch (error) {
        alert(error.message);
    }
    window.ethereum.on('accountsChanged', function (accounts) {
        alert(`the account has been changed via Metamask. So I reload.`);
        window.location.reload();
    });

    return connectionData
}
export const handleChainChanged = (chainId) => {
    // await connectToBlockchain()
    alert(`the chain has been changed via Metamask. So I reload.`);
    window.location.reload();
}    

export const getPOIsFromAssets = (assets) => {
    const pois = []
    for (const asset of assets) {
        pois.push({lat: asset.lat, lon: asset.lon, text: asset.text})
    }
    return pois
}

export const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}
