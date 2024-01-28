// SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3

// Incentive System for Truth, Respect & Direct Democracy. 
// Freedom Bets incentivize voters to vote and protect against stupidity, corruption and fraud. 
// Any project can become a community guarded project via Freedom Bets.
// Freedom Bets leverage Freedom Cash as their decentralized currency
// https://zkevm.polygonscan.com/token/0xa1e7bB978a28A30B34995c57d5ba0B778E90033B

pragma solidity 0.8.19;

interface IFreedomBets { 
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
  function addProject(uint256 projectID, string memory url) external;
  function addAsset(uint256 projectID, string memory text, uint256 assetID, uint256 votingPeriodMinLength) external;
  function appreciateAsset(uint256 assetID, uint256 appreciationAmountFC, uint256 fCBuyPrice) external;
  function depreciateAsset(uint256 assetID, uint256 depreciationAmountFC, uint256 fCBuyPrice) external;
  function reconcile(uint256 assetID) external;
  function getClaimableRewards(address receiver) external view returns(uint256 sum);
  function claimRewards() external;
  function getNumberOfWinningVotes(uint256 assetID, bool up) external view returns (uint256 counter);
  function getSumOfLosingVotes(uint256 assetID, bool up) external view returns (uint256 sum);
  function getProjectAssets(uint256 projectID) external view returns (uint256[] memory);
}