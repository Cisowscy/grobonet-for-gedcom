const 
    fs = require('fs-extra'),
    path = require('path'),
    moment = require("moment"),
    async = require("async"),
    chalk = require("chalk"),
    chalkPipe = require('chalk-pipe'),
    inquirer = require('inquirer');
    const RAMMAX = parseInt(fs.readFileSync(path.resolve(__dirname, "..", "ini", "memory.ini")));


    function GET_BAT_PARAM(X) {        
        var Q_configTAB = [
            {
            type: 'input',
            name: 'Adres_Cmentarza',
            message: '\nB.'+X[1]+'.I) OTWÓRZ GOOGLE LUB INNĄ WYSZUKIWARKĘ I SKOPIUJ ADRES CMENTARZA\n\nPodążaj za przykładem: ul. Panewnicka 45, Ligota, Katowice, Polska:\n\n'      
            },
            {
                type: 'input',
                name: 'Nazwa_Cmentarza',
                message: '\nB.'+X[1]+'.II) PODAJ KRÓTKĄ NAZWĘ CMENTARZA (NIE UŻYWAJĄC WYRAZÓW POCHODNYCH OD „CMENTARZ” \nnp.: Katowice-Ligota, lub: Katowice-Ligota (Panewnicka):\n\n'      
            },
            {
                type: 'input',
                name: 'Ilosc_Stron',
                message: '\nB.'+X[1]+'.III) PODAJ LICZBE STRON:\n\n'
            },
            {
                type: 'input',
                name: 'URL_Strony',
                message: '\nB.'+X[1]+'.IV) PODAJ ADRES URL DOWOLNEJ STRONY, UPEWNIJ SIĘ ABY NA KOŃCU BYŁ ZNAK RÓNOŚCI I JAKAŚ LICZBA: \n\n',
                filter: function(val) {
                  return val.slice(0, val.lastIndexOf("=")+1);
                }
            }
        ];
        const skrobacz_BAT = path.resolve(__dirname, "..", "temp", "skrobanie.bat"); 
          
           
            inquirer.prompt(Q_configTAB).then(answers => {
                let adresy = [];
                let s = parseInt(answers.Ilosc_Stron);
                
               // ensureDir(path.resolve(__dirname, "..", "temp", X[0], "strony","cmentarz_"+X[1]));
                for (let i = 1; i <= parseInt(answers.Ilosc_Stron); i++) {                    
                    let a = {
                        str: i,
                        plik: path.resolve(__dirname, "..", "temp", X[0], "strony","cmentarz_"+X[1], ["wykaz.table", i, "html"].join(".")),
                        www: answers.URL_Strony+i,
                        czas: " "+Math.floor(s*1.25/60)+" min "+ Math.ceil((s*1.25)-(Math.floor(s*1.25/60)*60))+" sek "
                    };
                    s--;
                    //fs.ensureFile(a.plik);
                    adresy.push(a);
                    fs.appendFileSync(skrobacz_BAT, "node scripts/skrobanie.js "+ X[0]+" "+ X[1]+" "+ i+ " --max_old_space_size="+RAMMAX+"\n");
                }
                fs.ensureFile(path.resolve(__dirname, "..", "temp", X[0], "strony","cmentarz_"+X[1]+".json.log"));
                answers["stronyTabeli"]=adresy;
                answers["projekt"]=X[0];
                answers["cmentarz"]=X[1];
                answers["plik"]=path.resolve(__dirname, "..", "temp", X[0], "strony","cmentarz_"+X[1]+".json.log");
                fs.appendFileSync(path.resolve(__dirname, "..", "config", X[0], "config_N.ini"), JSON.stringify(answers, null, "\t") + ",\n");                
              });
    }
    
    GET_BAT_PARAM(process.argv.splice(process.execArgv.length+2).filter(el => el.substr(0,2) != '--'));