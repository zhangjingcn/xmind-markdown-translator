# xmind and markdown translator

## introduction

This tool inspired by one of my colleague who just use xmind to make summary. Xmind is good at mind mapping, it seem that when you read a book or article, xmind can help you quickly summarize the key point. But if you want to share it with others, xmind seems a little troble. This tool help you translate xmind file to markdown syntax. In future, it may support markdown syntax to xmind.

## features

#### xmind to markdown 

###### supported xmind syntax

* topic and their child topic
* image of topic
* link of topic
* note of topic
* note content inluding images and link

###### unsupported xmind syntax

* relation of topic
* lable of topic
* marker of topic
* attachment of topic
* style of note like font family、font size、font style、background、indent

#### markdown to xmind (comming soon probably)

## demo

* xmind translate to markdown
    * xmind [idea.xmind](demo/idea.xmind)
    * markdown translated by this tool [idea.md](demo/idea.md)

## usage

#### execute

```
    npm install
    node start.js -s [source file] -d [destination file] [options]
```

#### command line options

```
  Usage: start -s [source file] -d [destination file] [options]

  Options:

    -h, --help                                 output usage information
    -V, --version                              output the version number
    -s, --source [sourceLocation]              source file need to parse, now only support xmind file
    -d, --destination [destinationLocation]    destination file that generated, now only can be mardown file
    -l, --leafTopic [header || unorderedlist]  value can be header or unorderedlist, default is unorderedlist, used when translate xmind to mardown, define that leaf topic should be translated to header or unorderedlist in markdown

```

## version
#### V0.1.0

* support translate xmind to markdown

## dependency

```
    "babel-core": "6.13.2",
    "babel-polyfill": "6.13.0",
    "babel-preset-es2015-node6": "0.3.0",
    "babel-preset-stage-3": "6.5.0",
    "lodash": "4.17.3",
    "xmind": "~0.4.0",
    "commander" : "~2.9.0"
```