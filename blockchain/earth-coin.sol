// SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// This is an homage to our beautiful planet earth. 

pragma solidity 0.8.19;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/token/ERC20/ERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/utils/math/Math.sol";

contract EarthCoin is ERC20 {
    error BuyPriceMightHaveRisen();
    error TransferOfETHFailed();
    constructor() ERC20("Earth Coin", "EC") {
        _mint(address(this), 21000000 * 10 ** decimals()); // into contract itself 
    }
    function getBuyPrice(uint256 amountToBeBought) public view returns(uint256){
        uint256 underway = totalSupply() - balanceOf(address(this));    
        uint256 toBeUnderway = underway + amountToBeBought;
        return Math.mulDiv(9 * 10**9, toBeUnderway, 10**18);
    }
    function getSellPrice() public view returns(uint256) {
        uint256 underway = totalSupply() - balanceOf(address(this)); 
        if (underway == 0) { return 0; }
        return Math.mulDiv(address(this).balance, 10**18, underway);
    }   
    function donate(address donationReceiver, uint256 fCAmount, uint256 fCBuyPrice) public payable {
        uint256 check = Math.mulDiv(msg.value, 10**18, fCBuyPrice); 
        if (check != fCAmount) { revert BuyPriceMightHaveRisen(); }
        this.transfer(donationReceiver, fCAmount);
    }
    function sell(uint256 amount) public {
        uint256 amountOfETHToBeSent = Math.mulDiv(amount, getSellPrice(), 10**18); 
        if (allowance(msg.sender, address(this)) < amount) approve(address(this), amount);
        IERC20(address(this)).transferFrom(msg.sender, address(this), amount);
        (bool sent, ) = msg.sender.call{value: amountOfETHToBeSent}("Earth Coin");
        if (sent == false) { revert TransferOfETHFailed(); }
    }
}