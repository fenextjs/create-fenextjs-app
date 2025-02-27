#!/usr/bin/env node

const { program } = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const generateColorTerminal = (n) => `\x1b[${n}m%s\x1b[0m`;

const COLORS = {
    Reset: generateColorTerminal(0),
    Bright: generateColorTerminal(1),
    Dim: generateColorTerminal(2),
    Underscore: generateColorTerminal(4),
    Blink: generateColorTerminal(5),
    Reverse: generateColorTerminal(7),
    Hidden: generateColorTerminal(8),

    FgBlack: generateColorTerminal(30),
    FgRed: generateColorTerminal(31),
    FgGreen: generateColorTerminal(32),
    FgYellow: generateColorTerminal(33),
    FgBlue: generateColorTerminal(34),
    FgMagenta: generateColorTerminal(35),
    FgCyan: generateColorTerminal(36),
    FgWhite: generateColorTerminal(37),
    FgGray: generateColorTerminal(90),

    BgBlack: generateColorTerminal(40),
    BgRed: generateColorTerminal(41),
    BgGreen: generateColorTerminal(42),
    BgYellow: generateColorTerminal(43),
    BgBlue: generateColorTerminal(44),
    BgMagenta: generateColorTerminal(45),
    BgCyan: generateColorTerminal(46),
    BgWhite: generateColorTerminal(47),
    BgGray: generateColorTerminal(100),
};

// Definir la versión del CLI
program.version('2.0.2').description('CLI para crear y gestionar proyectos Fenextjs');

// Comando `init`
program
  .command('init <projectName>')
  .description('Crea un nuevo proyecto Fenextjs')
  .action(async (projectName) => {
    console.log(COLORS.FgCyan, `Iniciando proyecto ${projectName}...`);

    console.log(COLORS.FgCyan, `Clonando https://github.com/fenextjs/fenextjs-template`);
    const repoUrl = `https://github.com/fenextjs/fenextjs-template`;
    if (shell.exec(`git clone --depth 1 ${repoUrl} ${projectName}`).code !== 0) {
      console.error(COLORS.FgRed, 'Error al clonar el repositorio.');
      shell.exit(1);
    }

    process.chdir(`./${projectName}`);

    shell.rm('-rf', '.git');
    const { gitUrl } = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'gitUrl',
        message: 'Introduce la URL del repositorio Git (o deja en blanco para omitir):',
        default: '',
      },
    ]);

    if (gitUrl) {
      console.log(COLORS.FgCyan, `Iniciando Git`);
      if (shell.exec('git init').code !== 0) {
        console.error(COLORS.FgRed, 'Error al inicializar git.');
        shell.exit(1);
      }
      if (shell.exec(`git remote add origin ${gitUrl}`).code !== 0) {
        console.error(COLORS.FgRed, 'Error al asignar la URL del repositorio.');
        shell.exit(1);
      }
      console.log(COLORS.FgGreen, `Repositorio remoto asignado: ${gitUrl}`);
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
      console.log(COLORS.FgYellow, 'Archivo package.json actualizado.');
    } else {
      console.warn(COLORS.FgRed, 'No se encontró package.json para actualizar.');
    }

    console.log(COLORS.FgBright, 'Proyecto creado exitosamente.');
  });

// Comando `update`
program
  .command('update')
  .description('Actualiza el CLI de create-fenextjs-app a la última versión')
  .action(() => {
    console.log(COLORS.FgBlue, 'Actualizando create-fenextjs-app...');

    if (shell.exec('npm update -g create-fenextjs-app && npm uninstall -g create-fenextjs-app && npm install -g create-fenextjs-app').code !== 0) {
      console.error(COLORS.FgRed, 'Error al actualizar create-fenextjs-app.');
      shell.exit(1);
    }

    console.log(COLORS.FgGreen, 'create-fenextjs-app actualizado con éxito.');
  });

// Parsear argumentos
program.parse(process.argv);
