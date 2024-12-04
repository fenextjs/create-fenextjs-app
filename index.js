#!/usr/bin/env node

const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

program.version('1.0.0').description('CLI para crear proyectos Fenextjs');

program
  .command('init <projectName>')
  .description('Crea un nuevo proyecto Fenextjs')
  .action(async (projectName) => {
    console.log(`Iniciando proyecto ${projectName}...`);

    // Clonar el repositorio base
    const repoUrl = `https://github.com/fenextjs/template`;
    if (shell.exec(`git clone --depth 1 ${repoUrl} ${projectName}`).code !== 0) {
      console.error('Error al clonar el repositorio.');
      shell.exit(1);
    }

    // Cambiar al directorio del proyecto
    process.chdir(`./${projectName}`);
    console.log(`Directorio cambiado a ${process.cwd()}`);

    // Eliminar el .git del template
    shell.rm('-rf', '.git');

    // Inicializar un nuevo repositorio git
    if (shell.exec('git init').code !== 0) {
      console.error('Error al inicializar git.');
      shell.exit(1);
    }
    
    // Preguntar al usuario por la URL del repositorio Git
    const { gitUrl } = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'gitUrl',
        message: 'Introduce la URL del repositorio Git (o deja en blanco para omitir):',
        default: '',
      },
    ]);

    if (gitUrl) {
      // Asignar la URL del repositorio remoto
      if (shell.exec(`git remote add origin ${gitUrl}`).code !== 0) {
        console.error('Error al asignar la URL del repositorio.');
        shell.exit(1);
      }
      console.log(`Repositorio remoto asignado: ${gitUrl}`);
    }

    // Leer y actualizar el package.json
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

program.parse(process.argv);
