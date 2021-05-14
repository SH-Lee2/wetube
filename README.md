# weTube

## Set Up

### npm

- npm init
- 설치시 npm i 패키지명
- 설치할때는 package.json 파일을 닫고 실행한다 아니면 버전 충돌 가능성이 높다

### script

- package.json 의 script 에서 실행할 파일을 설정할수있다

```
"scripts": {
    "dev": "nodemon --exec babel-node index.js"
  }
```

- npm run dev 로 실행

### dependencies devDependencies

#### dependencies (default)

- express 실행시 필요한 패키지들이다 (자동차 - 키)

#### devDependencies (npm i 패키지명 -save-dev)

- 개발자에게 필요한 패키지들이다 (자동차 - 방향제)
- 이 두개는 모두 node_modules에 저장된다 그러므로 실수로 다른 위치에 설치 하였을경우 그냥 옮겨 주면된다

### 다른 사용자와 같이 개발시

- package.json , index.js 파일만 넘겨주면된다
- 이후에 npm i 하면 npm이 필요한 패키지를 자동으로 설치해준다(package-lock.json , node_modules)

### babel

- 최신 javascript를 NodeJs가 이해 할수 있게 컴파일 해줌
- 즉 최신 문법을 사용할 수 있게 해준다
- nodemon : 파일 수정시 확인하여 다시 실행 시켜준다

- [x] npm install @babel/core @babel/node --save-dev
- [x] npm i nodemon -save-dev
- [x] script 수정 "dev" : "nodemon --exec babel-node index.js"
- [x] npm install @babel/preset-env --save-dev
- [x] Create babel.config.json (파일안에 {
      "presets": ["@babel/preset-env"]
      }수정)

## express

### express set

- import express from "express" //npm 이 node_moudel에서 찾아준다
- const app = express() // express application 생성
- app.listen(port번호,콜백함수) // sever 연결

### 인자

- 첫번째는 request , 두번째는 response , 세번째는 next
- 만약 브라우저에서 요청이 있는데 응답을 해주지 않으면 브라우저는 응답을 기다린다(브라우저마다 시간은 다름)

### middleware

- request 와 response 사이에 존재한다
- 모든 controller 은 middleWare가 될 수 있다
- 함수 인자에 next가 있고 함수 안에 next()가 있으면 middleWare이다
- 한개의 라우터에서만 사용할 경우 app.get('/',mid,home)
- 모든 라우터에서 사용 (global middleWare) app.use(mid)

### morgan

- middleware를 반환한다
- method, path, statusCode, loadTime
