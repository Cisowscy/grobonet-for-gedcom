require('core-js');
const fs = require('fs-extra');
const path = require("path");
const readdirp = require('readdirp');
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
                if (fs.existsSync(entry.fullPath + "\\TABELA")) {
                    fs.removeSync(entry.fullPath + "\\TABELA");
                }
                if (fs.existsSync(entry.fullPath + "\\TABELA.log.json")) {
                    fs.removeSync(entry.fullPath + "\\TABELA.log.json");
                }
                if (fs.existsSync(entry.fullPath + "\\METRYCZKA.log.json")) {
                    fs.removeSync(entry.fullPath + "\\METRYCZKA.log.json");
                }
            } catch (error) {
                
            }
        });