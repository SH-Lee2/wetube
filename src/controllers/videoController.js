//video model 사용
import Video from "../models/video"
export const home = async(req, res) =>{
  const videos = await Video.find({})
  return res.render("home", { pageTitle: "Home" , videos });
}
export const watch = (req, res) => {
  return res.render("watch");
};
export const getEdit = (req, res) => {
  return res.render("edit");
};
export const postEdit = (req, res) => {
  return res.render("edit");
};


export const search = (req, res) => res.render("search");
export const getUpload = (req, res) => res.render("upload" , {pageTitle : 'Upload Video'});
export const postUpload = async(req,res)=>{
  const {title,description,hashtags} = req.body
  //데이터 베이스에  생성=>저장
  try{
    await Video.create({
      title,
      description,
      hashtags : hashtags.split(",").map(word=>`#${word}`)
    })
    return res.redirect('/')

  }catch(e){
    return res.render("upload" , {pageTitle : 'Upload Video' , errorMessage : e._message});
  }
}

export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};
