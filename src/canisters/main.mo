import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
    // Task Object
    type Task = {
        id : Nat;
        companyId : Text;
        validatorId : Text;
        workerId : Text;
        prize : Nat;
        deadline : Time.Time;
        valid : Bool;
    };

    // HashMap for all the tasks
    let tasks = HashMap.HashMap<Text, Task>(0, Text.equal, Text.hash);
    // admin ID
    let adminId: Text = "a7db5377686c7a0a34b2c99ccdbf3b727794f3341b88182f79ed287ccfec38bd";
    // ID for a task
    var presentId : Nat = 0;

    // make a new task on makeTask public function
    public shared func makeTask(companyId : Text, validatorId : Text, prize : Nat, deadline : Time.Time) : async Result.Result<Text, Text> {
        if (companyId == "" or validatorId == "") {
            return #err("ID cannot be empty");
        };
        if (prize == 0) {
            return #err("Prize cannot be 0");
        };

        presentId += 1;
        // make a new task
        let task : Task = {
            id = presentId;
            companyId = companyId;
            validatorId = validatorId;
            workerId = "";
            prize = prize;
            deadline = deadline;
            valid = false;
        };

        // put the new task in tasks HashMap
        tasks.put(Nat.toText(presentId), task);
        return #ok("success");
    };

    // Take a task on takeTask function 
    public shared func takeTask(worker : Text, taskId : Text) : async Result.Result<Text, Text> {
        // get a task from the HashMap
        let existingTask = tasks.get(taskId);
        switch(existingTask) {
            case null {
                return #err("Task not found");
            };
            case(?task) { 
                let updatedTask : Task = {
                    id = task.id;
                    companyId = task.companyId;
                    validatorId = task.validatorId;
                    workerId = worker;
                    prize = task.prize;
                    deadline = task.deadline;
                    valid = task.valid;
                };

                // update the existing task in HashMap
                tasks.put(taskId, updatedTask);
                return #ok("Task updated");
            };
        };
    };
}