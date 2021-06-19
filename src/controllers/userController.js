import User from "../models/User"
import bcrypt from "bcrypt"

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
    const user = await User.findOne({username}) // 유저가 있는지 확인 
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

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");