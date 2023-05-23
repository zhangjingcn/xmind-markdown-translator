/**
 * Created by shaoyin.zj on 17/1/8.
 */
var fs = require('fs');
const JSZip = require('jszip');
const _ = require('lodash');

//write attachment to file
function attachmentWriter(program){
    const dir = getFileDir(program.source);
    const attachmentDir = dir + '/attachments';
    if(!fsExistsSync(attachmentDir)) {
        fs.mkdirSync(attachmentDir);
    }
    const zip = new JSZip(fs.readFileSync(program.source));
    _.forIn(zip.files, (file, filename) => {
        filename = filename.replace(/^\//, '');
        if (filename.indexOf('attachments/') === 0) {
            // attachments/*
            const shortName = filename.replace('attachments/', '');
            //console.log(file.asNodeBuffer());
            fileWriter(attachmentDir, shortName, file.asNodeBuffer());
        }
    });
}

//write attachment to file
function fileWriter(attachmentDir, fileName, bufferContent){
    fs.writeFile(attachmentDir + '/' + fileName, bufferContent, function(err) {
        if (err) {
            throw err;
        }
        console.log('Attachment File Saved.');
    });
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

function getFileDir(path){
    "use strict";
    if(path.lastIndexOf('/')>0){
        return path.substr(0, path.lastIndexOf('/'));
    }
    return '.';
}

module.exports = attachmentWriter;