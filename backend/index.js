//
const http = require('http');
const axios = require("axios");
//
let responseBuf = [];

http.createServer((req, res) => {
    const { method, url } = req
    console.log(`=====START SERVER PORT 3001=====`);
    req.on("data", (chunk) => {
        responseBuf.push(chunk);
    }).on("end", async () => {
        const responseResultFormat = {};
        let body = null;
        if (responseBuf.length !== 0) {
            try {
                body = Buffer.concat(responseBuf).toString();
                body = JSON.parse(body);
            } catch (error) {
                console.log("[EXCEPTION] JSON parse");
            }
        }
        responseBuf = [];
        console.log(`[CONNET] METHOD : ${method} || URL: ${url} `);
        switch (method) {
            case "GET": {
                if (url.match(/\/upbit/gi)) {
                    const { data: AxiosReturnData } = await axios.get("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
                    if (url.match(/\/upbit\/btc/gi)) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        const axioxParseData = { current_price: AxiosReturnData[0].trade_price, current_date: AxiosReturnData[0].trade_date }
                        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "http://localhost:3000" });
                        res.write(JSON.stringify(returnResponseData({ responseData: responseResultFormat, msg: "btc_krw 정보 조회 완료", data: axioxParseData })));
                        res.end();
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "http://localhost:3000" });
                        res.write(JSON.stringify(returnResponseData({ responseData: responseResultFormat, msg: "/upbit로 GET 요청하였습니다." })));
                        res.end();
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(returnResponseData({ responseData: responseResultFormat, msg: "/ GET 요청하였습니다." })));
                    res.end();
                }
                return;
            }
            case "OPTIONS": {
                res.writeHead(200, { "Access-Control-Allow-Origin": "http://localhost:3000" });
                res.end();
                return;
            }
            default: {
                res.end();
                return;
            }
        }
    })
}).listen(3001);

function returnResponseData({ responseData, msg, data = null }) {
    responseData.msg = msg;
    if (data != null) {
        responseData.data = data;
    }
    return responseData;
}

