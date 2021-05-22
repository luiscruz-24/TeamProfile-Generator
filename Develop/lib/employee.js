class Employee {

    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;        
    };

    //To return the name

    getName() {
        return this.name;
    };
    
    //To return the id

    getId() {
        return this.id;
    };
    
    //To return the email

    getEmail() {
        return this.email;
    };
    
    //To return the role

    getRole() {
        return "Employee";
    };
    

};

module.exports = Employee;
