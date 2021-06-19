import User from "../models/User"
import bcrypt from "bcrypt"
import fetch from "node-fetch"
export const getJoin = (req,res) => {
    return res.render("join", {pageTitle :"Join"})
}

export const postJoin = async(req,res) => {
    const {name, username, email, password,password2, location}=req.body
    const pageTitle = "Join"

    if(password != password2){
        return res.status(400).render("join",{pageTitle , errorMessage : "Password confirmation does not match."})
    }

    const exists = await User.exists({
        $or : [ { email }, { username } ]
    })
    if(exists){
        return res.status(400).render("join",{pageTitle , errorMessage :"This username/email is already taken."})
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
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: e._message,
    })
    }

}
export const getLogin = (req, res) => res.render("login",{pageTitle : "Login"});

export const postLogin = async(req, res) =>{
    const {username,password}  = req.body
    const pageTitle = "Login"
    const user = await User.findOne({username, socialOnly: false }) // 유저가 있는지 확인 
    if (!user) {  // 없으면 에러메세지와함께 리턴 
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
        }
    const ok =  await bcrypt.compare(password, user.password)   //입력된 패스워드가 유저의 암호와 비교해봄 
    if(!ok){
        if (!ok) {
            return res.status(400).render("login", {
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
            const userRequest = await (
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
// export const finishGithubLogin = async (req,res)=>{
//     
//     


//         
        
//         if(!user){
//             //아이디 생성?? 
//             const user = await User.create({
//                 name : userData.name ? userData.name : "Unknown",
//                 username : userData.login,
//                 avatarUrl : userData.avatar_url,
//                 email : emailObj.email,
//                 password : "",
//                 location: userData.location ? userData.location :"Unknown",
//                 socialLogin : true
//             })
//             req.session.user = user;
//             req.session.loggedIn = true
//             return res.redirect("/");;
//         }
//     }else{
//         return res.redirect("/login")
//     }
// }

export const edit = (req, res) => res.send("Edit User");
export const logout = (req, res) => {
    //세션 id 삭제
    req.session.destroy()    
    res.redirect("/")
}
export const see = (req, res) => res.send("See User");