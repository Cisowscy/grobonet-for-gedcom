require('core-js');
const
    v8 = require('v8'),
    fs = require('fs-extra'),
    path = require('path'),
    chalk = require("chalk");
console.log(chalk.bgBlue(chalk.white(">> ZBIERANIE DANYCH      ")));
v8.setFlagsFromString('--max_old_space_size=' + parseInt(fs.readFileSync(path.resolve(__dirname, "..", "ini", "memory.ini"), "utf8")));
const PROJ =(function() {
    let JSONversion = JSON.parse(["[", (fs.readFileSync(path.resolve(__dirname, "..", "ini", "config.ini"), "utf8")).slice(0, -2), "]"].join(""));
    return JSONversion[JSONversion.length - 1];
}());
const SETS = [
    JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "config", PROJ, "config.ini"), "utf8").slice(0, -2)),
    JSON.parse("[" + fs.readFileSync(path.resolve(__dirname, "..", "config", PROJ, "config_1.ini"), "utf8").slice(0, -2) + "]"),
    JSON.parse("[" + fs.readFileSync(path.resolve(__dirname, "..", "config", PROJ, "config_N.ini"), "utf8").slice(0, -2) + "]")
];

String.prototype.unifikacja = function findWord() {
    let translate_re = /[ÀÁÂÃÄÅĂĀĄÆǼàáâãäåăāąæǽÞþßÇČĆĈĊçčćĉċĐĎđďÈÉÊËĔĒĘĖèéêëĕēęėĜĞĠĢĝğġģĤĦĥħÌÍÎÏİĨĪĬĮìíîïįĩīĭıĴĵĶķĸĹĻĽĿŁĺļľŀłÑŃŇŅŊñńňņŋŉÒÓÔÕÖØŌŎŐŒòóôõöøōŏőœðŔŘŕřŗŠŜŚŞšŝśşŦŢŤŧţťÙÚÛÜŨŪŬŮŰŲùúûüũūŭůűųŴẀẂẄŵẁẃẅÝŸŶýÿŷŽŹŻžźż]/g;
    let translate = {
        "À":"A", "Á":"A", "Â":"A", "Ã":"A", "Ä":"A", "Å":"A", "Ă":"A", "Ā":"A", "Ą":"A", "Æ":"A", "Ǽ":"A",
        "à":"a", "á":"a", "â":"a", "ã":"a", "ä":"a", "å":"a", "ă":"a", "ā":"a", "ą":"a", "æ":"a", "ǽ":"a",

        "Þ":"B", "þ":"b", "ß":"Ss",

        "Ç":"C", "Č":"C", "Ć":"C", "Ĉ":"C", "Ċ":"C",
        "ç":"c", "č":"c", "ć":"c", "ĉ":"c", "ċ":"c",

        "Đ":"Dj", "Ď":"D",
        "đ":"dj", "ď":"d",

        "È":"E", "É":"E", "Ê":"E", "Ë":"E", "Ĕ":"E", "Ē":"E", "Ę":"E", "Ė":"E",
        "è":"e", "é":"e", "ê":"e", "ë":"e", "ĕ":"e", "ē":"e", "ę":"e", "ė":"e",

        "Ĝ":"G", "Ğ":"G", "Ġ":"G", "Ģ":"G",
        "ĝ":"g", "ğ":"g", "ġ":"g", "ģ":"g",

        "Ĥ":"H", "Ħ":"H",
        "ĥ":"h", "ħ":"h",

        "Ì":"I", "Í":"I", "Î":"I", "Ï":"I", "İ":"I", "Ĩ":"I", "Ī":"I", "Ĭ":"I", "Į":"I",
        "ì":"i", "í":"i", "î":"i", "ï":"i", "į":"i", "ĩ":"i", "ī":"i", "ĭ":"i", "ı":"i",

        "Ĵ":"J",
        "ĵ":"j",

        "Ķ":"K",
        "ķ":"k", "ĸ":"k",

        "Ĺ":"L", "Ļ":"L", "Ľ":"L", "Ŀ":"L", "Ł":"L",
        "ĺ":"l", "ļ":"l", "ľ":"l", "ŀ":"l", "ł":"l",

        "Ñ":"N", "Ń":"N", "Ň":"N", "Ņ":"N", "Ŋ":"N",
        "ñ":"n", "ń":"n", "ň":"n", "ņ":"n", "ŋ":"n", "ŉ":"n",

        "Ò":"O", "Ó":"O", "Ô":"O", "Õ":"O", "Ö":"O", "Ø":"O", "Ō":"O", "Ŏ":"O", "Ő":"O", "Œ":"O",
        "ò":"o", "ó":"o", "ô":"o", "õ":"o", "ö":"o", "ø":"o", "ō":"o", "ŏ":"o", "ő":"o", "œ":"o", "ð":"o",

        "Ŕ":"R", "Ř":"R",
        "ŕ":"r", "ř":"r", "ŗ":"r",

        "Š":"S", "Ŝ":"S", "Ś":"S", "Ş":"S",
        "š":"s", "ŝ":"s", "ś":"s", "ş":"s",

        "Ŧ":"T", "Ţ":"T", "Ť":"T",
        "ŧ":"t", "ţ":"t", "ť":"t",

        "Ù":"U", "Ú":"U", "Û":"U", "Ü":"U", "Ũ":"U", "Ū":"U", "Ŭ":"U", "Ů":"U", "Ű":"U", "Ų":"U",
        "ù":"u", "ú":"u", "û":"u", "ü":"u", "ũ":"u", "ū":"u", "ŭ":"u", "ů":"u", "ű":"u", "ų":"u",

        "Ŵ":"W", "Ẁ":"W", "Ẃ":"W", "Ẅ":"W",
        "ŵ":"w", "ẁ":"w", "ẃ":"w", "ẅ":"w",

        "Ý":"Y", "Ÿ":"Y", "Ŷ":"Y",
        "ý":"y", "ÿ":"y", "ŷ":"y",

        "Ž":"Z", "Ź":"Z", "Ż":"Z",
        "ž":"z", "ź":"z", "ż":"z"
      };
      return (function(s) {
        return ( s.replace(translate_re, function(match) { 
          return translate[match]; 
        }) );
      }(this.valueOf()));
      //["Á":"A", á • Àà • Ăă • Ắắ • Ằằ • Ẵẵ • Ẳẳ • Ââ • Ấấ • Ầầ • Ẫẫ • Ẩẩ • Ǎǎ • Åå • Ǻǻ • Ää • Ǟǟ • Ãã • Ȧȧ • Ǡǡ • Ąą • Āā • Ảả • Ȁȁ • Ȃȃ • Ạạ • Ặặ • Ậậ • Ḁḁ • Ⱥⱥ • ᶏ • Ḃḃ • Ḅḅ • Ḇḇ • Ƀƀ • ᵬ • ᶀ • Ɓɓ • Ƃƃ • Ćć • Ĉĉ • Čč • Ċċ • Çç • Ḉḉ • Ȼȼ • Ƈƈ • ɕ • Ďď • Ḋḋ • Ḑḑ • Ḍḍ • Ḓḓ • Ḏḏ • Đđ • ᵭ • ᶁ • Ɖɖ • Ɗɗ • ᶑ • Ƌƌ • ȡ • Éé • Èè • Ĕĕ • Êê • Ếế • Ềề • Ễễ • Ểể • Ěě • Ëë • Ẽẽ • Ėė • Ė̄ė̄ • Ȩȩ • Ḝḝ • Ęę • Ēē • Ḗḗ • Ḕḕ • Ẻẻ • Ȅȅ • Ȇȇ • Ẹẹ • Ệệ • Ḙḙ • Ḛḛ • Ɇɇ • ᶒ • Ḟḟ • ᵮ • ᶂ • Ƒƒ • Ǵǵ • Ğğ • Ĝĝ • Ǧǧ • Ġġ • Ģģ • Ḡḡ • Ǥǥ • ᶃ • Ɠɠ • Ĥĥ • Ȟȟ • Ḧḧ • Ḣḣ • Ḩḩ • Ḥḥ • Ḫḫ • H̱ẖ • Ħħ • Ⱨⱨ • Íí • Ìì • Ĭĭ • Îî • Ǐǐ • Ïï • Ḯḯ • Ĩĩ • İi • Įį • Īī • Ỉỉ • Ȉȉ • Ȋȋ • Ịị • Ḭḭ • Iı • Ɨɨ • ᵻ • ᶖ • Ĵĵ • J̌ǰ • ȷ • Ɉɉ • ʝ • ɟ • ʄ • Ḱḱ • Ǩǩ • Ķķ • Ḳḳ • Ḵḵ • ᶄ • Ƙƙ • Ⱪⱪ • Ĺĺ • Ľľ • Ļļ • Ḷḷ • Ḹḹ • Ḽḽ • Ḻḻ • Łł • Ŀŀ • Ƚƚ • Ⱡⱡ • Ɫɫ • ɬ • ᶅ • ɭ • ȴ • Ḿḿ • Ṁṁ • Ṃṃ • ᵯ • ᶆ • ɱ • Ńń • Ǹǹ • Ňň • Ññ • Ṅṅ • Ņņ • Ṇṇ • Ṋṋ • Ṉṉ • ᵰ • Ɲɲ • Ƞƞ • ᶇ • ɳ • ȵ • Óó • Òò • Ŏŏ • Ôô • Ốố • Ồồ • Ỗỗ • Ổổ • Ǒǒ • Öö • Ȫȫ • Őő • Õõ • Ṍṍ • Ṏṏ • Ȭȭ • Ȯȯ • Ȱȱ • Øø • Ǿǿ • Ǫǫ • Ǭǭ • Ōō • Ṓṓ • Ṑṑ • Ỏỏ • Ȍȍ • Ȏȏ • Ơơ • Ớớ • Ờờ • Ỡỡ • Ởở • Ợợ • Ọọ • Ộộ • ᶗ • Ɵɵ • Ṕṕ • Ṗṗ • Ᵽᵽ • ᵱ • ᶈ • Ƥƥ • ʠ • Ɋɋ • Ŕŕ • Řř • Ṙṙ • Ŗŗ • Ȑȑ • Ȓȓ • Ṛṛ • Ṝṝ • Ṟṟ • Ɍɍ • ᵲ • ᶉ • ɼ • Ɽɽ • ɾ • ᵳ • Śś • Ṥṥ • Ŝŝ • Šš • Ṧṧ • Ṡṡẛ • Şş • Ṣṣ • Ṩṩ • Șș • ᵴ • ᶊ • ʂ • ȿ • S̩s̩ • Ťť • T̈ẗ • Ṫṫ • Ţţ • Ṭṭ • Țț • Ṱṱ • Ṯṯ • Ŧŧ • Ⱦⱦ • ᵵ • ƫ • Ƭƭ • Ʈʈ • ȶ • Úú • Ùù • Ŭŭ • Ûû • Ǔǔ • Ůů • Üü • Ǘǘ • Ǜǜ • Ǚǚ • Ǖǖ • Űű • Ũũ • Ṹṹ • Ųų • Ūū • Ṻṻ • Ủủ • Ȕȕ • Ȗȗ • Ưư • Ứứ • Ừừ • Ữữ • Ửử • Ựự • Ụụ • Ṳṳ • Ṷṷ • Ṵṵ • Ʉʉ • ᵾ • ᶙ • Ṽṽ • Ṿṿ • ᶌ • Ʋʋ • ⱴ • Ẃẃ • Ẁẁ • Ŵŵ • Wẘ • Ẅẅ • Ẇẇ • Ẉẉ • Ẍẍ • Ẋẋ • X̂x̂ • ᶍ • Ýý • Ỳỳ • Ŷŷ • Yẙ • Ÿÿ • Ỹỹ • Y̨y̨ • Ẏẏ • Ȳȳ • Ỷỷ • Ỵỵ • ʏ • Ɏɏ • Ƴƴ • Źź • Ẑẑ • Žž • Żż • Ẓẓ • Ẕẕ • Ƶƶ • ᵶ • ᶎ • Ȥȥ • ʐ • ʑ • ɀ • Ⱬⱬ    
};
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
Array.prototype.pushIfNotExistOrChangeGED = function (element, comparer) {
    if (!this.inArray(comparer)) {
            this.push(element);
            console.log(chalk.green(">> dodano grób: "+element.BURI+", osoby: "+element.SURN+" "+element.GIVN+" ("+element.BIRT+" / "+element.DEAT+")"));
    } else {
        let nr = this.findIndex(comparer);
        console.log(chalk.red("!! Znaleziono duplikat nastąpi scalenie poniższych pozycji: \n"));
         console.log(chalk.bgBlue(chalk.white(">> OBECNE:   "))+chalk.blue(" grób: "+this[nr].BURI+", osoby: "+this[nr].SURN+" "+this[nr].GIVN+" ("+this[nr].BIRT+" / "+this[nr].DEAT+")") );
        console.log(chalk.bgGreen(chalk.white(">> PODOBNE:  "))+chalk.green(" grób: "+element.BURI+", osoby: "+element.SURN+" "+element.GIVN+" ("+element.BIRT+" / "+element.DEAT+")") );
        if (this[nr].GIVN !== element.GIVN && this[nr].GIVN === element.GIVN.unifikacja()) {
            this[nr].GIVN = element.GIVN;     
        }
        if (this[nr].SURN !== element.SURN && this[nr].SURN === element.SURN.unifikacja()) {
            this[nr].SURN = element.SURN;            
        }
        if (this[nr].BURI !== element.BURI && (this[nr].BURI.charAt(2)==="-" || this[nr].BURI.charAt(2)==="?" ) && element.BURI.charAt(2)!=="-" && element.BURI.charAt(2)!=="?") {
            this[nr].BURI = element.BURI;            
        }
        console.log(chalk.bgYellow(chalk.black(">> SCALONE:  "))+chalk.yellow(" grób: "+this[nr].BURI+", osoby: "+this[nr].SURN+" "+this[nr].GIVN+" ("+this[nr].BIRT+" / "+this[nr].DEAT+")\n") );
    }
};
String.prototype.findWord = function findWord(word) {
    return RegExp('\\b' + word + '\\b', 'i').test(this.valueOf())
};
function translate(s) {
    
}
Object.prototype.restrukturyzacja = function () {
    let NOWA = [];
    this.valueOf().forEach((EL, i) => {
        //if (i !==0) {
        let element = {
            "GIVN": EL["1"].replace(/\//g, " ? "),
            "SURN": EL["2"].replace(/\//g, " ? "),
            "BIRT": coByloWczesniej()[0],
            "DEAT": coByloWczesniej()[1],
            "BURI": ewidencja(EL["5"], EL["6"], EL["7"])
        };
        NOWA.pushIfNotExistOrChangeGED(element, function (e) {            
            return e.GIVN.unifikacja() === element.GIVN.unifikacja() && e.SURN.unifikacja() === element.SURN.unifikacja() && e.BIRT === element.BIRT && e.DEAT === element.DEAT;
        });

        function coByloWczesniej() {
            let DATy = [];
            if (zmianaDaty("3") !== "" && zmianaDaty("4") !== "") {
                let ur = new Date(zmianaDaty("3"));
                let zg = new Date(zmianaDaty("4"));
                if (ur < zg) {
                    DATy.push(zmianaDaty("3"));
                    DATy.push(zmianaDaty("4"));
                } else {
                    DATy.push(zmianaDaty("4"));
                    DATy.push(zmianaDaty("3"));
                }
            } else {
                DATy.push(zmianaDaty("3"));
                DATy.push(zmianaDaty("4"));
            }
            return DATy;
        }
        function ewidencja(sektor, rzad, grob) {
            function czyBrak(wartosc) {
                return wartosc === "" || wartosc === " " ? "?" :  wartosc === "brak" || wartosc === "BRAK" || wartosc === "Brak" ? "-":wartosc;   
            }
            return "№(" + [czyBrak(sektor), czyBrak(rzad), czyBrak(grob)].join("|") + ")";
        }
        function zmianaDaty(typDaty) {
            let DataZnana = EL[typDaty] !== "data nieznana" && parseInt(EL[typDaty].substr(0, 4)) > 1400 && parseInt(EL[typDaty].substr(0, 4)) <= new Date().getFullYear();
            let Dzien_Miesiac_Nieznany = EL[typDaty].length === 10 && DataZnana ? EL[typDaty].substr(5, 5) === "01-01" ? true : EL[typDaty].substr(5, 5) === "00-00" ? true : false : false;
            let nowaData = "";
            if (!DataZnana) {
                nowaData = "";
            } else if (Dzien_Miesiac_Nieznany) {
                nowaData = EL[typDaty].substr(0, 4);
            } else {
                let YYYY = EL[typDaty].substr(0, 4);
                let MMv = EL[typDaty].substr(5, 2);
                let DD = EL[typDaty].substr(8, 1) === "0" ? EL[typDaty].substr(9, 1) : EL[typDaty].substr(8, 2);
                let MM = '';
                switch (MMv) {
                    case '01':
                        {
                            MM = 'JAN';
                            break;
                        }
                    case '02':
                        {
                            MM = 'FEB';
                            break;
                        }
                    case '03':
                        {
                            MM = 'MAR';
                            break;
                        }
                    case '04':
                        {
                            MM = 'APR';
                            break;
                        }
                    case '05':
                        {
                            MM = 'MAY';
                            break;
                        }
                    case '06':
                        {
                            MM = 'JUN';
                            break;
                        }
                    case '07':
                        {
                            MM = 'JUL';
                            break;
                        }
                    case '08':
                        {
                            MM = 'AUG';
                            break;
                        }
                    case '09':
                        {
                            MM = 'SEP';
                            break;
                        }
                    case '10':
                        {
                            MM = 'OCT';
                            break;
                        }
                    case '11':
                        {
                            MM = 'NOV';
                            break;
                        }
                    case '12':
                        {
                            MM = 'DEC';
                            break;
                        }
                }
                nowaData = [DD, MM, YYYY].join(" ");
            }
            return nowaData;
        }
        //}
    });
    return NOWA;
}
Object.prototype.filtrImion = function () {
    let NOWA = [];
    this.valueOf().forEach(grob => {
            let imie = grob.GIVN;
            let ToImie = imie.length > 2 ? true : false;        
            let OstatniaA = ToImie ? imie[imie.length-1] === ')' ? imie[imie.length-2] === ' ' ? imie[imie.length-3] === 'A'? true : imie[imie.length-3] === 'a' ? true : false : imie[imie.length-2] === 'A'? true : imie[imie.length-2] === 'a'? true : false : imie[imie.length-1] === ' ' ? imie[imie.length-2] === 'A'? true : imie[imie.length-2] === 'a' ? true : false: imie[imie.length-1] === 'A'? true : imie[imie.length-1] === 'a'? true : false: false; 
            if (!imie.findWord('rezerwa')) {
                    if (!imie.findWord('dla rodziny')) {
                            if (!imie.findWord('rodz')) {   
                                    if (!imie.findWord('rez.')) {                     
                                            if (ToImie && OstatniaA) {
                                                    grob["SEX"] = "F";
                                                    NOWA.push(grob);
                                            } else if (ToImie && !OstatniaA) {
                                                    grob["SEX"] = "M";
                                                    NOWA.push(grob); 
                                            } else if (!ToImie) {
                                                    grob["SEX"] = "U";
                                                    NOWA.push(grob);  
                                            }
                                    }
                            }
                    }
            }
    });
    return NOWA;
};
Object.prototype.filtrNazwisk = function () {
    let NOWA = [];
    this.valueOf().forEach(grob => {
            let nazwisko = grob.SURN;
            if (!nazwisko.findWord('rezerwa')) {
                    if (!nazwisko.findWord('dla')) {
                            if (!nazwisko.findWord('II ')) {
                                    if (!nazwisko.findWord('nn')) {
                                            if (nazwisko!=='') {
                                                    NOWA.push(grob);
                                            }
                                    }
                            }
                    }
            }
    });
    return NOWA;
};
Object.prototype.redukcjaDuplikatowIndexu = function () {

};
Object.prototype.zapiszJSONdo = function (ADRES_PLIKU) {
        let NOWY = fs.createWriteStream(path.resolve(__dirname, ADRES_PLIKU), {
                flags: 'w'
        });
        NOWY.write(JSON.stringify(this.valueOf()));
};
let EXPORT = {
    GedCom_NAME: SETS[0].ged_nazwa,
    GedCom_TARGET: SETS[0].ged_cel,
    GedCom_FOLDER: path.resolve(__dirname, "..", "temp", PROJ),
    GedCom_EXPORT: path.resolve(__dirname, "..", "_GED-COM"),
    GedCom_USERNAME: SETS[0].ged_ueser,
    INCLUDE: []
};
let ZADANIA = 1;
if (SETS[0].jedna_TABELA > 0) {
    SETS[1].forEach(cmentarz => {
        EXPORT.INCLUDE.push([
            roszada(false, JSON.parse(fs.readFileSync(path.resolve(cmentarz.plik), "utf8").slice(0, -2))).restrukturyzacja().filtrImion().filtrNazwisk(),
            ZADANIA,
            cmentarz.Nazwa_Cmentarza,
            cmentarz.Adres_Cmentarza
        ]);
        ZADANIA++;
    });
} 
if (SETS[0].wiele_TABEL > 0) {
    SETS[2].forEach(cmentarz => {
        EXPORT.INCLUDE.push([
            roszada(true, JSON.parse("[" + fs.readFileSync(path.resolve(cmentarz.plik), "utf8").slice(0, -2) + "]\n")).restrukturyzacja().filtrImion().filtrNazwisk(),
            ZADANIA,
            cmentarz.Nazwa_Cmentarza,
            cmentarz.Adres_Cmentarza
        ]);
        ZADANIA++;
    });
}

function roszada(repete, JSONget) {
    //console.log(JSONget.length);
    console.log(chalk.bgYellow(chalk.black(">> PRZETWARZANIE DANYCH  ")));
    let TAB = [];
    
    if (repete) {        
        JSONget.forEach(str => {  
            str.shift();
            //TAB.concat(str);
            str.forEach(el => {
                TAB.push(el);
            });            
        });
    } else {
        JSONget.shift();
        JSONget.forEach(el => {
            TAB.push(el);
        }); 
        //TAB.concat(JSONget);           
    }
    //console.log(TAB);
    return TAB;
}

EXPORT.zapiszJSONdo(path.resolve(EXPORT.GedCom_FOLDER, "GEDCOM.json"));
console.log(chalk.bgRed(chalk.white(">> ZAPISYWANIE DANYCH    ")));
setTimeout(function () {  
    console.log(chalk.bgBlue(chalk.white("INICJOWANIE EXPORTU .GED ")));   
}, 5000); 
