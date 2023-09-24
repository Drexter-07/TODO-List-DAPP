// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string description;
        uint priority;
        address owner;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string description,
        uint priority,
        address owner
    );

    event TaskRemoved(
        uint id
    );

    function createTask(string memory _description, uint _priority) public {
        tasks[taskCount] = Task(taskCount, _description, _priority, msg.sender);
        emit TaskCreated(taskCount, _description, _priority, msg.sender);
        taskCount++;
    }

    function removeTask(uint _id) public {
        require(_id < taskCount, "Invalid task id");
        require(tasks[_id].owner == msg.sender, "You are not the owner of this task");
        
        
        for (uint i = _id; i < taskCount - 1; i++) {
            tasks[i] = tasks[i + 1];
        }
        delete tasks[taskCount - 1];
        taskCount--;
        emit TaskRemoved(_id);
    }

    function getTask(uint _id) public view returns(Task memory) {
        require(_id < taskCount, "Invalid task id");
        return tasks[_id];
    }

    function getTasksByOwner(address _owner) public view returns(Task[] memory) {
        uint count = 0;
        for(uint i = 0; i < taskCount; i++) {
            if(tasks[i].owner == _owner) count++;
        }

        Task[] memory ownerTasks = new Task[](count);
        uint index = 0;
        for(uint i = 0; i < taskCount; i++) {
            if(tasks[i].owner == _owner) {
                ownerTasks[index] = tasks[i];
                index++;
            }
        }
        return ownerTasks;
    }
}
