#!/usr/bin/env node

const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Definir la versión del CLI
program.version('1.0.0').description('CLI para crear y gestionar proyectos Fenextjs');

// Comando `init`
program
  .command('init <projectName>')
  .description('Crea un nuevo proyecto Fenextjs')
  .action(async (projectName) => {
    console.log(`Iniciando proyecto ${projectName}...`);

    const repoUrl = `https://github.com/fenextjs/template`;
    if (shell.exec(`git clone --depth 1 ${repoUrl} ${projectName}`).code !== 0) {
      console.error('Error al clonar el repositorio.');
      shell.exit(1);
    }

    process.chdir(`./${projectName}`);
    console.log(`Directorio cambiado a ${process.cwd()}`);

    shell.rm('-rf', '.git');
    if (shell.exec('git init').code !== 0) {
      console.error('Error al inicializar git.');
      shell.exit(1);
    }

    const { gitUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'gitUrl',
        message: 'Introduce la URL del repositorio Git (o deja en blanco para omitir):',
        default: '',
      },
    ]);

    if (gitUrl) {
      if (shell.exec(`git remote add origin ${gitUrl}`).code !== 0) {
        console.error('Error al asignar la URL del repositorio.');
        shell.exit(1);
      }
      console.log(`Repositorio remoto asignado: ${gitUrl}`);
    }

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageJson.name = projectName;
      if (gitUrl) {
        packageJson.repository = { type: 'git', url: gitUrl };
        packageJson.bugs = { url: `${gitUrl}/issues` };
        packageJson.homepage = `${gitUrl}#readme`;
      }
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Archivo package.json actualizado.');
    } else {
      console.warn('No se encontró package.json para actualizar.');
    }

    console.log('Proyecto creado exitosamente.');
  });

// Comando `update`
program
  .command('update')
  .description('Actualiza el CLI de create-fenextjs-app a la última versión')
  .action(() => {
    console.log('Actualizando create-fenextjs-app...');

    if (shell.exec('npm uninstall -g create-fenextjs-app').code !== 0) {
      console.error('Error al eliminar create-fenextjs-app.');
      shell.exit(1);
    }
    if (shell.exec('npm install -g create-fenextjs-app').code !== 0) {
      console.error('Error al actualizar create-fenextjs-app.');
      shell.exit(1);
    }

    console.log('create-fenextjs-app actualizado con éxito.');
  });

// Parsear argumentos
program.parse(process.argv);
