import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

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
        claimed : Bool;
    };

    public type UserRole = {
        #Admin;
        #User;
        #Labeler;
    };

    public type UserProfile = {
        id : Text;
        balance : Nat;
        tasksCompleted : Nat;
        role : UserRole;
    };

    // Use Principal for security
    let adminId : Principal = Principal.fromText("a7db5377686c7a0a34b2c99ccdbf3b727794f3341b88182f79ed287ccfec38bd");
    
    var userProfiles = HashMap.HashMap<Text, UserProfile>(0, Text.equal, Text.hash);
    let tasks = HashMap.HashMap<Text, Task>(0, Text.equal, Text.hash);
    var presentId : Nat = 0;

    func get_or_create_profile(userId : Text) : UserProfile {
        switch (userProfiles.get(userId)) {
            case (?profile) { profile };
            case (null) {
                let newProfile : UserProfile = {
                    id = userId;
                    balance = 0;
                    tasksCompleted = 0;
                    role = #User;
                };
                userProfiles.put(userId, newProfile);
                newProfile
            };
        }
    };

    public shared({caller}) func makeTask(validatorId : Text, prize : Nat, deadline : Time.Time) : async Result.Result<Text, Text> {
        let companyId = Principal.toText(caller);
        
        if (validatorId == "") {
            return #err("Validator ID required");
        };
        
        if (prize <= 0) {
            return #err("Prize must be positive");
        };

        let companyProfile = get_or_create_profile(companyId);
        if (companyProfile.balance < prize) {
            return #err("Insufficient company balance");
        } else if (companyProfile.balance >= prize) {
            let updatedCompany = {
                companyProfile with 
                balance = companyProfile.balance - prize;
            };
            userProfiles.put(companyId, updatedCompany);
        } else {
            // handle the case where the balance is insufficient
            return #err("Insufficient company balance");
        };

        presentId += 1;
        let task : Task = {
            id = presentId;
            companyId = companyId;
            validatorId = validatorId;
            workerId = "";
            prize = prize;
            deadline = deadline;
            valid = false;
            claimed = false;
        };

        tasks.put(Nat.toText(presentId), task);
        #ok("Task created: " # Nat.toText(presentId))
    };

    public shared({caller}) func takeTask(taskId : Text) : async Result.Result<Text, Text> {
        let workerId = Principal.toText(caller);
        
        switch (tasks.get(taskId)) {
            case null { #err("Task not found") };
            case (?task) {
                if (task.workerId != "") {
                    return #err("Task already taken");
                };
                
                let updatedTask = {
                    task with 
                    workerId = workerId
                };
                tasks.put(taskId, updatedTask);
                #ok("Task taken")
            }
        }
    };

    public shared({caller}) func validateTask(taskId : Text) : async Result.Result<Text, Text> {
        let validatorId = Principal.toText(caller);
        
        switch (tasks.get(taskId)) {
            case null { #err("Task not found") };
            case (?task) {
                if (task.validatorId != validatorId) {
                    return #err("Unauthorized validator");
                };
                if (task.workerId == "") {
                    return #err("No worker assigned");
                };
                if (task.valid) {
                    return #err("Already validated");
                };

                let validatedTask = { task with valid = true };
                tasks.put(taskId, validatedTask);
                #ok("Validation successful")
            }
        }
    };

    public shared({caller}) func claimReward(taskId : Text) : async Result.Result<Text, Text> {
        let claimer = Principal.toText(caller);
        
        switch (tasks.get(taskId)) {
            case null { #err("Task not found") };
            case (?task) {
                if (not task.valid) {
                    return #err("Task not validated");
                };
                if (task.claimed) {
                    return #err("Reward already claimed");
                };
                if (task.workerId != claimer) {
                    return #err("Unauthorized claim");
                };

                // Calculate the reward share
                let total = task.prize;
                let share = total / 3;
                
                // Worker share
                let workerProfile = get_or_create_profile(task.workerId);
                let updatedWorker = {
                    workerProfile with 
                    balance = workerProfile.balance + share;
                    tasksCompleted = workerProfile.tasksCompleted + 1
                };
                userProfiles.put(task.workerId, updatedWorker);
                
                // Validator share
                let validatorProfile = get_or_create_profile(task.validatorId);
                let updatedValidator = {
                    validatorProfile with 
                    balance = validatorProfile.balance + share
                };
                userProfiles.put(task.validatorId, updatedValidator);
                
                // Admin share
                let adminProfile = get_or_create_profile(Principal.toText(adminId));
                let adminShare = total - (share * 2);
                let updatedAdmin = {
                    adminProfile with 
                    balance = adminProfile.balance + adminShare
                };
                userProfiles.put(Principal.toText(adminId), updatedAdmin);
                
                let claimedTask = { task with claimed = true };
                tasks.put(taskId, claimedTask);
                
                #ok("Reward claimed. Received: " # Nat.toText(share))
            }
        }
    };

    public shared({caller}) func deposit(amount : Nat) : async () {
        let userId = Principal.toText(caller);
        let profile = get_or_create_profile(userId);
        userProfiles.put(userId, {profile with balance = profile.balance + amount});
    };

    public query func getBalance(user : Text) : async Nat {
        switch (userProfiles.get(user)) {
            case (?profile) { profile.balance };
            case (null) { 0 };
        }
    };

    public shared query func getTask(taskId : Text) : async ?Task {
        return tasks.get(taskId);
    };

    // Query to view a user's profile
    public shared query func getProfile(userId : Text) : async ?UserProfile {
        return userProfiles.get(userId);
    };
};