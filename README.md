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

## router

### 개념

- 컨트롤러와(콜백함수??,함수?)와 url의 관계를 쉽게 해준다
- url의 시작부분 , url의 포털!?
- 공통 시작부분을 기반으로 url을 정리하는 방법

### 생성

```
const 라우터명 = express.Router()
```

### 사용

```
app.use('url',router) // 누군가 url에 접근하면 라우터에 있는 컨트롤러를 찾는다
app.get('url',controller) // express 가 url을 찾아 controller를 실행한다
```

### export

- 누구든 import 하면 어디서든 사용가능하다

#### export default 변수명

- 한 파일에 한개만 export 가능하다
- import 할때는 import export 한 이름과 꼭 안같아도된다 from path

#### export 변수명

- 한 파일에 여러개 export 가능하다
- import 할때는 import {export 한 변수와 같은이름 무조건!} from path

### 파라멘트

- ':' 라우터의 url에 사용하고 url을 변수로 사용하낟

```
app.get('/video/:id',controller)
// id값에 입력되는 url은 변수형태로 입력됨
// 만약 /video/555 입력한후 req.params 하면 id : 555 출력됨
```

- 파라멘트를 사용할때는 라우터 순서를 잘 생각해야된다

```
app.get('/video/:id',controller)
app.get('/video/see',controller)
// 이럴 경우 express 는 두번째 라우터를 찾지 못함
```

## pug

### 변수 사용

- #{} , 태그=변수

#### #{}

- 다른 텍스트와 같이 사용 가능

#### 태그=변수

- 태그에서 오직 변수 하나만 사용가능하고 텍스트는 사용불가

### 반복

#### each _ in _

each item in movie 일때 movie는 컨트롤러에서 보내는 변수 이름과 무조건 같아야한다
pug는 자동적으로 movie가 있는지 체그하기 떄문에

```
each item in movie
  li=item   // 변수 사용
else
  li Sorry nothing found
```

이렇게 else 문을 사용할수 있다
