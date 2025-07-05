// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CrossChainRegistry
 * @dev A simple contract for testing cross-chain deployment and functionality
 */
contract CrossChainRegistry {
    struct ChainInfo {
        uint256 chainId;
        string name;
        uint256 blockNumber;
        address deployer;
        uint256 deploymentTime;
    }

    ChainInfo public chainInfo;
    mapping(address => string) public userNames;
    mapping(address => uint256) public registrationTime;
    
    event UserRegistered(address indexed user, string name, uint256 timestamp);
    event ChainInfoUpdated(uint256 chainId, string name);

    constructor(string memory _chainName) {
        chainInfo = ChainInfo({
            chainId: block.chainid,
            name: _chainName,
            blockNumber: block.number,
            deployer: msg.sender,
            deploymentTime: block.timestamp
        });
        
        emit ChainInfoUpdated(block.chainid, _chainName);
    }

    /**
     * @dev Register a user with a name
     */
    function registerUser(string memory _name) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(userNames[msg.sender]).length == 0, "User already registered");
        
        userNames[msg.sender] = _name;
        registrationTime[msg.sender] = block.timestamp;
        
        emit UserRegistered(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev Get user information
     */
    function getUserInfo(address _user) external view returns (string memory name, uint256 regTime) {
        return (userNames[_user], registrationTime[_user]);
    }

    /**
     * @dev Get chain information
     */
    function getChainInfo() external view returns (
        uint256 _chainId,
        string memory _name,
        uint256 _blockNumber,
        address _deployer,
        uint256 _deploymentTime
    ) {
        return (
            chainInfo.chainId,
            chainInfo.name,
            chainInfo.blockNumber,
            chainInfo.deployer,
            chainInfo.deploymentTime
        );
    }

    /**
     * @dev Get current chain state
     */
    function getCurrentState() external view returns (
        uint256 currentBlock,
        uint256 currentTime,
        uint256 currentChainId
    ) {
        return (block.number, block.timestamp, block.chainid);
    }

    /**
     * @dev Simple function to test gas costs across chains
     */
    function performComputation(uint256 _iterations) external pure returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < _iterations; i++) {
            result = result + i * 2;
        }
        return result;
    }

    /**
     * @dev Function to simulate storage operations for gas testing
     */
    function storeData(uint256[] memory _data) external {
        for (uint256 i = 0; i < _data.length; i++) {
            // Using a simple mapping to store data
            // This tests storage gas costs across different chains
            userStorage[msg.sender][i] = _data[i];
        }
    }

    mapping(address => mapping(uint256 => uint256)) public userStorage;
}
