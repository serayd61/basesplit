// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title BaseSplit
 * @notice Revenue Sharing Protocol on Base - Split fees and rewards with collaborators
 * @dev Creates NFT-based revenue splits where holders receive proportional shares
 */
contract BaseSplit is ERC721Enumerable, Ownable, ReentrancyGuard {
    
    // ============ Structs ============
    
    struct Split {
        string name;
        address creator;
        uint256 totalShares;
        uint256 totalDistributed;
        uint256 pendingBalance;
        bool active;
        uint256 createdAt;
    }
    
    struct ShareHolder {
        address holder;
        uint256 shares;
        uint256 claimed;
    }
    
    // ============ State Variables ============
    
    uint256 public splitCounter;
    uint256 public protocolFee = 100; // 1% in basis points
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    mapping(uint256 => Split) public splits;
    mapping(uint256 => ShareHolder[]) public splitHolders;
    mapping(uint256 => mapping(address => uint256)) public holderIndex;
    mapping(uint256 => mapping(address => bool)) public isHolder;
    
    uint256 public totalFeesCollected;
    uint256 public totalDistributed;
    
    // ============ Events ============
    
    event SplitCreated(
        uint256 indexed splitId,
        string name,
        address indexed creator,
        address[] holders,
        uint256[] shares
    );
    
    event FundsReceived(
        uint256 indexed splitId,
        address indexed sender,
        uint256 amount
    );
    
    event FundsDistributed(
        uint256 indexed splitId,
        uint256 amount,
        uint256 fee
    );
    
    event SharesClaimed(
        uint256 indexed splitId,
        address indexed holder,
        uint256 amount
    );
    
    event SplitDeactivated(uint256 indexed splitId);
    
    // ============ Constructor ============
    
    constructor() ERC721("BaseSplit Share", "BSPLIT") Ownable(msg.sender) {}
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new revenue split
     * @param _name Name of the split
     * @param _holders Array of holder addresses
     * @param _shares Array of share amounts (must match holders length)
     */
    function createSplit(
        string calldata _name,
        address[] calldata _holders,
        uint256[] calldata _shares
    ) external returns (uint256) {
        require(_holders.length > 0, "No holders");
        require(_holders.length == _shares.length, "Length mismatch");
        require(_holders.length <= 100, "Too many holders");
        
        uint256 splitId = splitCounter++;
        uint256 totalShares = 0;
        
        for (uint256 i = 0; i < _holders.length; i++) {
            require(_holders[i] != address(0), "Zero address");
            require(_shares[i] > 0, "Zero shares");
            require(!isHolder[splitId][_holders[i]], "Duplicate holder");
            
            splitHolders[splitId].push(ShareHolder({
                holder: _holders[i],
                shares: _shares[i],
                claimed: 0
            }));
            
            holderIndex[splitId][_holders[i]] = i;
            isHolder[splitId][_holders[i]] = true;
            totalShares += _shares[i];
            
            // Mint NFT representing the share
            _mint(_holders[i], _encodeTokenId(splitId, i));
        }
        
        splits[splitId] = Split({
            name: _name,
            creator: msg.sender,
            totalShares: totalShares,
            totalDistributed: 0,
            pendingBalance: 0,
            active: true,
            createdAt: block.timestamp
        });
        
        emit SplitCreated(splitId, _name, msg.sender, _holders, _shares);
        
        return splitId;
    }
    
    /**
     * @notice Deposit funds to a split
     * @param _splitId The ID of the split to deposit to
     */
    function deposit(uint256 _splitId) external payable nonReentrant {
        require(splits[_splitId].active, "Split not active");
        require(msg.value > 0, "No value sent");
        
        uint256 fee = (msg.value * protocolFee) / FEE_DENOMINATOR;
        uint256 netAmount = msg.value - fee;
        
        splits[_splitId].pendingBalance += netAmount;
        totalFeesCollected += fee;
        
        emit FundsReceived(_splitId, msg.sender, msg.value);
    }
    
    /**
     * @notice Distribute pending funds to all holders
     * @param _splitId The ID of the split to distribute
     */
    function distribute(uint256 _splitId) external nonReentrant {
        Split storage split = splits[_splitId];
        require(split.active, "Split not active");
        require(split.pendingBalance > 0, "No pending balance");
        
        uint256 amountToDistribute = split.pendingBalance;
        split.pendingBalance = 0;
        split.totalDistributed += amountToDistribute;
        totalDistributed += amountToDistribute;
        
        ShareHolder[] storage holders = splitHolders[_splitId];
        
        for (uint256 i = 0; i < holders.length; i++) {
            uint256 holderShare = (amountToDistribute * holders[i].shares) / split.totalShares;
            
            (bool success, ) = payable(holders[i].holder).call{value: holderShare}("");
            if (success) {
                holders[i].claimed += holderShare;
                emit SharesClaimed(_splitId, holders[i].holder, holderShare);
            }
        }
        
        emit FundsDistributed(_splitId, amountToDistribute, 0);
    }
    
    /**
     * @notice Get claimable amount for a holder
     * @param _splitId The ID of the split
     * @param _holder The holder address
     */
    function getClaimable(uint256 _splitId, address _holder) external view returns (uint256) {
        if (!isHolder[_splitId][_holder]) return 0;
        
        Split storage split = splits[_splitId];
        uint256 idx = holderIndex[_splitId][_holder];
        ShareHolder storage holder = splitHolders[_splitId][idx];
        
        uint256 totalEarned = (split.totalDistributed * holder.shares) / split.totalShares;
        return totalEarned - holder.claimed;
    }
    
    /**
     * @notice Get all holders of a split
     * @param _splitId The ID of the split
     */
    function getHolders(uint256 _splitId) external view returns (ShareHolder[] memory) {
        return splitHolders[_splitId];
    }
    
    /**
     * @notice Deactivate a split (only creator)
     * @param _splitId The ID of the split to deactivate
     */
    function deactivateSplit(uint256 _splitId) external {
        require(splits[_splitId].creator == msg.sender, "Not creator");
        require(splits[_splitId].pendingBalance == 0, "Pending balance exists");
        
        splits[_splitId].active = false;
        emit SplitDeactivated(_splitId);
    }
    
    /**
     * @notice Withdraw protocol fees
     */
    function withdrawFees() external onlyOwner {
        uint256 fees = totalFeesCollected;
        totalFeesCollected = 0;
        
        (bool success, ) = payable(owner()).call{value: fees}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Update protocol fee (max 5%)
     * @param _newFee New fee in basis points
     */
    function setProtocolFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 500, "Fee too high");
        protocolFee = _newFee;
    }
    
    // ============ Internal Functions ============
    
    function _encodeTokenId(uint256 _splitId, uint256 _holderIndex) internal pure returns (uint256) {
        return (_splitId << 128) | _holderIndex;
    }
    
    function _decodeTokenId(uint256 _tokenId) internal pure returns (uint256 splitId, uint256 holderIndex) {
        splitId = _tokenId >> 128;
        holderIndex = _tokenId & type(uint128).max;
    }
    
    // ============ Receive Function ============
    
    receive() external payable {
        totalFeesCollected += msg.value;
    }
}

