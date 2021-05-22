const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const replace = require('replace');

const Manager = require('./lib/manager');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');

//Store every id
const idArray = [];
//Store every object member
const employees = [];
//Store the member with its html format
const memberInfoFinal = [];


const managerQuestion = [
    {
      type: "input",
      message: "Enter the manager´s name",
      name: "name",
    },
    {
      type: "input",
      message: "Enter the manager's id",
      name: "id",
    },
    {
      type: "input",
      message: "Enter manager's email",
      name: "email",
    },
    {
      type: "input",
      message: "Enter manager´s office number",
      name: "number",
    },
  ];


const engineerQuestion = [
  {
    type: "input",
    message: "Enter the engineer's name",
    name: "name",
  },
  {
    type: "input",
    message: "Enter the engineer's id",
    name: "id",
  },
  {
    type: "input",
    message: "Enter engineer's email",
    name: "email",
  },
  {
    type: "input",
    message: "Enter the engineer's GitHub username",
    name: "github",
  },
];

const internQuestion = [
    {
      type: "input",
      message: "Enter the intern´s name",
      name: "name",
    },
    {
      type: "input",
      message: "Enter the intern´s id",
      name: "id",
    },
    {
      type: "input",
      message: "Enter the intern´s email",
      name: "email",
    },
    {
      type: "input",
      message: "Enter the intern´s school",
      name: "school",
    },
  ];

//Prompt member loop
const memberTeam = [
    {
        type: "list",
        name: "member",
        message: "Which type of team member would you like to add",
        choices: [
            'Engineer',
            'Intern',
            'I dont to want to add any more team members'
        ]

    },
];

//Capitalize every word in a sentence
function capitalize(str) {
    str = str.toLowerCase();
    return finalSentence = str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

//Ask if you want to add a new member
const promptForNewMember = () => {
    inquirer.prompt(memberTeam)
        .then(answer => {
            //Show the question to add a new engineer member
            if (answer.member === "Engineer") {
                promptForEngineer();
                //Show the question to add a new intern member    
            } else if (answer.member === "Intern") {
                promptForIntern();
            } else {
                //Create a html with the memebers added 
                renderOutput(employees);



            }

        })
};

//Show the question of manager on the terminal and create a manager class
const promptForManager = () => {
    inquirer.prompt(managerQuestion)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            //With the answer create a new manager object
            const newManager = new Manager(name, answer.id, email.toLowerCase(), answer.phone);
            employees.push(newManager);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            promptForNewMember();
        })
};

//Show the question of engineer on the terminal and create a engineer class
const promptForEngineer = () => {
    inquirer.prompt(engineerQuestion)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            const github = capitalize(answer.github);
            //With the answer create a new engineer object
            const newEngineer = new Engineer(name, answer.id, email.toLowerCase(), github);
            employees.push(newEngineer);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            promptForNewMember();
        })
};

//Show the question of intern on the terminal and create a intern class
const promptForIntern = () => {
    inquirer.prompt(internQuestion)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            const school = capitalize(answer.school);
            //With the answer create a new intern object
            const newIntern = new Intern(name, answer.id, email.toLowerCase(), school);
            employees.push(newIntern);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            promptForNewMember();

        })
};

//Fill the html templates with the memebers added
function renderOutput(memberArray) {
    memberArray.forEach(member => {
        if (member.getRole() === "Manager") {
            const email = '<a href="mailto:' + member.getEmail() + '">Email: ' + member.getEmail() + '</a>';
            const data = [member.getName(), member.getId(), email, member.getOfficeNumber()];
            const regexArray = ["name", "ids", "email", "phone"];
            const srcURL = './src/manager.html';
            const destURL = './dist/manager-' + member.getId() + '.html';
            //Fill out manager html file with the object manager
            fileMember(srcURL, destURL, data, regexArray);
        } else if (member.getRole() === "Engineer") {
            const email = '<a href="mailto:' + member.getEmail() + '">Email: ' + member.getEmail() + '</a>';
            const github = '<a href="https://github.com/' + member.getGithub() + '" target="blank">GitHub: ' + member.getGithub() + '</a>'
            const data = [member.getName(), member.getId(), email, github];
            const regexArray = ["name", "id-engineer", "email-engineer", "github-engineer"];
            const srcURL = path.resolve(__dirname, './src/engineer.html');
            const destURL = path.resolve(__dirname, './dist/engineer-' + member.getId() + '.html');
            //Fill out engineer html file with the object engineer 
            fileMember(srcURL, destURL, data, regexArray);
        } else if (member.getRole() === "Intern") {
            const email = '<a href="mailto:' + member.getEmail() + '">Email: ' + member.getEmail() + '</a>';
            const data = [member.getName(), member.getId(), email, member.getSchool()];
            const regexArray = ["name-intern", "id-intern", "email-intern", "school-intern"];
            const srcURL = path.resolve(__dirname, './src/intern.html');
            const destURL = path.resolve(__dirname, './dist/intern-' + member.getId() + '.html');
            //Fil intern html file with the object intern 
            fileMember(srcURL, destURL, data, regexArray);
        }

    });


    //Create a final html 
    fillIndex();

};

//Replace the info of every member in its template
function fileMember(srcURL, destURL, data, regexArray) {
    //Take the original template and create another with the info of the member
    createFile(srcURL, destURL);
    for (let i = 0; i < data.length; i++) {
        replace({
            regex: regexArray[i],
            replacement: data[i],
            paths: [destURL],
            recursive: true,
            silent: true,
        });
    }
    //Add the updated template to array (Append every template member such a string) 
    memberInfoFinal.push(myfun(destURL));
};

//Read the file and returns its content
function myfun(filePath) {
    console.log(fs.readFileSync(filePath, 'utf8'));
    return fs.readFileSync(filePath, 'utf8');
};

//Append in the main file (index) all the members 
function fillIndex() {
    const srcIndex = './src/index.html'
    const destIndex = './dist/index.html';
    createFile(srcIndex, destIndex);
    const content = memberInfoFinal.join('');

    replace({
        regex: "content-index",
        replacement: content,
        paths: [destIndex],
        recursive: true,
        silent: true,
    });
};

//Create another with the info of the member
function createFile(srcURL, destURL) {
    fs.appendFile(destURL, '', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    fs.copyFile(srcURL, destURL, (error) => {
        // incase of any error
        if (error) {
            console.error(error);
            return;
        }

        console.log("Copied Successfully!");
    });
};

//Start the functionality of application
const init = () => {
    //Show the question of manager on the terminal
    promptForManager();
};
init();