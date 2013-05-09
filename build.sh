#!/bin/sh

#just for testing

#http://nodejs.org/dist/v0.8.14/node-v0.8.14-linux-x64.tar.gz
node_version=v0.8.14
file_name=node-$node_version-linux-x64

if [ ! -e $file_name ]
then
    wget http://nodejs.org/dist/$node_version/$file_name.tar.gz
    tar xf $file_name.tar.gz
fi
rm -rf target
mkdir target

export PATH=$PWD/$file_name/bin:$PATH

npm install
npm test

rm -rf target/app.zip
zip -r target/app.zip *




