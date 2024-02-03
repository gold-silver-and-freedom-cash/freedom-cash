// SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3

pragma solidity 0.8.19;

contract FreedomCaching {
    uint256 public counter;
    struct FreedomCache {
        bytes32 location;
        bytes32 guestBookEntry;
    }
    mapping(uint256 => FreedomCache) public freedomCaches;
    error SupplyCorrectID();
    function add(uint256 id, bytes32 location, bytes32 guestBookEntry) public {
        if(counter + 1 != id) { revert SupplyCorrectID(); }
        counter++;
        freedomCaches[counter] = FreedomCache(location, guestBookEntry);
    }
}