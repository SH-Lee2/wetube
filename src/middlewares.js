export const localsMiddleware = (req,res,next)=>{
    //locals 는 퍼그 라이브러ㅓ리에 자동 설치되어있기때문에 사용할수 있다 
    console.log(req.session)
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.user = req.session.user
    next()
}

