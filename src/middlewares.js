import multer from "multer"; // 파일 업로드 
export const localsMiddleware = (req,res,next)=>{
    //locals 는 퍼그 라이브러ㅓ리에 자동 설치되어있기때문에 사용할수 있다 
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.loggedInUser = req.session.user || {}
    console.log(req.session.user)
    next()
}

// 로그인 되있을때만 접근가능 
export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "Log in first.");
      return res.redirect("/login");
    }
  };

// 로그인 되있으면 접근 불가 
  export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "Not authorized");
      return res.redirect("/");
    }
  };

  export const avatarUploads = multer({ dest: "uploads/avatars/" , limits : {
    fileSize: 3000000,
  }});
  export const videoUploads = multer({ dest: "uploads/videos/", limits: {
    fileSize: 50000000,
  }});
