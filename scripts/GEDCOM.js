const
    fs = require('fs-extra'),
    path = require('path'),
    moment = require("moment"),
    DataTeraz = new Date(),
    chalk = require("chalk");
    let LOKALIZACJA = "";
    const V = (function() {
        let JSONversion = JSON.parse(["[", (fs.readFileSync(path.resolve(__dirname, "..", "ini", "config.ini"), "utf8")).slice(0, -2), "]"].join(""));
        return JSONversion[JSONversion.length - 1];
    }());
    const DB =  JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "temp", V, "GEDCOM.json"), "utf8"));
    Object.prototype.GEDCOM = function () {
        const ADRES = path.resolve(this.valueOf().GedCom_EXPORT, [this.valueOf().GedCom_NAME.replace(/ /g, "_"), moment.utc(DataTeraz).format("[v]GGWWE[-]HHmm"), "ged"].join("."));        
        LOKALIZACJA = ADRES;
        fs.ensureFileSync(ADRES);
        fs.appendFileSync(ADRES, "0 HEAD\n1 GEDC\n2 VERS 5.5.1\n2 FORM LINEAGE-LINKED\n1 CHAR UTF-8\n1 LANG Polish\n1 SOUR CISOWSCY\n2 NAME GROBONET JSONtoGEDCOM\n2 VERS 1.0.0-beta.1\n2 CORP Cisowscy.com\n3 ADDR http://MyHeritage.Cisowscy.com\n2 _RTLSAVE RTL\n1 SUBM @U1@\n1 DEST "+this.valueOf().GedCom_TARGET+"\n1 DATE "+ moment.utc(DataTeraz).format("D MMM YYYY").toUpperCase()+ "\n2 TIME "+ moment.utc(DataTeraz).format("HH:mm:ss")+ "\n2 _TIMEZONE GMT+2\n1 _DESCRIPTION_AWARE Y\n0  _PUBLISH\n1 _USERNAME "+this.valueOf().GedCom_USERNAME+"\n1 _DISABLED Y\n0 @U1@ SUBM\n1 RIN MH:U1\n");
        let S = 1;
        let SOUR = {};
        this.valueOf().INCLUDE.forEach(cmentarz => {
            SOUR[cmentarz[1]] = [cmentarz[2], {}];
            cmentarz[0].forEach(grob => {
                if (!SOUR[cmentarz[1]][1].hasOwnProperty(grob.BURI)){
                    SOUR[cmentarz[1]][1][grob.BURI]= S;
                    S++;
                } 
            });
        });
        let IF = 1;
        let SC = 1;
        let LP_Grob_korekta = 0;
        for (let c = 1; c <= this.valueOf().INCLUDE.length; c++) {
            const cmentarz = this.valueOf().INCLUDE[c-1];
            for (let gi = 1; gi <= cmentarz[0].length; gi++) {
                const g = LP_Grob_korekta + gi;
                const grob = cmentarz[0][gi-1];
                fs.appendFileSync(ADRES, "0 @I"+g+"@ INDI\n1 RIN MH:I"+g+"\n1 _UPD "+moment.utc(DataTeraz).format("D MMM YYYY HH:mm:ss [GMT+2]").toUpperCase()+"\n1 NAME "+grob.GIVN+" /"+grob.SURN+"/\n2 GIVN "+grob.GIVN+"\n2 SURN "+grob.SURN+"\n1 SEX "+grob.SEX+"\n");
                if(grob.BIRT ===""){
                    fs.appendFileSync(ADRES, "1 BIRT\n2 RIN MH:IF"+IF+"\n");
                    IF++;
                } else {
                        fs.appendFileSync(ADRES, "1 BIRT\n2 RIN MH:IF"+IF+"\n2 DATE "+grob.BIRT+"\n");
                        IF++;
                }
                if(grob.DEAT ===""){
                        fs.appendFileSync(ADRES, "1 DEAT\n2 RIN MH:IF"+IF+"\n");
                        IF++;
                        fs.appendFileSync(ADRES, "1 BURI\n2 RIN MH:IF"+IF+"\n2 PLAC "+cmentarz[3]+"\n2 SOUR @S"+SOUR[cmentarz[1]][1][grob.BURI]+"@\n3 RIN MH:SC"+SC+"\n3 QUAY 4\n2 NOTE "+grob.BURI+"\n3 _DESCRIPTION Y\n");
                        SC++;
                } else {
                        fs.appendFileSync(ADRES, "1 DEAT\n2 RIN MH:IF"+IF+"\n2 DATE "+grob.DEAT+"\n");
                        IF++;
                        fs.appendFileSync(ADRES, "1 BURI\n2 RIN MH:IF"+IF+"\n2 DATE ABT "+grob.DEAT+"\n2 PLAC "+cmentarz[3]+"\n2 SOUR @S"+SOUR[cmentarz[1]][1][grob.BURI]+"@\n3 RIN MH:SC"+SC+"\n3 QUAY 4\n2 NOTE "+grob.BURI+"\n3 _DESCRIPTION Y\n");
                        SC++;
                }                
            }
            LP_Grob_korekta += cmentarz[0].length;            
        }
        this.valueOf().INCLUDE.forEach(cmentarz => {
            fs.appendFileSync(ADRES, "0 @R"+cmentarz[1]+"@ REPO\n1 RIN MH:R"+cmentarz[1]+"\n1 NAME GROBONET "+cmentarz[2]+"\n"); 
        }); 
        for (const cmentarz in SOUR) {
            if (SOUR.hasOwnProperty(cmentarz)) {
                for (const grob in SOUR[cmentarz][1]) {
                    if (SOUR[cmentarz][1].hasOwnProperty(grob)) {                        
                            fs.appendFileSync(ADRES, "0 @S"+ SOUR[cmentarz][1][grob]+"@ SOUR\n1 RIN MH:S"+ SOUR[cmentarz][1][grob]+"\n1 TITL "+SOUR[cmentarz][0]+": "+grob+"\n1 REPO @R"+cmentarz+"@\n");      
                    }
                }                         
            }
    }      
        fs.appendFileSync(ADRES, "0 TRLR\n");
}; 
DB.GEDCOM();
console.log(chalk.bgWhite(chalk.black("                                               ")));
console.log(chalk.bgWhite(chalk.black("                            ▓▒                 ")));
console.log(chalk.bgWhite(chalk.black("                             ░                 ")));
console.log(chalk.bgWhite(chalk.black(" ██ ▄█▀ ▒█████   ███▄    █  ██▓▓█████  ▄████▄  ")));
console.log(chalk.bgWhite(chalk.black(" ██▄█▒ ▒██▒  ██▒ ██ ▀█   █ ▓██▒▓█   ▀ ▒██▀ ▀█  ")));
console.log(chalk.bgWhite(chalk.black("▓███▄░ ▒██░  ██▒▓██  ▀█ ██▒▒██▒▒███   ▒▓█    ▄ ")));
console.log(chalk.bgWhite(chalk.black("▓██ █▄ ▒██   ██░▓██▒  ▐▌██▒░██░▒▓█  ▄ ▒▓▓▄ ▄██▒")));
console.log(chalk.bgWhite(chalk.black("▒██▒ █▄░ ████▓▒░▒██░   ▓██░░██░░▒████▒▒ ▓███▀ ░")));
console.log(chalk.bgWhite(chalk.black("▒ ▒▒ ▓▒░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ░▓  ░░ ▒░ ░░ ░▒ ▒  ░")));
console.log(chalk.bgWhite(chalk.black("░ ░▒ ▒░  ░ ▒ ▒░ ░ ░░   ░ ▒░ ▒ ░ ░ ░  ░  ░  ▒   ")));
console.log(chalk.bgWhite(chalk.black("░ ░░ ░ ░ ░ ░ ▒     ░   ░ ░  ▒ ░   ░   ░        ")));
console.log(chalk.bgWhite(chalk.black("░  ░       ░ ░           ░  ░     ░  ░░ ░      ")));
console.log(chalk.bgWhite(chalk.black("                                      ░        ")));
console.log(chalk.bgWhite(chalk.black("                                               ")));
console.log(chalk.bgWhite(chalk.black("Z SUKCESEM* (PRAWDOPODOBNIE), WYGENEROWANO PLIK")));
console.log(chalk.bgWhite(chalk.black("GEDcom: ")+chalk.blue(LOKALIZACJA)));
   console.log(chalk.bgWhite(chalk.red("  !! PAMIĘTAJ O PRAWACH AUTORSKICH GROBONETu   ")));
   console.log(chalk.bgWhite(chalk.red("  !! PAMIĘTAJ O USTAWIE O OCHRONIE DANYCH      ")));
   console.log("\nUWAGA PRZY NASTĘPNYM URUCHOMIENIU, OBECNY FOLDER RELEASE    \nNIE ZOZSTANIE ZMODYFIKOWANY, ACZKOLWIEK FOLDERY ROBOCZE         \nTEMP i CONFIG ZOSTANĄ WYZEROWANE, WSZELKIE UWAGI I BŁĘDY          \nPROSZĘ NADYSYŁAĆ NA 4GEN@CISOWSCY.COM Z DOPISKIEM GROBONET");


