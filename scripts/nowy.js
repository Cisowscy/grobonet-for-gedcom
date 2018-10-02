const 
    fs = require('fs-extra'),
    path = require('path'),
    moment = require("moment"),
    async = require("async"),
    chalk = require("chalk"),
    chalkPipe = require('chalk-pipe'),
    inquirer = require('inquirer');
    console.log("grobonet4gedcom-by-myheritage.cisowscy.com@1.0.0-beta.1");
    console.log(chalk.bgBlack(chalk.red("   _____ _____   ____  ____   ____  _   _ ______ _______              ")));
    console.log(chalk.bgBlack(chalk.red("  / ____|  __ \\ / __ \\|  _ \\ / __ \\| \\ | |  ____|__   __|             ")));
    console.log(chalk.bgBlack(chalk.red(" | |  __| |__) | |  | | |_) | |  | |  \\| | |__     | |                ")));
    console.log(chalk.bgBlack(chalk.red(" | | |_ |  _  /| |  | |  _ <| |  | | . ` |  __|    | |                ")));
    console.log(chalk.bgBlack(chalk.red(" | |__| | | \\ \\| |__| | |_) | |__| | |\\  | |____   | |                ")));
    console.log(chalk.bgBlack(chalk.red("  \\_____|_|")+chalk.yellow("__")+chalk.red("\\_\\\\____/|____/")+chalk.green("_")+chalk.red("\\____/|_|")+chalk.green("_")+chalk.red("\\_|______|")+chalk.green("__")+chalk.red("|_|")+chalk.green("__  __  __      ")));
    console.log(chalk.bgBlack(chalk.yellow(" |  ____/ __ \\|  __ \\ ")+chalk.green("  / ____|  ____|  __ \\ / ____/ __ \\|  \\/  |     ")));
    console.log(chalk.bgBlack(chalk.yellow(" | |__ | |  | | |__) |")+chalk.green(" | |  __| |__  | |  | | |   | |  | | \\  / |     ")));
    console.log(chalk.bgBlack(chalk.yellow(" |  __|| |  | |  _  / ")+chalk.green(" | | |_ |  __| | |  | | |   | |  | | |\\/| |     ")));
    console.log(chalk.bgBlack(chalk.yellow(" | |   | |__| | | \\ \\ ")+chalk.green(" | |__| | |____| |__| | |___| |__| | |  | |     ")));
    console.log(chalk.bgBlack(chalk.yellow(" |_|    \\____/|_|  \\_\\ ")+chalk.green(" \\_____|______|_____/ \\_____\\____/|_|  |_|   ")+chalk.white("_ ")));
    console.log(chalk.bgBlack(chalk.blue(" | |                | ||  __ \\  / ____")+chalk.white("(_)")+chalk.blue("                     | |  ")+chalk.white("(_)")));
    console.log(chalk.bgBlack(chalk.blue(" | |__  _   _       | || |__) || |     _ ___  _____      _____| | ___ ")));
    console.log(chalk.bgBlack(chalk.blue(" | '_ \\| | | |  _   | ||  _  / | |    | / __|/ _ \\ \\ /\\ / / __| |/ / |")));
    console.log(chalk.bgBlack(chalk.blue(" | |_) | |_| | | |__| || | \\ \\ | |____| \\__ \\ (_) \\ V  V /\\__ \\   <| |")));
    console.log(chalk.bgBlack(chalk.blue(" |_.__/ \\__, |  \\____")+chalk.white("(_)")+chalk.blue("_|  \\_")+chalk.white("(_)")+chalk.blue("_____|_|___/\\___/ \\_/\\_/ |___/_|\\_\\_|")));
    console.log(chalk.bgBlack(chalk.blue("         __/ |                                                        ")));
    console.log(chalk.bgBlack(chalk.blue("        |___/                                                         ")));   
const config_BAT = path.resolve(__dirname, "..", "temp", "konfiguracja.bat"); 
if (fs.existsSync(config_BAT)) {
    fs.removeSync(config_BAT)        
}
const skrobacz_BAT = path.resolve(__dirname, "..", "temp", "skrobanie.bat"); 
if (fs.existsSync(skrobacz_BAT)) {
    fs.removeSync(skrobacz_BAT)         
}     
const last_projekt = [path.resolve(__dirname, "..", "temp"), path.resolve(__dirname, "..", "config")];
if (fs.existsSync(last_projekt[0])) {
    fs.removeSync(last_projekt[0])        
}
if (fs.existsSync(last_projekt[1])) {
    fs.removeSync(last_projekt[1])        
}
let projekt = moment.utc(new Date()).format("[PROJEKT_]GGWWE[_]HHmm");
fs.ensureFileSync(path.resolve(__dirname, "..", "ini", "config.ini"));
fs.appendFileSync(path.resolve(__dirname, "..", "ini", "config.ini"), JSON.stringify(projekt) + ",\n");
fs.ensureFileSync(path.resolve(__dirname, "..", "config", projekt, "config_1.ini"));
fs.ensureFileSync(path.resolve(__dirname, "..", "config", projekt, "config_N.ini"));
fs.ensureDirSync(path.resolve(__dirname, "..", "temp", projekt, "tabele"));
console.log(chalk.bgYellow(chalk.black("PAMIĘTAJ ŻE WYKAZ DOSTĘPNYCH CMENTARZY JEST NA PONIŻSZEJ STRONIE")));
console.log(chalk.bgBlack(chalk.yellow("\nhttps://polskie-cmentarze.com/mapa-wdrozen/\n")));
console.log(chalk.bgYellow(chalk.black("..ACZKOLWIEK ISTNIEJE KILKA WERSJI GROBONETU, DLATEGO UWAŻNIE PRZEJDŹ\nPRZEZ TĄ KONFIGURACJĘ, INACZEJ KONWERSJA DO GED ZAKOŃCZY SIĘ FIASKIEM")));
console.log(chalk.bgBlue(chalk.white("\nNIM PRZEJDZIESZ DALEJ ZACHĘCAM ABYŚ ZAPOZNAŁ SIĘ Z DOKUMENTACJĄ")));
console.log(chalk.bgRed(chalk.black("\nPROSZĘ PODAĆ LICZBĘ CMENTARZY KTÓRE MAJĄ ZNALEŹĆ SIĘ W GEDCOM")));
console.log(chalk.bgWhite(chalk.black("\nA NASTĘPNIE UZUPEŁNIJ METRYCZKĘ NA TEMAT SWEGOŻ PLIKU")));
var Q_ileCmentarzy = [
    {
      type: 'list',
      name: 'jedna_TABELA',
      message: '1A) Wybierz liczbę cmentarzy które będziemy importować z spersonalizowanych tabel.',
      choices: ['0','1','2','3','4','5','6','7','8','9','10'],
      filter: function(val) {
        return parseInt(val);
      }
    },
    {
      type: 'list',
      name: 'wiele_TABEL',
      message: '1B) Wybierz liczbę cmentarzy dla których nie można pobrać spersonalizowanych tabel.',
      choices: ['0','1','2','3','4','5','6','7','8','9','10'],
      filter: function(val) {
        return parseInt(val);
      }
    },
    {
        type: 'input',
        name: 'ged_nazwa',
        message: '\n\n1C) PODAJ NAZWE PLIKU GEDCOM, NIE UŻYWAJĄC POLSKICH ZNAKÓW,\n PAMIĘTAJ ZE DATA UTWORZENIA PLIKU BĘDZIE JEGO SUFIKSEM (gedcom)'
      },
      {
          type: 'input',
          name: 'ged_cel',
        message: '1D) PODAJ ZWIĘŹLE GŁÓWNE PRZEZNACZENIE GENEROWANEGO PLIKU \nMAX 50 ZNAKÓW (gedcom target)'
      },
      {
          type: 'input',
          name: 'ged_ueser',
        message: '1E) PODAJ SWÓJ ADRES EMAIL (gedcom username)',
        filter: function(val) {
            return val.split("@").join("@@");
          }
      }
  ];
  inquirer.prompt(Q_ileCmentarzy).then(answers => {
    fs.appendFileSync(path.resolve(__dirname, "..", "config", projekt, "config.ini"), JSON.stringify(answers, null, "\t") + ",\n");
    
    console.log(chalk.bgYellow(chalk.black("UTWORZONO NOWY PROJEKT")));
    console.log(chalk.bgBlack(chalk.yellow("\n"+projekt+"\n")));
    
    let jedna_TABELA_i = 1, wiele_TABEL_i=1;
    if (answers.jedna_TABELA>0) {
        while (jedna_TABELA_i<=answers.jedna_TABELA) {
            fs.appendFileSync(config_BAT, "node scripts/config_1_tab.js "+ projekt+" " +jedna_TABELA_i+ "\n");
            jedna_TABELA_i++;
        }        
    }
    if (answers.wiele_TABEL>0) {
        while (wiele_TABEL_i<=answers.wiele_TABEL) {
            fs.appendFileSync(config_BAT, "node scripts/config_N_tab.js "+ projekt+" " +wiele_TABEL_i+ "\n");        
            wiele_TABEL_i++;
        }        
    }       
  });
  (async () => {
    const delay = time => new Promise(res => setTimeout(() => res(), time));  
    await delay(5000);
    console.log("..");
  })();
