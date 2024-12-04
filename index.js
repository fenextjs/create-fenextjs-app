#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
// const inquirer = require('inquirer');
const shell = require('shelljs');

// Define la versión del CLI
program.version('1.0.0').description('CLI para crear proyectos Fenextjs');

// Comando para inicializar un proyecto
program
  .command('init <projectName>')
  .description('Crea un nuevo proyecto Fenextjs')
  .action(async (projectName) => {
    console.log(chalk.green(`Iniciando proyecto ${projectName}...`));

    // Preguntas interactivas
    // const answers = await inquirer.prompt([
    //   {
    //     type: 'list',
    //     name: 'template',
    //     message: 'Selecciona un template:',
    //     choices: ['Basic', 'E-Commerce', 'Blog'],
    //   },
    // ]);

    // console.log(chalk.blue(`Template seleccionado: ${answers.template}`));

    // Clonar un template desde un repositorio (opcional)
    const repoUrl = `https://github.com/fenextjs/template`;
    if (shell.exec(`git clone ${repoUrl} ${projectName}`).code !== 0) {
      console.error(chalk.red('Error al clonar el repositorio.'));
      shell.exit(1);
    }

    console.log(chalk.green('Proyecto creado exitosamente.'));
  });

// Parsear argumentos
program.parse(process.argv);
