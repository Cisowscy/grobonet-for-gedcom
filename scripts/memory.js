const 
    fs = require('fs-extra'),
    path = require('path'),
    si = require('systeminformation'),
    async = require("async");

fs.ensureFileSync(path.resolve(__dirname, "..", "ini", "memory.ini"));
async function mem() {
    try {
      const data = await si.mem();
      let size = Math.ceil(data.total/1024/1024/2);
      fs.appendFileSync(path.resolve(__dirname, "..","ini", "memory.ini"), size+"\n");
    } catch (e) {
      console.log(e)
    }
}
mem();