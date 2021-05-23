const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const replace = require('replace');

const Manager = require('./lib/manager');
const Engineer = require('./lib/engineer');
const Intern = require('./lib/intern');

// Manager´s questions: Name, ID, email and phone number.
const managerQuestions = [
    {
      type: "input",
      message: "Please, enter the Manager´s name:",
      name: "name",
    },
    {
      type: "input",
      message: "Enter the Manager's ID:",
      name: "id",
    },
    {
      type: "input",
      message: "Enter Manager's email:",
      name: "email",
    },
    {
      type: "input",
      message: "Enter Manager´s Office Number:",
      name: "phone",
    },
  ];

//Engineer's questions: Name, ID, email and GitHub.
const engineerQuestions = [
  {
    type: "input",
    message: "Please, enter the engineer's name:",
    name: "name",
  },
  {
    type: "input",
    message: "Enter the engineer's ID:",
    name: "id",
  },
  {
    type: "input",
    message: "Enter engineer's email:",
    name: "email",
  },
  {
    type: "input",
    message: "Enter the engineer's GitHub username:",
    name: "github",
  },
];

// Intern's questions: Name, ID, email and school's name.
const internQuestions = [
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


  //Ask to add another member
const memberTeam = [
    {
        type: "list",
        name: "member",
        message: "Which team member would you like to add?",
        choices: [
            'Engineer',
            'Intern',
            'I don´t want to add someone else'
        ]

    },
];

const idArray = [];
const employees = [];
const memberInfoFinal = [];

//Capitalize every word in a sentence
function capitalize(str) {
    str = str.toLowerCase();
    return finalSentence = str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

//Ask if you want to add a new member
const addMember = () => {
    inquirer
        .prompt(memberTeam)
        .then(answer => {
            //Add an Engineer
            if (answer.member === "Engineer") {
                promptEngineer();
                //Add an intern  
            } else if (answer.member === "Intern") {
                promptIntern();
            } else {
                //Create a html with the members added 
                renderOutput(employees);
            }
        })
};

// Display the questions in the terminal
// Manager
const promptManager = () => {
    inquirer
        .prompt(managerQuestions)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            //With the answer create a new manager object
            const newManager = new Manager(name, answer.id, email.toLowerCase(), answer.phone);
            employees.push(newManager);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            addMember();
        })
};

//Engineer
const promptEngineer = () => {
    inquirer
        .prompt(engineerQuestions)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            const github = capitalize(answer.github);
            //With the answer create a new engineer object
            const newEngineer = new Engineer(name, answer.id, email.toLowerCase(), github);
            employees.push(newEngineer);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            addMember();
        })
};

//Intern
const promptIntern = () => {
    inquirer
        .prompt(internQuestions)
        .then(answer => {
            const name = capitalize(answer.name);
            const email = answer.email;
            const school = capitalize(answer.school);
            //With the answer create a new intern object
            const newIntern = new Intern(name, answer.id, email.toLowerCase(), school);
            employees.push(newIntern);
            idArray.push(answer.id);
            //Call the prompt member to ask if you want to add a new member
            addMember();

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
    createIndex();

};

//Create index with the information of every member
function fileMember(srcURL, destURL, data, regexArray) {
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
    memberInfoFinal.push(readFile(destURL));
};

//Read the file
function readFile(filePath) {
    console.log(fs.readFileSync(filePath, 'utf8'));
    return fs.readFileSync(filePath, 'utf8');
};

//Append all members in the main index.
function createIndex() {
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

// Function call to initialize app
const init = () => {
    promptManager();
};
init();