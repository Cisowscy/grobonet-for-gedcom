const
    fs = require('fs-extra'),
    path = require('path'),
    chalk = require("chalk"),
    request = require('request'),
    cheerio = require('cheerio'),
    inquirer = require('inquirer'),
    HtmlTableToJson = require('html-table-to-json');
//Object.prototype.wczytajJSON = function (URL) {
//        return JSON.parse(fs.readFileSync(path.resolve(__dirname, URL, 'wykaz-zrodlo.json').replace(/\//g, " ? "), 'utf8'));
//};
//Object.prototype.zapiszJSONdo = function (ADRES_PLIKU) {
//        let NOWY = fs.createWriteStream(path.resolve(__dirname, ADRES_PLIKU), {
//                flags: 'w'
//        });
//        NOWY.write(JSON.stringify(this.valueOf(), null, "\t"));
//};   

Object.prototype.TABLE2JSON = function (adresURL) {
    if (arguments.length === 1) {
        let NOWY = fs.createWriteStream(adresURL, {
            flags: 'w'
        });
        
        NOWY.write(JSON.stringify(new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0], null, "\t"));
    }
    return new HtmlTableToJson('"' + this.valueOf() + '"')['results'][0][0];
};

function GET_BAT_PARAM(X) {
    const Cmentarz = JSON.parse(["[", (fs.readFileSync(path.resolve(__dirname, "..", "config", X[0], "config_N.ini"), "utf8")).slice(0, -2), "]"].join(""))[X[1] - 1];   
    let adres = Cmentarz.stronyTabeli[X[2] - 1];
    let dane = [];
    setTimeout(function () {
        request(adres.www, function (error, response, html) {
            console.log(chalk.bgGreen(chalk.black("\n SKROBANIE DANYCH DLA CMENTARZA "))+chalk.bgYellow(chalk.black(" "+Cmentarz.Nazwa_Cmentarza+" "))+chalk.bgGreen(chalk.black(" POTRRWA JESZCZE OKOŁO: ")) + chalk.bgYellow(chalk.black(adres.czas)));
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html, {
                    decodeEntities: false
                });
                let rekord = $("table[style^='border-collapse:']").children('tbody').find('tr').map(function (i, el) {                    
                    let wers = ' <table><tbody><tr> ' + $(this).html() + ' </tr></tbody></table> ';
                    //console.log("\n\n#####################################################################################################\n\n")
                    //console.log($(this).html());
                    return (wers.TABLE2JSON());
                }).get();
                fs.appendFileSync(Cmentarz.plik, JSON.stringify(rekord)+",\n");
            }
            //let output = '<table><tbody>'+dane.join(" ")+'</tbody></table>'
            //.shift()
            //if (adres.str===1) {
            //    fs.appendFileSync(Cmentarz.plik, "[\n"+JSON.stringify(output.TABLE2JSON(), null, "\t")+",\n");
            //} else if (adres.str===Cmentarz.Ilosc_Stron) {
            //    fs.appendFileSync(Cmentarz.plik, JSON.stringify(output.TABLE2JSON().shift(), null, "\t")+"\n]\n");
            //} else {
            //    fs.appendFileSync(Cmentarz.plik, JSON.stringify(output.TABLE2JSON().shift(), null, "\t")+",\n");
            //}
            //JSON.stringify(answers, null, "\t")
            //fs.appendFileSync(adres.plik, output);
            //console.log(output.TABLE2JSON());
            //dane.TABLE2JSON(adres.plik);
        });
    }, 1000); 

}
//http://katowicebonifratrow.artlookgallery.com/grobonet/start.php?id=wyniki&rur=&mur=&dur=&rzg=&mzg=&dzg=&name=&imie=&nazwisko=&sektor=&rzad=&numer=&cmentarz=&sort=1&widok=tabela&ppstrona=467
GET_BAT_PARAM(process.argv.splice(process.execArgv.length + 2).filter(el => el.substr(0, 2) != '--'));

