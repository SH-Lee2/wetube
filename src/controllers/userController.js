import User from "../models/User"
import bcrypt from "bcrypt"
import fetch from "node-fetch"
export const getJoin = (req,res) => {
    return res.render("user/join", {pageTitle :"Join"})
}

export const postJoin = async(req,res) => {
    const {name, username, email, password,password2, location}=req.body
    const pageTitle = "Join"

    if(password != password2){
        return res.status(400).render("user/join",{pageTitle , errorMessage : "Password confirmation does not match."})
    }

    const exists = await User.exists({
        $or : [ { email }, { username } ]
    })
    if(exists){
        return res.status(400).render("user/join",{pageTitle , errorMessage :"This username/email is already taken."})
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        })
        return res.redirect("/login")
    }catch(e){
        return res.status(400).render("user/join", {
            pageTitle,
            errorMessage: e._message,
    })
    }

}
export const getLogin = (req, res) => {
    return res.render("user/login",{pageTitle : "Login"});
}

export const postLogin = async(req, res) =>{
    const {
        body : {username,password}
    }  = req
    const pageTitle = "Login"
    const user = await User.findOne({username,socialLogin : false}) // 유저가 있는지 확인 
    if (!user) {  // 없으면 에러메세지와함께 리턴 
        return res.status(400).render("user/login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
        }
    const ok =  await bcrypt.compare(password, user.password)   //입력된 패스워드가 유저의 암호와 비교해봄 
    if(!ok){
        if (!ok) {
            return res.status(400).render("user/login", {
                pageTitle,
                errorMessage: "Wrong password",
            });
            }
    }
    //로그인에 성공하면 session 에 유저 정보와 로그인 상태를 보낸다 
    req.session.user = user;
    req.session.loggedIn = true
    return res.redirect("/");
} 

export const startGithubLogin = (req,res)=>{
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString()  //Returns a string containing a query string suitable for use in a URL.
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl)
}
export const finishGithubLogin = async (req,res)=>{
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString()
        const finalUrl =  `${baseUrl}?${params}`
        const tokenRequest = await (
            await fetch(finalUrl,{
            method : "POST",
            headers : {
                Accept: "application/json"
                }
            })
        ).json()
        if ("access_token" in tokenRequest) {
            const apiUrl = "https://api.github.com"
            const { access_token } = tokenRequest;
            const userData = await (
                await fetch(`${apiUrl}/user`, {
                method : "GET",
                headers: {
                    Authorization: `token ${access_token}`,
                },
                })
            ).json();
                
            const emailData = await(
                await fetch(`${apiUrl}/user/emails`,{
                method : "GET",
                headers : {
                    Authorization: `token ${access_token}`
                }
            })
            ).json()
            const emailObj = emailData.find(email => email.primary === true && email.verified=== true)
            if(!emailObj){
                return res.redirect("/login");
            }
            
            let user = await User.findOne({email : emailObj.email}) 
            if(!user){
                //아이디 생성?? 
                user = await User.create({
                    name : userData.name? userData.name : "Unknown",
                    username : userData.login,
                    avatarUrl : userData.avatar_url,
                    email : emailObj.email,
                    password : "",
                    location: userData.location ? userData.location :"Unknown",
                    socialLogin : true
                })
            }
                req.session.user = user;
                req.session.loggedIn = true
                return res.redirect("/");;
        }else{
                return res.redirect("/login")
            }
        
}


export const getEdit = (req,res)=>{
    return res.render("user/edit-profile", { pageTitle: "Edit Profile" });

} 

export const postEdit = async(req,res)=>{
    const {
        session : {
            user : {_id,avatarUrl}
        },
        body : {name, email, username, location},
        file 
    }=req
    // db는 업데이트 되지만 session은 업데이트 안되기 때문에 세션값을 받아 오는 프론트는 
    // 업데이트가 안됨 그래서  session을 업데이트 해줘야함
   
    const exixts = await User.exists({  // 나중에 확인 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        $and: [{ _id: { $ne: _id } }, { $or: [{ username }, { email }] }],  // 내꺼와 같이 않고 유저네임이나 이메일을 가지고 있으면 리턴? 
    });
    if (exixts) {
    return res.status(400).render("user/edit-profile", {
        pageTitle : "Edit-Profile",
        errorMessage: "this username/email is already taken.",
    });
    }
    const updateUser = await User.findByIdAndUpdate(_id,{
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
    },{new : true } )//옵션을 해주지않으면 업데이트 되기전 내용을 반환하고 이떄 db에는 업데이트 된 내용이 저장됨 , 만약 옵션을 해주면 업데이트된 내용을 반환하고 db에도 업데이트 된 내용이 저장됨
    req.session.user = updateUser;
    return res.redirect("/users/edit");

} 


export const logout = (req, res) => {
    //세션 id 삭제
    req.session.destroy()    
    res.redirect("/")
}

export const getChangePassword = (req, res) =>{
    return res.render("user/change-password",{pageTitle : "Change Password"})
}

export const postChangePassword = async(req, res) =>{
    const {
        session: {
          user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
      } = req;
      const user = await User.findById(_id);
      const ok = await bcrypt.compare(oldPassword, user.password);
      if (!ok) { // 기존 패스워드와 입력한 기존 패스워드 불일치 
        return res.status(400).render("users/change-password", {
          pageTitle: "Change Password",
          errorMessage: "The current password is incorrect",
        });
      }
      if (newPassword !== newPasswordConfirmation) { // 새로운 암호 불일치 
        return res.status(400).render("users/change-password", {
          pageTitle: "Change Password",
          errorMessage: "The password does not match the confirmation",
        });
      }
      user.password = newPassword; // db, 세션 업데이트 
      await user.save(); // 스키마 미들웨어 => 비번 암호화 
      return res.redirect("/users/logout");

}


export const see = (req, res) => res.send("See User");