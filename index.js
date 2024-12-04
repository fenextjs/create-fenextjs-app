#!/usr/bin/env node

const { program } = require('commander');
const shell = require('shelljs');

// Define la versión del CLI
program.version('1.0.0').description('CLI para crear proyectos Fenextjs');

// Comando para inicializar un proyecto
program
  .command('init <projectName>')
  .description('Crea un nuevo proyecto Fenextjs')
  .action(async (projectName) => {
    console.log(`Iniciando proyecto ${projectName}...`);

    // Clonar un template desde un repositorio (sin historial git)
    const repoUrl = `https://github.com/fenextjs/template`;
    if (shell.exec(`git clone --depth 1 ${repoUrl} ${projectName}`).code !== 0) {
      console.error('Error al clonar el repositorio.');
      shell.exit(1);
    }

    // Cambiar al directorio del proyecto
    try {
      process.chdir(`./${projectName}`);
      console.log(`Directorio cambiado a ${process.cwd()}`);
    } catch (err) {
      console.error(`Error al cambiar de directorio: ${err.message}`);
      shell.exit(1);
    }

    // Eliminar el directorio .git
    if (shell.rm('-rf', '.git').code !== 0) {
      console.error('Error al eliminar el directorio .git.');
      shell.exit(1);
    }

    // Inicializar un nuevo repositorio git (opcional)
    if (shell.exec('git init').code !== 0) {
      console.error('Error al inicializar git.');
      shell.exit(1);
    }

    console.log('Proyecto creado exitosamente.');
  });

// Parsear argumentos
program.parse(process.argv);
