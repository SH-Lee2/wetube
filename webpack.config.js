const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_JS = "./src/client/js/";
module.exports = {
    //entry : 내가 바꾸고 싶은 파일
    entry: {
      
      main: BASE_JS + "main.js",
      videoPlayer: BASE_JS + "videoPlayer.js",
      commentSection: BASE_JS + "commentSection.js"
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: "css/styles.css",
        }),
      ],
    //결과물
    output: {
        filename: "js/[name].js", // entry 이름 가져옴
        //작업 끝나면 ./assets 디렉토리에 저장 !
        // (__dirname, "assets", "js" , "code")  => assets/js/code 폴더안에 main.js 생김 
        // 폴더명 나열 
        path: path.resolve(__dirname, "assets"),
        clean: true, //시작전 깨끗
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [["@babel/preset-env", { targets: "defaults" }]],
              },
            },
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 순서 반대 
          },
        ],
    }
  };