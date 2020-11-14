///////////////////////////////////////////////////
// Api download soundcloud ojota-dev
// 14/11/2020
// Client Id = 95f22ed54a5c297b1c41f72d713623ef
///////////////////////////////////////////////////
const utils = require("./utils/")
const express = require('express')
const fs = require('fs');
const app = express()
const porta = 3000
// Get Str 
function getStr(str, start, end) {
  let str1 = str.split(start)[1];
  let str2 = str1.split(end)[0];
  return str2;
}
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.get('/downloader', async function (req, res) { 
const dir = __dirname+'\\download\\';
const seconds = 5;
const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
    let format = 'mp3'
    const getTrack = async function () {
        var url = req.query.url;
        var clientID = "6862b458caa60ca20447985771260f7b";
        if (url == '') {
            res.status(502)
            return   res.json({ error: 'Você não passou os parametros corretamente'})
        } else if(!url.includes('https')) {
            res.status(502)
           return res.json({ error: 'Esta não é uma url válida do soundcloud, corrija e tente novamente!'})
        } else {
       console.log({ success: `Recebendo informações da música ${url}`})
        var result = ('success')
        }
        // Getting Track ID for Download
         var getTrackID = ((await utils.request({
             url: `${url}`,
           	 method: "GET",
            })).body)
        if (!getTrackID.includes('https://api.soundcloud.com/tracks/')) {
            res.status(404)
          //  console.log(({ error: `Esta faixa não foi encontrada.`}))
            return  res.json({ error: `Esta faixa não foi encontrada.`})
        }
        var trackID = getStr(getTrackID, '"uri":"https://api.soundcloud.com/tracks/', '","urn":"'); 
        if (trackID.length > 3) {
            var url2 = `https://api.soundcloud.com/tracks/${trackID}?client_id=${clientID}`;
            //console.log({success: `ID: ${trackID} | Id salvo com sucesso, requisitando informações`})
            var getTrackInfo1 = ((await utils.request({
                url: `https://api.soundcloud.com/tracks/${trackID}?client_id=${clientID}`,
                   method: "GET",
               })).body)
            var titulo = getStr(getTrackInfo1, '"title":"', '","'); 
            var username = getStr(getTrackInfo1, '"username":"', '","'); 
            // Getting Download Link
            var getTrackInfo = ((await utils.request({
                url: `https://api.soundcloud.com/i1/tracks/${trackID}/streams?client_id=${clientID}`,
                   method: "GET",
               })).body)
               var downloadlink = getStr(getTrackInfo, '{"http_mp3_128_url":"', '","'); 
               if (!getTrackInfo.includes('http_mp3_128_url')) {
                res.status(201)
                console.log(({ error: `Ocorreu um erro ao efetuar o download da faixa.`}))
                return  res.json({ error: `Ocorreu um erro ao efetuar o download da faixa`})
               } else {    
                var myVar = downloadlink;
                var urlmsc = downloadlink;
                var fs = require('fs'),
                request = require('request');        
                request
                    .get(downloadlink)
                    .on('error', function(err) {
                    })
                .pipe(fs.createWriteStream(`${dir}${titulo}.mp3`));
                var arquive =  `${dir}/${titulo}.mp3`
                await sleep(seconds);   
                res.status(200)
                res.download(arquive, (error) => {
                    if(error) return;
                  fs.unlink(arquive, () => {
                    console.log({ success: 'Download bem sucedido!'})
              });
                })
                console.log({ success: 'Download bem sucedido!'})         }
       }   
               
      } 
     getTrack()
});
app.listen(porta, () => {
    console.clear();
    console.log(`SoundCloud Downloader by Jota | On ${porta}`);
})



