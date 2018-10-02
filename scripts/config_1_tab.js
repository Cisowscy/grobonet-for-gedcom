const
    fs = require('fs-extra'),
    path = require('path'),
    chalk = require("chalk"),
    chalkPipe = require('chalk-pipe'),
    inquirer = require('inquirer'),
    HtmlTableToJson = require('html-table-to-json');

Object.prototype.TABLE2JSON = function (adresURL) {
    if (arguments.length === 1) {
        let NOWY = fs.createWriteStream(adresURL, {
            flags: 'w'
        });
        NOWY.write(JSON.stringify(new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0], null, "\t"));
    }
    return new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0];
};
function GET_BAT_PARAM(X) {
    var Q_configTAB = [{
            type: 'input',
            name: 'Adres_Cmentarza',
            message: '\nA.' + X[1] + '.I) OTWÓRZ GOOGLE LUB INNĄ WYSZUKIWARKĘ I SKOPIUJ ADRES CMENTARZA\n\nPodążaj za przykładem: ul. Panewnicka 45, Ligota, Katowice, Polska:\n\n',
        },
        {
            type: 'input',
            name: 'Nazwa_Cmentarza',
            message: '\nA.' + X[1] + '.II) PODAJ KRÓTKĄ NAZWĘ CMENTARZA (NIE UŻYWAJĄC WYRAZÓW POCHODNYCH OD „CMENTARZ” \nnp.: Katowice-Ligota, lub: Katowice-Ligota (Panewnicka):\n\n',
        },
        {
            type: 'confirm',
            name: 'TabelaJest',
            message: '\nA.' + X[1] + '.III) Otwórz teraz wskazany powyżej plik, i wklej do niego skopiowaną tabelę,\na następnie zapisz go , zaznacz opcje true ”Y”, i przejdź do kolejnej pozycji  \naby wiedzieć jak to poprawnie wykonać zapoznaj się z dokumentacją.\n\n',
            default: false
        }
    ];
    fs.ensureFileSync(path.resolve(__dirname, "..", "temp", X[0], "tabele", "cmentarz_" + X[1] + ".txt"));
    console.log(chalk.bgRed(chalk.black("\nUTWORZONO PLIK DLA KROKU III) \n\nAdres:")), chalk.bgYellow(chalk.black(path.resolve(__dirname, "..", "temp", X[0], "tabele", "cmentarz_" + X[1] + ".txt"))) + "\n\n");
    inquirer.prompt(Q_configTAB).then(answers => {
        let ADR = ["..", "temp", X[0], "tabele", "cmentarz_" + X[1]].join("//");
        answers["plikTabeli"] = path.resolve(__dirname,  ADR+ ".txt");
        answers["cmentarz"]=X[1];
        answers["plik"]=path.resolve(__dirname, ADR+".json.log");
        let tabelka =  fs.readFileSync(path.resolve(__dirname, ADR + ".txt"));               
        
    fs.ensureFileSync(path.resolve(__dirname, ADR + ".json.log"));
    fs.appendFileSync(path.resolve(__dirname, ADR + ".json.log"), JSON.stringify(tabelka.TABLE2JSON())+",\n");
        fs.appendFileSync(path.resolve(__dirname, "..", "config", X[0], "config_1.ini"), JSON.stringify(answers, null, "\t") + ",\n");
    });

}

GET_BAT_PARAM(process.argv.splice(process.execArgv.length + 2).filter(el => el.substr(0, 2) != '--'));