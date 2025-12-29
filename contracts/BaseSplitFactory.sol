// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseSplit.sol";

/**
 * @title BaseSplitFactory
 * @notice Factory contract to create and manage BaseSplit instances
 * @dev Enables creation of multiple independent split protocols
 */
contract BaseSplitFactory {
    
    // ============ Events ============
    
    event SplitProtocolCreated(
        address indexed protocol,
        address indexed creator,
        string name,
        uint256 timestamp
    );
    
    // ============ State Variables ============
    
    address[] public allProtocols;
    mapping(address => address[]) public creatorProtocols;
    mapping(address => bool) public isProtocol;
    
    uint256 public creationFee = 0.001 ether;
    address public feeRecipient;
    
    uint256 public totalProtocolsCreated;
    uint256 public totalFeesCollected;
    
    // ============ Constructor ============
    
    constructor() {
        feeRecipient = msg.sender;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new BaseSplit protocol
     * @param _name Name for the new protocol
     */
    function createProtocol(string calldata _name) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        
        BaseSplit newProtocol = new BaseSplit();
        newProtocol.transferOwnership(msg.sender);
        
        address protocolAddress = address(newProtocol);
        
        allProtocols.push(protocolAddress);
        creatorProtocols[msg.sender].push(protocolAddress);
        isProtocol[protocolAddress] = true;
        
        totalProtocolsCreated++;
        totalFeesCollected += msg.value;
        
        emit SplitProtocolCreated(protocolAddress, msg.sender, _name, block.timestamp);
        
        return protocolAddress;
    }
    
    /**
     * @notice Get all protocols created
     */
    function getAllProtocols() external view returns (address[] memory) {
        return allProtocols;
    }
    
    /**
     * @notice Get protocols created by a specific address
     * @param _creator The creator address
     */
    function getProtocolsByCreator(address _creator) external view returns (address[] memory) {
        return creatorProtocols[_creator];
    }
    
    /**
     * @notice Get the total number of protocols
     */
    function getProtocolCount() external view returns (uint256) {
        return allProtocols.length;
    }
    
    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external {
        require(msg.sender == feeRecipient, "Not fee recipient");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = payable(feeRecipient).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Update creation fee
     * @param _newFee New creation fee
     */
    function setCreationFee(uint256 _newFee) external {
        require(msg.sender == feeRecipient, "Not fee recipient");
        require(_newFee <= 0.1 ether, "Fee too high");
        creationFee = _newFee;
    }
    
    /**
     * @notice Update fee recipient
     * @param _newRecipient New fee recipient
     */
    function setFeeRecipient(address _newRecipient) external {
        require(msg.sender == feeRecipient, "Not fee recipient");
        require(_newRecipient != address(0), "Zero address");
        feeRecipient = _newRecipient;
    }
    
    // ============ Receive Function ============
    
    receive() external payable {
        totalFeesCollected += msg.value;
    }
}

