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
