// server.js
// localhostにDenoのHTTPサーバーを展開
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
let previousWord = "しりとり";
let wordHistories = ["しりとり"];
Deno.serve(async(request) => {
// パス名を取得する
  // http://localhost:8000/hoge に接続した場合"/hoge"が取得できる
    const pathname = new URL(request.url).pathname;
    console.log(`pathname: ${pathname}`);
    if(request.method === "GET" && pathname === "/shiritori"){
        return new Response(previousWord);
    }
    if (request.method === "POST" && pathname === "/shiritori") {
             // リクエストのペイロードを取得
        const requestJson = await request.json();
                // JSONの中からnextWordを取得
        const nextWord = requestJson["nextWord"];
                if(wordHistories.indexOf(nextWord) !== -1){
                        return new Response(
                            JSON.stringify({
                                "errorMessage": "既に使われた単語です",
                                "errorCode": "10003"
                            }),
                            {
                                status: 400,
                                headers: { "Content-Type": "application/json; charset=utf-8" },
                            }
                        );
                        
                    }
                 // previousWordの末尾とnextWordの先頭が同一か確認
                 if (previousWord.slice(-1) === nextWord.slice(0, 1)) {
                 
                    if(nextWord.slice(-1) === 'ん'){
                        return new Response(
                            JSON.stringify({
                                "errorMessage": "'ん' で終わる単語です",
                                "errorCode": "10002"
                            }),
                            {
                                status: 400,
                                headers: { "Content-Type": "application/json; charset=utf-8" },
                            }
                        );

                    }
                     // 同一であれば、previousWordを更新
                     previousWord = nextWord;
                     wordHistories.push(nextWord);
                 }
                 else {
                                 return new Response(
                                     JSON.stringify({
                                         "errorMessage": "前の単語に続いていません",
                                         "errorCode": "10001"
                                     }),
                                     {
                                         status: 400,
                                         headers: { "Content-Type": "application/json; charset=utf-8" },
                                     }
                                 );
                             }
                 // 現在の単語を返す
                 return new Response(previousWord);
             }
    if (request.method === "POST" && pathname === "/list") {
        return new Response(wordHistories)
    }

    if (request.method === "POST" && pathname === "/reset") {
        previousWord = "しりとり";
        wordHistories.length = 0;
        return new Response(previousWord);
    }
    return serveDir(
        request,
        {
            /*
            - fsRoot:
            - urlRoot:
            - enableCors:
            */
           fsRoot: "./public/",
           urlRoot: "",
           enableCors: true,
        }
    );
});
