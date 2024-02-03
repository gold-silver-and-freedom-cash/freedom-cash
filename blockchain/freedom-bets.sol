// SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// Incentive System for Truth, Respect & Direct Democracy. 
// Freedom Bets incentivize voters to vote and protect against stupidity, corruption and fraud. 
// Any project can become a community guarded project via Freedom Bets.
// Freedom Bets leverage Freedom Cash as their decentralized currency
// https://zkevm.polygonscan.com/token/0xa1e7bB978a28A30B34995c57d5ba0B778E90033B

pragma solidity 0.8.19;
import "https://github.com/monique-baumann/freedom-cash/blob/v1.3.0/blockchain/freedom-cash-interface.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/token/ERC20/IERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/utils/math/Math.sol";

contract FreedomBets {

  address public nativeFreedomCash = 0x1E7A208810366D0562c7Ba93F883daEedBf31410; 
  uint256 public assetCounter;
  uint256 public voteCounter;
  uint256 public projectCounter;

  mapping(uint256 => uint256[]) public projectAssets;
  mapping(uint256 => string) public projects;
  mapping(uint256 => address) public projectOwners;
  mapping(uint256 => address) public assetCreators;
  mapping(uint256 => IAsset) public assets;
  mapping(uint256 => IVote) public votes;
  mapping(uint256 => uint256) public voteToAsset;

  struct IAsset{
    string text;
    uint256 upVoteScore;
    uint256 downVoteScore;
    uint256 reconciliationFrom;
    bool reconciled;
  }
  struct IVote {
    address payable from;
    uint256 amount;
    bool up;
    uint256 rewardAmount;
    bool claimed;
  }

  error Patience();
  error Nonsense();
  error AssetIDAlreadyRegisteredPleaseRetry();
  error NothingToClaim();
  error PleaseCheckYourHashingFunction();
  error YouCanOnlyAddAssetsToYourOwnProjectIDs();
  error PleaseProvideAReasonableProjectID();

  function addProject(uint256 projectID, string memory url) public {
    if (projectCounter + 1 == projectID) {
      projectCounter++;
      projects[projectID] = url;
      projectOwners[projectID] = msg.sender;
    } else {
      revert PleaseProvideAReasonableProjectID();
    }
  }
  function addAsset(uint256 projectID, string memory text, uint256 assetID, uint256 votingPeriodMinLength) public {
    if (projectOwners[projectID] == msg.sender) {
      if (assetID != (assetCounter + 1)) { revert AssetIDAlreadyRegisteredPleaseRetry(); }
      assetCounter++;
      IAsset memory asset = IAsset(text, 0, 0, block.timestamp + votingPeriodMinLength, false);
      assets[assetCounter] = asset;
      assetCreators[assetCounter] = msg.sender;
      projectAssets[projectID].push(assetCounter);    
    } else {
      revert YouCanOnlyAddAssetsToYourOwnProjectIDs();
    }
  }
  function appreciateAsset(uint256 assetID, uint256 appreciationAmountFC, uint256 fCBuyPrice) public payable  {
		if(assetID == 0 || assetID > assetCounter || assets[assetID].reconciled) { revert Nonsense(); }    
    voteCounter++;
    IFreedomCash(nativeFreedomCash).buyFreedomCash{value: msg.value}(appreciationAmountFC, fCBuyPrice);
    assets[assetID].upVoteScore += appreciationAmountFC;
    IVote memory vote = IVote(payable(msg.sender), appreciationAmountFC, true, 0, false);
    votes[voteCounter] = vote;
    voteToAsset[voteCounter] = assetID;
  }
  function depreciateAsset(uint256 assetID, uint256 depreciationAmountFC, uint256 fCBuyPrice) public payable  {
    if(assetID == 0 || assetID > assetCounter || assets[assetID].reconciled) { revert Nonsense(); }    
    voteCounter++;    
    IFreedomCash(nativeFreedomCash).buyFreedomCash{value: msg.value}(depreciationAmountFC, fCBuyPrice);
    assets[assetID].downVoteScore += depreciationAmountFC;
    IVote memory vote = IVote(payable(msg.sender), depreciationAmountFC, false, 0, false);
    votes[voteCounter] = vote;
    voteToAsset[voteCounter] = assetID;
  }
  function reconcile(uint256 assetID) public {
    if(assetID == 0 || assetID > assetCounter || assets[assetID].reconciled) { revert Nonsense(); }
    if(assets[assetID].upVoteScore == 0 && assets[assetID].downVoteScore == 0) { revert Nonsense(); }
    if (block.timestamp < assets[assetID].reconciliationFrom) { revert Patience(); }
    if (assets[assetID].upVoteScore >= assets[assetID].downVoteScore) {
      uint256 sumOfLosingVotes = getSumOfLosingVotes(assetID, true);
      if (sumOfLosingVotes > 0) {
        uint256 numberOfWinningVotes = getNumberOfWinningVotes(assetID, true);
        distributeRewards(assetID, true, sumOfLosingVotes, numberOfWinningVotes);      
      }
    } else {
      uint256 sumOfLosingVotes = getSumOfLosingVotes(assetID, false);      
      if (sumOfLosingVotes > 0) {
        uint256 numberOfWinningVotes = getNumberOfWinningVotes(assetID, false);      
        distributeRewards(assetID, false, sumOfLosingVotes, numberOfWinningVotes);
      }
    }
    assets[assetID].reconciled = true;
  }
  function getClaimableRewards(address receiver) public view returns(uint256 sum) {
    for (uint256 i = 1; i <= voteCounter; i++) {
      if (receiver == votes[i].from && !votes[i].claimed && assets[voteToAsset[i]].reconciled) {
        sum += votes[i].rewardAmount;
      }
    }
  }
  function claimRewards() public {
    uint256 amount = getClaimableRewards(msg.sender);
    if(amount == 0){ revert NothingToClaim(); }
    for (uint256 i = 1; i <= voteCounter; i++) {
      if (msg.sender == votes[i].from) {
        if (!votes[i].claimed && assets[voteToAsset[i]].reconciled && votes[i].rewardAmount > 0) {
          votes[i].claimed = true;
        }
      }
    }    
    IERC20(nativeFreedomCash).transfer(msg.sender, amount);
  }
  function getNumberOfWinningVotes(uint256 assetID, bool up) public view returns (uint256 counter) {
    for (uint256 i = 1; i <= voteCounter; i++) {
      if (assetID == voteToAsset[i]) {
        if(up && votes[i].up) {
          counter++;
        } else if(!up && !votes[i].up) {
          counter++;
        }
      }
    } 
  }
  function getSumOfLosingVotes(uint256 assetID, bool up) public view returns (uint256 sum) {
    for (uint256 i = 1; i <= voteCounter; i++) {
      if (assetID == voteToAsset[i]) {
        if((up && !votes[i].up) || (!up && votes[i].up)) {
          sum += votes[i].amount;
        }
      } 
    }
  }
  function getProjectAssets(uint256 projectID) public view returns (uint256[] memory) {
    return projectAssets[projectID];
  }
  function distributeRewards(uint256 assetID, bool toUpvoters, uint256 sumOfLosingVotes, uint256 numberOfWinningVotes) internal {
    uint256 rewardPerWinner = Math.mulDiv(sumOfLosingVotes, 91, 100) / numberOfWinningVotes;      
    IERC20(nativeFreedomCash).transfer(nativeFreedomCash, Math.mulDiv(sumOfLosingVotes, 9, 100));
    for (uint256 i = 1; i <= voteCounter; i++) {
      if (voteToAsset[i] == assetID) {
        if((votes[i].up && toUpvoters) || (!votes[i].up && !toUpvoters)){
          votes[i].rewardAmount = rewardPerWinner + votes[i].amount;
        } 
      }
    }
  }
}