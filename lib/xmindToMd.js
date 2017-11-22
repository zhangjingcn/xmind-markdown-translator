/**
 * Created by shaoyin.zj on 17/1/8.
 */

const MdSyntax = require('./mdSyntax');
const mdSyntax = new MdSyntax();
const _ = require('lodash');
const xmlLite = require('xml-lite');
const LINE_SEPARATE = '  \r\n';
const LINE_END = '  ';
var plainContent = '';

//xmind to md converter
function xmindToMd(workbook, program){
    var mdContent = [];

    var sheet = workbook.getPrimarySheet();
    recursiveToMd(sheet.rootTopic, mdContent, 1, program);
    return mdContent.join("");
}

//递归的
function recursiveToMd(node, mdContent, depth, program){
    _.forEach(node.children, function(node, num){

        //有可能节点中没有title和超链接，只有图片。把图片作为title来用
        var nodeTitle = trimReturn(node.getTitle());//title去掉换行符，否则作为标题会有问题
        var nodeLink = node.getHyperlink() ? mdSyntax.link(node.getHyperlink(), 'anchor') : '';
        var nodeImg = getNodeImg(node);
        if(!(nodeTitle + nodeLink)){
            nodeTitle = nodeImg;
            nodeImg = '';
        }

        if (program.headerNodeLevel) {
          if (program.headerNodeLevel >= depth) {
            mdContent.push(mdSyntax.header(depth, nodeTitle + ' ' + nodeLink));
          }
          else {
              var itemDepth = depth - program.headerNodeLevel - 1;
              mdContent.push(mdSyntax.unorderedList(nodeTitle + ' ' + nodeLink, false, itemDepth));
          }
        } else {
          //非叶子节点，按照标题输出，对于叶子节点，看配置，是否也按照标题输出
          if (node.children && node.children.length>0 || program.leafTopic == 'header'){
              mdContent.push(mdSyntax.header(depth, nodeTitle + ' ' + nodeLink));
          }
          //如果是叶子节点，默认按照unorderedList输出
          else {
              mdContent.push(mdSyntax.unorderedList(nodeTitle + ' ' + nodeLink, false));
          }
        }

        //输出节点的图片
        mdContent.push(nodeImg);

        //输出note，按照html输出
        const notesContent = getNotes(node);
        if(notesContent){
            //输出的html
            mdContent.push(mdSyntax.txt(notesContent));
        }

        recursiveToMd(node, mdContent, ++depth, program);
        depth--;
    });
}

//将节点中的图片转成md格式
function getNodeImg(node){
    const img = xmlLite.findChildNode(node.doc, {
        tagName: 'xhtml:img',
    });
    if(img) {
        const imgsrc = img.getAttribute('xhtml:src');
        return mdSyntax.img(trimNamespace(imgsrc), '');
    }
    return '';
}

//将note转换成md的格式
function getNotes(node) {
    const notesNode = xmlLite.findChildNode(node.doc, {
        tagName: 'notes',
    });
    if (notesNode) {
        const plainNotesNode = xmlLite.findChildNode(notesNode, {
            tagName: 'plain',
        });
        const htmlNotesNode = xmlLite.findChildNode(notesNode, {
            tagName: 'html',
        });
        if (htmlNotesNode && plainNotesNode) {
            plainContent = plainNotesNode.textContent;
            plainContent = trimReturn(plainContent);
            const mdContent = getMdContent(htmlNotesNode);
            return mdContent;
        }

    }
    return '';
}

//将html格式的notes内容，转化为md格式的
//这里有一个问题，notes的节点经过xml解析，每一行用一个P元素表示，每一行前缀中的空格在解析中会被丢弃
//所以需要传入plainContent，是不含标签的notes纯文本，目的是用来与方法中解析出的文本内容做比较，使能够输出完整的包括前缀空格的文本。
function getMdContent(node){
    switch(node.nodeType){
        case 1:
        case 11:
            var buf = [];
            if(node.localName == 'img'){
                const imgsrc = node.getAttribute('xhtml:src');
                buf.push(mdSyntax.img(trimNamespace(imgsrc), ''))
            }  else if(node.localName == 'a'){
                const href = node.getAttribute('xhtml:href');
                const txt = node.textContent;
                buf.push(mdSyntax.link(trimNamespace(href), txt));
            }
            if(!node.childNodes || node.childNodes.length == 0){
                buf.push(LINE_SEPARATE);
            } else {
                node = node.firstChild;
                while (node) {
                    if (node.nodeType !== 7 && node.nodeType !== 8) {
                        buf.push(getMdContent(node));
                    }
                    node = node.nextSibling;
                }
            }
            return buf.join('');
        default:
            const value = node.nodeValue;
            const index = plainContent.indexOf(value);
            const plainValue = plainContent.substr(0, index + value.length);
            plainContent = plainContent.substr(index + value.length);
            return plainValue + LINE_SEPARATE;
    }
}

//删除命名空间，这里正则写不好，用了比较笨的办法
function trimNamespace(value){
    "use strict";
    return value.replace(/(xmlns:|xhtml:|xlink:|xmap:|xmind:|urn:|content:|xap:)/g, "");
}

//输出换行符
function trimReturn(value){
    value = value.replace(/\r/g, '');
    value = value.replace(/\n/g, '');
    return value;
}

module.exports = xmindToMd;