// ? #########################################################################
// ? #####                    MODUŁY ZEWNĘTRZNE                          #####
// ? #########################################################################
require('core-js');
const fs = require('fs-extra');
const path = require("path");
const si = require('systeminformation');
const chalk = require("chalk");
const {
    DateTime
} = require('luxon');
const anyBase = require('any-base');
const readdirp = require('readdirp');
const request = require('request');
const cheerio = require('cheerio');
//const inquirer = require('inquirer');
const HtmlTableToJson = require('html-table-to-json');
// ? #########################################################################
// ? #####                         KONFIGURACJA                          #####
// ? #########################################################################
//! CZY KODOWAC ID OPERACJI? DO : ⰀⰁⰂⰃⰄⰅⰆⰇⰈⰉⰊⰋⰌⰍⰎⰏⰐⰑⰒⰓⰔⰕⰖⰗⰘⰙⰚⰛⰜⰝⰞⰟⰠⰡⰢⰣⰤⰥⰦⰧⰨⰩⰪⰫⰬⰭⰮ
const on_off_SZYFR = false;
const START_CZAS = DateTime.local().setLocale('pl-PL');
let START_NUMER = 0;
// ? #########################################################################
// ? #####                         KOD PROGRAMU                          #####
// ? #########################################################################
ROZSZERZENIA_POWLOKI_JS();
INTRO();
CZYSZCZENIE();
// * #########################################################################
MAX_RAM(0.75);
const db = NOWY_PROJEKT(START_CZAS);
SPRAWDZAM_DOSTEPNE_CMENTARZE();
//console.log(db);
//console.log("ⰀⰁⰂⰃⰄⰅⰆⰇⰈⰉⰊⰋⰌⰍⰎⰏⰐⰑⰒⰓⰔⰕⰖⰗⰘⰙⰚⰛⰜⰝⰞⰟⰠⰡⰢⰣⰤⰥⰦⰧⰨⰩⰪⰫⰬⰭⰮ");
//setTimeout(function () {  
//    console.log(chalk.bgBlue(chalk.white("THE END")));   
//}, 25000); 
// ? #########################################################################
// ? #####                       FUNKCJE PROGRAMU                        #####
// ? #########################################################################

function ROZSZERZENIA_POWLOKI_JS() {
    Object.prototype.JSON_z = function (JSON_wsad) {
        let NOWY = fs.createWriteStream(this.valueOf(), {
                flags: 'w'
        });
        NOWY.write(JSON.stringify(JSON_wsad));
};
    Object.prototype.wdrukujJSON = function (TYP_OPERACJI, ZAWARTOSC) {
        switch (TYP_OPERACJI) {
            case "NADPISZ":
                if (fs.existsSync(this.valueOf())) {
                    fs.removeSync(this.valueOf());
                }
                fs.ensureFileSync(this.valueOf());
                fs.appendFileSync(this.valueOf(), new String(JSON.stringify(ZAWARTOSC) + ",\n"));
                break;
            case "DOPISZ":
                fs.ensureFileSync(this.valueOf());
                fs.appendFileSync(this.valueOf(), new String(JSON.stringify(ZAWARTOSC) + ",\n"));
                break;
        }
    }
    Object.prototype.wdrukujTEXT = function (TYP_OPERACJI, ZAWARTOSC) {
        switch (TYP_OPERACJI) {
            case "NADPISZ":
                if (fs.existsSync(this.valueOf())) {
                    fs.removeSync(this.valueOf());
                }
                fs.ensureFileSync(this.valueOf());
                fs.appendFileSync(this.valueOf(), ZAWARTOSC);
                break;
            case "DOPISZ":
                fs.ensureFileSync(this.valueOf());
                fs.appendFileSync(this.valueOf(), ZAWARTOSC);
                break;
        }
    }
    Object.prototype.wdrukujFOLDER = function (TYP_OPERACJI) {
        switch (TYP_OPERACJI) {
            case "NADPISZ":
                if (fs.existsSync(this.valueOf())) {
                    fs.removeSync(this.valueOf());
                }
                fs.ensureDirSync(this.valueOf());
                break;
            case "UTWORZ":
                fs.ensureDirSync(this.valueOf());
                break;
        }
    }
    Object.prototype.wczytajWERSY = function (CO_WCZYTAC) {
        let znaki = fs.readFileSync(this.valueOf(), "utf8");
        let wersy = znaki.charAt(znaki.length - 1) === "," ? JSON.parse(["[", znaki.slice(0, -1), "]"].join("")) : JSON.parse(["[", znaki.slice(0, -2), "]"].join(""));
        // let wersy = JSON.parse(["[", (fs.readFileSync(this.valueOf(), "utf8")).slice(0, -2), "]"].join(""));
        let zwrot;
        switch (CO_WCZYTAC) {
            case "PIERWSZY":
                zwrot = [wersy[0]];
                break;
            case "WSZYSTKIE":
                zwrot = wersy;
                break;
            case "OSTATNI":
                zwrot = [wersy[wersy.length - 1]];
                break;
            case "POPRZEDNI":
                try {
                    zwrot = [wersy[wersy.length - 2]];
                } catch (error) {
                    zwrot = [wersy[wersy.length - 1]];
                }
                break;
            default:
                if (typeof CO_WCZYTAC === "number") {
                    zwrot = [wersy[CO_WCZYTAC]];
                } else {
                    zwrot = wersy;
                }
                break;
        }
        return zwrot;
    }
    Object.prototype.KOLOR = function (Typ_Komunikatu, czyNaglowek) {
        //! Typ_Komunikatu: "ERROR" | "UWAGA" | "INFO" | "SUKCES" | "RAPORT"
        if (czyNaglowek) {
            switch (Typ_Komunikatu) {
                case "ERROR":
                    return chalk.bgRedBright(chalk.black(" " + this.valueOf() + " "));
                    break;
                case "UWAGA":
                    return chalk.bgYellowBright(chalk.black(" " + this.valueOf() + " "));
                    break;
                case "INFO":
                    return chalk.bgCyanBright(chalk.black(" " + this.valueOf() + " "));
                    break;
                case "SUKCES":
                    return chalk.bgGreen(chalk.black(" " + this.valueOf() + " "));
                    break;
                case "RAPORT":
                    return chalk.bgWhiteBright(chalk.black(" " + this.valueOf() + " "));
                    break;
                default:
                    return chalk.gray(" " + this.valueOf() + " ");
                    break;
            }
        } else {
            switch (Typ_Komunikatu) {
                case "ERROR":
                    return chalk.bgBlack(chalk.redBright(" " + this.valueOf() + " "));
                    break;
                case "UWAGA":
                    return chalk.bgBlack(chalk.yellow(" " + this.valueOf() + " "));
                    break;
                case "INFO":
                    return chalk.bgBlack(chalk.cyanBright(" " + this.valueOf() + " "));
                    break;
                case "SUKCES":
                    return chalk.bgBlack(chalk.greenBright(" " + this.valueOf() + " "));
                    break;
                case "RAPORT":
                    return chalk.bgBlack(chalk.whiteBright(" " + this.valueOf() + " "));
                    break;
                default:
                    return chalk.gray(" " + this.valueOf() + " ");
                    break;
            }
        }
    }
    String.prototype.CMD_RAMKA = function (typ) {
        const O = [{
                L: {
                    T: "╔",
                    B: "╚"
                },
                R: {
                    T: "╗",
                    B: "╝"
                },
                C: {
                    H: "═",
                    V: "║"
                }
            },
            {
                L: {
                    T: "╭",
                    B: "╰"
                },
                R: {
                    T: "╮",
                    B: "╯"
                },
                C: {
                    H: "─",
                    V: "│"
                }
            }
        ];

        let rezult = [
            O[typ].L.T,
            O[typ].C.V + this.valueOf(),
            O[typ].L.B
        ];
        for (let a = 0; a < this.valueOf().toString().length; a++) {
            //if (a !== this.valueOf().toString().length - 1) {
            rezult[0] += O[typ].C.H;
            rezult[2] += O[typ].C.H;
            // } else {
        }
        rezult[0] += O[typ].R.T;
        rezult[1] += O[typ].C.V;
        rezult[2] += O[typ].R.B;
        ///}
        //}
        
        console.log(chalk.bgBlack(chalk.gray(rezult[0])));
        console.log(chalk.bgBlack(chalk.gray(rezult[1])));
        console.log(chalk.bgBlack(chalk.gray(rezult[2])));
        return rezult.join("\n") + "\n";
    }
    Object.prototype.SZYFR = function () {
        const pismo = [
            ["ⰰ", "ⰱ", "ⰲ", "ⰳ", "ⰴ", "ⰵ", "ⰶ", "ⰷ", "ⰸ", "ⰹ", "ⰺ", "ⰻ", "ⰼ", "ⰽ", "ⰾ", "ⰿ", "ⱀ", "ⱁ", "ⱂ", "ⱃ", "ⱄ", "ⱅ", "ⱆ", "ⱇ", "ⱈ", "ⱉ", "ⱊ", "ⱋ", "ⱌ", "ⱍ", "ⱎ", "ⱏ", "ⱐ", "ⱑ", "ⱒ", "ⱓ", "ⱔ", "ⱕ", "ⱖ", "ⱗ", "ⱘ", "ⱙ", "ⱚ", "ⱛ", "ⱜ", "ⱝ", "ⱞ"], "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
        ];
        const liczby = [
            ["Ⰰ", "Ⰱ", "Ⰲ", "Ⰳ", "Ⰴ", "Ⰵ", "Ⰶ", "Ⰷ", "Ⰸ", "Ⰹ", "Ⰺ", "Ⰻ", "Ⰼ", "Ⰽ", "Ⰾ", "Ⰿ", "Ⱀ", "Ⱁ", "Ⱂ", "Ⱃ", "Ⱄ", "Ⱅ", "Ⱆ", "Ⱇ", "Ⱈ", "Ⱉ", "Ⱊ", "Ⱋ", "Ⱌ", "Ⱍ", "Ⱎ", "Ⱏ", "Ⱐ", "Ⱑ", "Ⱒ", "Ⱓ", "Ⱔ", "Ⱕ", "Ⱖ", "Ⱗ", "Ⱘ", "Ⱙ", "Ⱚ", "Ⱛ", "Ⱜ", "Ⱝ", "Ⱞ"], anyBase.DEC
        ];
        let Num = {
            code: anyBase(liczby[1], liczby[0].join("")),
            decode: anyBase(liczby[0].join(""), liczby[1])
        };
        let Str = {
            code: anyBase(pismo[1], pismo[0].join("")),
            decode: anyBase(pismo[0].join(""), pismo[1])
        };
        let TEKSTY = this.valueOf();
        TEKSTY = TEKSTY.toString().split(".");
        if (on_off_SZYFR) {
            if (typeof this.valueOf() === "number") {
                TEKSTY = TEKSTY.map(element => {
                    return Num.code(element);
                });
            } else if (new RegExp(liczby[0].join('|')).test(this.valueOf())) {
                TEKSTY = TEKSTY.map(element => {
                    return Num.decode(element);
                });
            } else if (new RegExp(pismo[0].join('|')).test(this.valueOf())) {
                TEKSTY = TEKSTY.map(element => {
                    return Str.decode(element);
                });
            } else {
                TEKSTY = TEKSTY.map(element => {
                    return Str.code(element);
                });
            }
        }
        return TEKSTY.join(".");
    }
    Object.prototype.KOMUNIKAT = function (KOD, NOTES) {
        /** GLOBALNE ZMIENNE BRANE POD UWAGE
         *  const on_off = false;
         *  const START_CZAS = DateTime.local().setLocale('pl-PL');
         *  let START_NUMER = 0; (ID_P)
         */
        let taNOTA = 0;
        let ileNOT = NOTES.length;
        let taNOTA1 = 0;
        let ileNOT1 = NOTES.length;
        let MOMENT = (function (dt, ID) {
            let T = dt[1].diff(dt[0], ['days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject();
            let A = [" działam ", " dzień i ", " godzinę i ", " minutę i ", " minutę, ", " sekundę, ", " milisekundę, "];
            let OZNACZENIE = ["i kończyłem operację: " + ID[0].SZYFR() + "|" + ID[1].SZYFR() +" "]
            if (T.days === 0 && T.hours === 0 && T.minutes === 0 && T.seconds === 0) {
                return (A[0] + T.milliseconds + A[6] + OZNACZENIE).toString();
            } else if (T.days === 0 && T.hours === 0 && T.minutes === 0) {
                return (A[0] + T.seconds + A[5] + T.milliseconds + A[6] + OZNACZENIE).toString();
            } else if (T.days === 0 && T.hours === 0) {
                return (A[0] + T.minutes + A[3] + T.seconds + A[5] + T.milliseconds + A[6] + OZNACZENIE).toString();
            } else if (T.days === 0) {
                return (A[0] + T.hours + A[2] + T.minutes + A[4] + T.seconds + A[5] + T.milliseconds + A[6] + OZNACZENIE).toString();
            } else {
                return (A[0] + T.days + A[1] + T.hours + A[2] + T.minutes + A[4] + T.seconds + A[5] + T.milliseconds + A[6] + OZNACZENIE).toString();
            }
        }(this.valueOf(), [KOD, START_NUMER]));
        let WYDRUK = MOMENT.CMD_RAMKA(0);
        const wykrzyknienie = "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
        const dziesiecspacji = "          ";
        while (ileNOT > 0) {
            if (taNOTA === 0 && typeof NOTES[taNOTA][0] === "string") {
                WYDRUK += NOTES[taNOTA][0].toUpperCase()+ "\n";
                WYDRUK += dziesiecspacji + dziesiecspacji + NOTES[taNOTA][1].toLowerCase() + "\n\n";
            } else if (taNOTA !== 0 && typeof NOTES[taNOTA][0] === "string") {
                WYDRUK += NOTES[taNOTA][0].toUpperCase()+ "\n";
                WYDRUK += dziesiecspacji + dziesiecspacji + NOTES[taNOTA][1].toLowerCase() + "\n\n";
            } else {
                WYDRUK += wykrzyknienie + "\n" + NOTES[taNOTA][1] + "\n" + wykrzyknienie + "\n";
            }
            ileNOT--;
            taNOTA++;
        }
        WYDRUK += "\n\n\n\n\n";
        const ADR = path.resolve(__dirname, "..", "..", "..", "LOG", START_CZAS + ".txt");
        ADR.wdrukujTEXT("DOPISZ", WYDRUK);
        while (ileNOT1 > 0) {
            if (taNOTA1 === 0 && typeof NOTES[taNOTA1][0] === "string") {
                console.log(NOTES[taNOTA1][1].toUpperCase().KOLOR(NOTES[taNOTA1][0], true) + "\n");
            } else if (taNOTA1 !== 0 && typeof NOTES[taNOTA1][0] === "string") {
                console.log(NOTES[taNOTA1][1].toUpperCase().KOLOR(NOTES[taNOTA1][0], false) + "\n");
            } else {
                console.log(chalk.redBright(wykrzyknienie));
                console.error(NOTES[taNOTA1][1]);
                console.log(chalk.redBright(wykrzyknienie));
            }
            ileNOT1--;
            taNOTA1++;
        }
        //let ii = this.valueOf()[2];
        //if (ii) {
        //    console.log(chalk.redBright(chalk.black("Uprzejmie proszę o cierpliwość, przetwarzam ogromną ilość danych, którą gdyby Państwo chcieli przetworzyć ręcznie, proces ten trwałby nie kilka minut, lecz kilka tygodni!"))); 
        //} 
        START_NUMER++;
    }
    Array.prototype.inArray = function (comparer) {
        for (var i = 0; i < this.length; i++) {
                if (comparer(this[i])) return true;
        }
        return false;
    };
    Array.prototype.pushIfNotExist = function (element, comparer) {
        if (!this.inArray(comparer)) {
                this.push(element);
        }
    };
    Object.prototype.TABLE2JSON = function (variant) {
        /*if (arguments.length === 1) {
            let NOWY = fs.createWriteStream(adresURL, {
                flags: 'w'
            });
            
            NOWY.write(JSON.stringify(new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0], null, "\t"));
        }*/
        switch (variant) {
            case "A":
            return new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0];
                break; 
            case "B":
            return new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0][0];
                break;
        }
        
    };


}
function INTRO() {
    const LOGO = [
        "   _____ _____   ____  ____   ____  _   _ ______ _______              ",
        "  / ____|  __ \\ / __ \\|  _ \\ / __ \\| \\ | |  ____|__   __|             ",
        " | |  __| |__) | |  | | |_) | |  | |  \\| | |__     | |                ",
        " | | |_ |  _  /| |  | |  _ <| |  | | . ` |  __|    | |                ",
        " | |__| | | \\ \\| |__| | |_) | |__| | |\\  | |____   | |                ",
        ["  \\_____|_|","__","\\_\\\\____/|____/","_","\\____/|_|","_","\\_|______|","__","|_|","__  __  __      "],
        [" |  ____/ __ \\|  __ \\ ","  / ____|  ____|  __ \\ / ____/ __ \\|  \\/  |     "],
        [" | |__ | |  | | |__) |"," | |  __| |__  | |  | | |   | |  | | \\  / |     "],
        [" |  __|| |  | |  _  / "," | | |_ |  __| | |  | | |   | |  | | |\\/| |     "],
        [" | |   | |__| | | \\ \\ "," | |__| | |____| |__| | |___| |__| | |  | |     "],
        [" |_|    \\____/|_|  \\_\\ "," \\_____|______|_____/ \\_____\\____/|_|  |_|   ","_ "],
        [" | |                | ||  __ \\  / ____","(_)","                     | |  ","(_)"],
        " | |__  _   _       | || |__) || |     _ ___  _____      _____| | ___ ",
        " | '_ \\| | | |  _   | ||  _  / | |    | / __|/ _ \\ \\ /\\ / / __| |/ / |",
        " | |_) | |_| | | |__| || | \\ \\ | |____| \\__ \\ (_) \\ V  V /\\__ \\   <| |",
        [" |_.__/ \\__, |  \\____","(_)","_|  \\_","(_)","_____|_|___/\\___/ \\_/\\_/ |___/_|\\_\\_|"],
        "         __/ |                                                        ",
        "        |___/                                                         "
    ];
    console.log(chalk.bgBlack(chalk.red(LOGO[0])));
    console.log(chalk.bgBlack(chalk.red(LOGO[1])));
    console.log(chalk.bgBlack(chalk.red(LOGO[2])));
    console.log(chalk.bgBlack(chalk.red(LOGO[3])));
    console.log(chalk.bgBlack(chalk.red(LOGO[4])));
    console.log(chalk.bgBlack(chalk.red(LOGO[5][0]) + chalk.yellow(LOGO[5][1]) + chalk.red(LOGO[5][2]) + chalk.green(LOGO[5][3]) + chalk.red(LOGO[5][4]) + chalk.green(LOGO[5][5]) + chalk.red(LOGO[5][6]) + chalk.green(LOGO[5][7])+ chalk.red(LOGO[5][8]) + chalk.green(LOGO[5][9])));
    console.log(chalk.bgBlack(chalk.yellow(LOGO[6][0]) + chalk.green(LOGO[6][1])));
    console.log(chalk.bgBlack(chalk.yellow(LOGO[7][0]) + chalk.green(LOGO[7][1])));
    console.log(chalk.bgBlack(chalk.yellow(LOGO[8][0]) + chalk.green(LOGO[8][1])));
    console.log(chalk.bgBlack(chalk.yellow(LOGO[9][0]) + chalk.green(LOGO[9][1])));
    console.log(chalk.bgBlack(chalk.yellow(LOGO[10][0]) + chalk.green(LOGO[10][1]) + chalk.white(LOGO[10][2])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[11][0]) + chalk.white(LOGO[11][1]) + chalk.blue(LOGO[11][2]) + chalk.white(LOGO[11][3])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[12])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[13])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[14])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[15][0]) + chalk.white(LOGO[15][1]) + chalk.blue(LOGO[15][2]) + chalk.white(LOGO[15][3]) + chalk.blue(LOGO[15][4])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[16])));
    console.log(chalk.bgBlack(chalk.blue(LOGO[17])));
    let Zapisz ="";
Zapisz += "     _____ _____   ____  ____   ____  _   _ ______ _______                 \n";
Zapisz += "    / ____|  __ \\ / __ \\|  _ \\ / __ \\| \\ | |  ____|__   __|                \n";
Zapisz += "   | |  __| |__) | |  | | |_) | |  | |  \\| | |__     | |                   \n";
Zapisz += "   | | |_ |  _  /| |  | |  _ <| |  | | . ` |  __|    | |                   \n";
Zapisz += "   | |__| | | \\ \\| |__| | |_) | |__| | |\\  | |____   | |                   \n";
Zapisz += "    \\_____|_|__\\_\\\\____/|____/_\\____/|_|_\\_|______|__|_|__  __  __         \n";
Zapisz += "   |  ____/ __ \\|  __ \\   / ____|  ____|  __ \\ / ____/ __ \\|  \\/  |        \n";
Zapisz += "   | |__ | |  | | |__) | | |  __| |__  | |  | | |   | |  | | \\  / |        \n";
Zapisz += "   |  __|| |  | |  _  /  | | |_ |  __| | |  | | |   | |  | | |\\/| |        \n";
Zapisz += "   | |   | |__| | | \\ \\  | |__| | |____| |__| | |___| |__| | |  | |        \n";
Zapisz += "   |_|    \\____/|_|  \\_\\  \\_____|______|_____/ \\_____\\____/|_|  |_|   _    \n";
Zapisz += "   | |                | ||  __ \\  / ____(_)                     | |  (_)   \n";
Zapisz += "   | |__  _   _       | || |__) || |     _ ___  _____      _____| | ___    \n";
Zapisz += "   | '_ \\| | | |  _   | ||  _  / | |    | / __|/ _ \\ \\ /\\ / / __| |/ / |   \n";
Zapisz += "   | |_) | |_| | | |__| || | \\ \\ | |____| \\__ \\ (_) \\ V  V /\\__ \\   <| |   \n";
Zapisz += "   |_.__/ \\__, |  \\____(_)_|  \\_(_)_____|_|___/\\___/ \\_/\\_/ |___/_|\\_\\_|   \n";
Zapisz += "           __/ |                                                           \n";
Zapisz += "          |___/                                                            \n";
Zapisz +=   

    Zapisz += "\n\n\n\n\n";
        const ADR = path.resolve(__dirname, "..", "..", "..", "LOG", START_CZAS + ".txt");
        ADR.wdrukujTEXT("DOPISZ", Zapisz);
}

function CZYSZCZENIE() {
    if (fs.existsSync(path.resolve(__dirname, "..", "..", "temp"))) {
        fs.removeSync(path.resolve(__dirname, "..", "..", "temp"));
    }
    
}
async function MAX_RAM(PROC) {
    const ADR = path.resolve(__dirname, "..", "..", "temp", "RAM.ini");
    try {
        const data = await si.mem();
        let size = Math.ceil((data.total / 1024 / 1024) * PROC);
        ADR.wdrukujJSON("NADPISZ", size);
        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("1.D", [
            ["SUKCES", "Z SUKCESEM PRZETWORZONO PARAMETRY ŚRODOWISKA"]
        ]);
    } catch (e) {
        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("1.E", [
            ["ERROR", "FIASKO POBORU PARAMETRÓW ŚRODOWISKA"],
            [null, e]
        ]);
    }
}

function NOWY_PROJEKT(TERAZ) {
    const ADR = path.resolve(__dirname, "..", "..", "temp", "START.ini");
    try {
        ADR.wdrukujJSON("DOPISZ", TERAZ);
        (ADR.slice(0, ADR.lastIndexOf("\\") + 1) + TERAZ).wdrukujFOLDER("NADPISZ");
        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("2.D", [
            ["SUKCES", "Z SUKCESEM UTWORZONO NOWY PROJEKT OZNACZONY DATĄ:"],
            ["SUKCES", TERAZ.toSQL({
                includeZone: true
            })]
        ]);
        return ADR.slice(0, ADR.lastIndexOf("\\") + 1) + TERAZ;
    } catch (e) {
        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("2.E", [
            ["ERROR", "NIE POWIODŁO SIĘ UTWORZENIE NOWEGO PROJEKTU"],
            [null, e]
        ]);
    }
}

function SPRAWDZAM_DOSTEPNE_CMENTARZE() {
    const METRYCZKA5INFO = [
        ["UWAGA", "UTWÓRZ METRYCZKĘ (LUB SKORYGUJ OBECNĄ) I URUCHOM APLIKACJĘ PONOWNIE!"],
        ["RAPORT", "(DLA WARIANTU A) UTWÓRZ PLIKI: 'TABELA.html.txt', ORAZ 'METRYCZKA.json.txt' A W NIM  NP.:"],
        ["INFO", "'EDYCJA': '2018-10-01T12:45'\n, 'ADRES': 'ul. Panewnicka 45, Ligota, Katowice, Polska'"],
        ["RAPORT", "(DLA WARIANTU B) UTWÓRZ PLIK: 'METRYCZKA.json.txt' A W NIM  NP.:"],
        ["INFO", "'EDYCJA': '2018-10-01T12:45'\n, 'ADRES': 'ul. Leopolda, Bogucice, Katowice, Polska'\n, 'STRONY': '452'\n, 'TABELA': 'http://katowicebonifratrow.artlookgallery.com/grobonet/start.php?id=wyniki&rur=&mur=&dur=&rzg=&mzg=&dzg=&name=&imie=&nazwisko=&sektor=&rzad=&numer=&cmentarz=Cmentarz+Bonifratrow&sort=1&widok=tabela&ppstrona=452'"],
        ["UWAGA", "ZAPOZNAJ SIĘ W DOKUMENTACJI v1.0 Z SZCZEGÓŁAMI NA TEMAT PRZYGOTOWYWANIA DANYCH (https://cisowscy.github.io/grobonet-for-gedcom/)"]
    ];
    const MASKA = {
        cmentarze: {
            root: path.join(path.resolve(__dirname, "..", "..", "..", "ŹRÓDŁA")),
            entryType: 'directories',
            depth: 0
        }
    }
    readdirp(MASKA.cmentarze)
        .on("data", function (entry) {
            try {
                let metryczka = WCZYTAJ_METRYCZKE(entry.fullPath + "\\METRYCZKA.json.txt");
                // DANE OUTPUT
                let jestJSONtabela = fs.existsSync(entry.fullPath + "\\TABELA.log.json") && (fs.statSync(entry.fullPath + "\\TABELA.log.json")["size"] / 1000.0) > 0 ? true : false;
                let jestJSONmetryczka = fs.existsSync(entry.fullPath + "\\METRYCZKA.log.json") && (fs.statSync(entry.fullPath + "\\METRYCZKA.log.json")["size"] / 1000.0) > 0 ? true : false;
                // DANE INPUT OGOLNE
                let jestEDYCJA = metryczka.hasOwnProperty("EDYCJA") && metryczka["EDYCJA"] !== "" ? true : false;
                let jestADRES = metryczka.hasOwnProperty("ADRES") && metryczka["ADRES"] !== "" ? true : false;
                // DANE INPUT WARIANT A
                let jestTABELA_A = fs.existsSync(entry.fullPath + "\\TABELA.html.txt") && (fs.statSync(entry.fullPath + "\\TABELA.html.txt")["size"] / 1000.0) > 0 ? true : false;
                // DANE INPUT WARIANT B
                let jestSTRONY_B = metryczka.hasOwnProperty("STRONY") && metryczka["STRONY"] !== "" ? true : false;
                let jestTABELA_B = metryczka.hasOwnProperty("TABELA") && metryczka["TABELA"] !== "" ? true : false;
                let saTABELE_B = (function (){
                    let wynik = [];
                    try {
                        for (let i = 1; i <= metryczka.STRONY; i++) {
                            let element = (fs.existsSync(entry.fullPath+"\\TABELA\\"+i+".html.txt") && (fs.statSync(entry.fullPath+"\\TABELA\\"+i+".html.txt")["size"] / 1000.0) > 0) ? true : false;
                            wynik.pushIfNotExist(element, function (e) {            
                                return e === element;
                            });
                        }
                        return (wynik.length===1 && wynik[0] === true) ? true : false;
                    } catch (error) {
                        return false;
                    }
                }());

                if (!jestJSONtabela && jestEDYCJA && jestADRES && jestTABELA_A && !jestSTRONY_B && !jestTABELA_B) {
                    // WYKONAJ WARIANT A
                    [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.0.B", [
                        ["RAPORT", "ROZPOCZYNAM PRZETWARZANIE DANYCH Z WARIANTU A, DLA"],
                        ["RAPORT", entry.name]
                    ]);
                    try {
                        let TabelkaA = fs.readFileSync(entry.fullPath + "\\TABELA.html.txt");
                        const ADR0A = entry.fullPath + "\\TABELA.log.json";
                        ADR0A.wdrukujJSON("DOPISZ", TabelkaA.TABLE2JSON("A"));
                        setTimeout(() => {
                            console.log("");
                        }, 1000);
                        let metr_out0A = {
                            NAZWA: entry.name,
                            ADRES: metryczka["ADRES"],
                            GROBY: entry.fullPath + "\\TABELA.log.json",
                            EDYCJA: metryczka["EDYCJA"],
                            WARIANT: "A"
                        };
                        path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wdrukujJSON("DOPISZ", metr_out0A); 
                        (entry.fullPath + "\\METRYCZKA.log.json").JSON_z(metr_out0A);
                    } catch (e) {
                        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.0.E", [
                            ["ERROR", "NIE POWIODŁO SIĘ PRZETWARZANIE DANYCH Z WARIANTU A, DLA"],
                            ["ERROR", entry.name],
                            [null, e]
                        ]);                        
                    }



                } else if (!saTABELE_B && !jestJSONtabela && jestEDYCJA && jestADRES && !jestTABELA_A && jestSTRONY_B && jestTABELA_B) {
                    // WYKONAJ SKROBANIE WARIANT B
                    [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.1.B", [
                        ["RAPORT", "ROZPOCZYNAM SKROBANIE I PRZETWARZANIE DANYCH DLA WARIANTU B, DLA"],
                        ["RAPORT", entry.name]
                    ]);
                    try {
                        for (let i = 1; i <= metryczka.STRONY; i++) {

                        setTimeout(() => {
                            request([metryczka.TABELA.slice(0, metryczka.TABELA.lastIndexOf("=")+1), i].join(""), (error, response, html) =>{
                                if (!error && response.statusCode == 200) {
                                    var $ = cheerio.load(html, {
                                        decodeEntities: false
                                    });                                   
                                    let rekord = $("table[style^='border-collapse:']").find('tbody').map(function (i, el) {                
                                        let wers =  $(this).html() ;
                                        return (wers);
                                    }).get();

                                    let rekord2 = $("table[style^='border-collapse:']").children('tbody').find('tr').map(function (i, el) {                    
                                        let wers2 = ' <table><tbody><tr> ' + $(this).html() + ' </tr></tbody></table> ';
                                        return (wers2.TABLE2JSON("B"));
                                    }).get();
                                    const ADR0B = entry.fullPath + "\\TABELA.log.json";
                                    ADR0B.wdrukujJSON("DOPISZ", rekord2 );
                                    const ADR = entry.fullPath+"\\TABELA\\"+i+".html.txt"
                                    ADR.wdrukujTEXT("DOPISZ", ' <table><tbody> ' + rekord + ' </tbody></table> ');
                                }                                
                            });                            
                        }, 2000);                        
                    }                    
                    let metr_out0B = {
                        NAZWA: entry.name,
                        ADRES: metryczka["ADRES"],
                        GROBY: entry.fullPath + "\\TABELA.log.json",
                        EDYCJA: metryczka["EDYCJA"],
                        WARIANT: "B"
                    };
                    path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wdrukujJSON("DOPISZ", metr_out0B); 
                    (entry.fullPath + "\\METRYCZKA.log.json").JSON_z(metr_out0B);
                    } catch (e) {
                        [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.1.E", [
                            ["ERROR", "NIE POWIODŁO SIĘ  SKROBANIE DANYCH DLA WARIANTU B, DLA"],
                            ["ERROR", entry.name],
                            [null, e]
                        ]);                        
                    }
                } else if (jestJSONtabela && jestJSONmetryczka) {
                    // WYKORZYSTAJ DANE Z WYKONANEGO WCZESNIEJ WARIANTU A/B
                    let JSON_METRYCZKA = JSON.parse(fs.readFileSync(entry.fullPath + "\\METRYCZKA.log.json", "utf8"));
                    path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wdrukujJSON("DOPISZ", JSON_METRYCZKA);                    
                    //[START_CZAS, DateTime.local().setLocale('pl-PL'), false].KOMUNIKAT("4.2.D", [
                    //    ["SUKCES", "Z SUKCESEM PRZEBIEGŁ PROGRAM IMPORT.bat (z GROBONETU) gorbonet4gedcom"],
                    //    ["INFO", "URUCHOM TERAZ: EXPORT.bat (do GEDCOM) gorbonet4gedcom"]
                    //]);
                } else if (!jestJSONtabela || !jestJSONmetryczka) {
                    // POWIADOM O BLEDNIE PRZYGOTOWANYCH DANYCH
                    [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.3.E", [
                        ["ERROR", "BŁĘDNIE SKONFIGUROWANO METRYCZKĘ, DLA: " + entry.name],
                        METRYCZKA5INFO[0],
                        METRYCZKA5INFO[1],
                        METRYCZKA5INFO[2],
                        METRYCZKA5INFO[3],
                        METRYCZKA5INFO[4],
                        METRYCZKA5INFO[5]
                    ]); 
                } /*else if (jestJSONtabela) {
                    // POWIADOM O UTRACIE ZRODLA I WYKORZYSTAJ DANE Z POPRZEDNIEGO WYKAZU
                    [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("4.4.E", [
                        ["UWAGA", "ZOSTAŁY SKASOWANE PLIKI ŹRÓDŁOWE, DLA : " + entry.name],
                        ["UWAGA", "Usuń ten cmentarz i uruchom aplikację jeszcze raz."]
                    ]); 
                }*/
            } catch (e) {                
                [START_CZAS, DateTime.local().setLocale('pl-PL')].KOMUNIKAT("3.E", [
                    ["ERROR", "PODANY PONIŻEJ CMENTARZ NIE POSIADA METRYCZKI (LUB JEST BŁĘDNA):"],
                    ["ERROR", entry.name],
                    METRYCZKA5INFO[0],
                    METRYCZKA5INFO[1],
                    METRYCZKA5INFO[2],
                    METRYCZKA5INFO[3],
                    METRYCZKA5INFO[4],
                    METRYCZKA5INFO[5],
                    [null, e]
                ]); 
            }
            //if (fs.existsSync(entry.fullPath+"\\TABELA.txt")) {
            //    console.log("WARIANT A");
            //} else {
            //    console.log("WARIANT B");
            //}
            //console.log({nazwa: entry.name, adres: entry.fullPath});
        });
    /*
    let ELEMENTY = readdirp({
        root: path.join(path.resolve(__dirname, "..", "..", "ŹRÓDŁA")),
        entryType: 'directories'
    });
    ELEMENTY
        .on('warn', function (err) {
            console.error('non-fatal error', err);
            // optionally call stream.destroy() here in order to abort and cause 'close' to be emitted
        })
        .on('error', function (err) {
            console.error('fatal error', err);
        })
        .pipe(es.mapSync(function (entry) {
            if (entry.parentDir==="") {
                let CMENTARZ = {nazwa: entry.name, adres: entry.fullPath};
                return CMENTARZ;
            }
            
            //return entry;
        }))
        .pipe(es.stringify())
        .pipe(process.stdout);
*/
    function WCZYTAJ_METRYCZKE(LOKAL) {
        return JSON.parse(["{", fs.readFileSync(LOKAL, "utf8"), "}"].join(""));
    }
    function ZAPISZ_METRYCZKE(ADRES_PLIKU) {

        
        return JSON.parse(["{", fs.readFileSync(LOKAL, "utf8"), "}"].join(""));
    }
    function WYKAZ(wariant, nazwa, adres, data, plik) {
        //let stareDANE =fs.existsSync(path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini")) && (fs.statSync(path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini"))["size"] / 1000.0) > 0 ? path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wczytajWERSY("WSZYSTKIE") : false;
        let noweDNAE = {
            NAZWA: nazwa,
            ADRES: adres,
            GROBY: data,
            EDYCJA: plik,
            WARIANT: wariant
        };
        //if (stareDANE!==false) {
        //    let czyIstnieje = stareDANE.inArray(noweDNAE, function (e) {            
        //        return e.NAZWA === noweDNAE.NAZWA && e.ADRES === noweDNAE.ADRES && e.GROBY === noweDNAE.GROBY && e.EDYCJA === noweDNAE.EDYCJA && e.WARIANT === noweDNAE.WARIANT;
        //    });
        //    if (!czyIstnieje) {
        //        path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wdrukujJSON("DOPISZ", noweDNAE); 
        //    }
        //} else {
            path.resolve(__dirname, "..", "..", "temp", "WYKAZ.ini").wdrukujJSON("DOPISZ", noweDNAE); 
        //}
        
        
    }
}

// ! #########################################################################
// ! #####                               TMP                             #####
// ! #########################################################################

//START_CZAS
//var dt0 = DateTime.local(2017, 5, 15, 8, 30);
/*
https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromObject
*/
/*
var dt1 = DateTime.fromObject({
    year: 1835,
    month: 5,    
    day: 22, hour: 12, zone: 'America/Los_Angeles', numberingSystem: 'beng'});
*/