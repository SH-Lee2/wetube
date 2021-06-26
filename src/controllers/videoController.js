//video model 사용
import Video from "../models/Video"
import User from "../models/User"
export const home = async(req, res) =>{
  const videos = await Video.find({})
  return res.render("home", { pageTitle: "Home" , videos });
}
//video detail
export const watch = async(req, res) => {
  const {id}=req.params
  //데이터베이스에서 id로 id에 해당하는 것 찾기
  const video = await Video.findById(id).populate("owner") //######## video모델 스키마에서 ref설정한걸 여기서 사용 => owner에 ref설정한 user 를 넣는다??채운다?? 
  if(!video){
    return res.render('404', {pageTitle : 'Video not found'})
  }
  return res.render("watch",{pageTitle : video.title , video});
};

export const getEdit = async(req, res) => {
  const {id}=req.params
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id)
  //에러를 항상 먼저 잡아줘라!
  if(!video){
    // 여기서 return 하지 않으면 밑에꺼도 실행되기때문에 꼭 return 해준다
    return res.status(404).render("404",{pageTitle : "Video not found."})
  }
  if (String(video.owner) !== String(_id)) { // 본인만 수정할수있게!
    return res.status(403).redirect("/");
  }
  return res.render("edit",{pageTitle : `Edit ${video.title}`,video});
};

export const postEdit = async(req, res) => {
  const {id} =req.params
  const {
    user: { _id },
  } = req.session;
  const {title,description,hashtags} = req.body
  console.log(title,description,hashtags)

  //model.exists = true,false를 반환하고 filter가 필요한데 filter는 모든 프로퍼티가 될수있다 , 타이틀, id , description 등
  // 여기서는 id에 해당하는게 있는지만 판별하면되기 때문에 exists 사용 
  const video = await Video.exists({_id : id})
  if(!video){
    return res.status(404).render("404",{pageTitle : "Video not found."})
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  //먼저 위에서 video 가 있는지 판별하고 있으면 id를 통해 찾아서 업데이트 한다
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags:Video.formatHashTag(hashtags),
  });
  return res.redirect(`/videos/${id}`)
};


export const getUpload = (req, res) => res.render("video/upload" , {pageTitle : 'Upload Video'});
export const postUpload = async(req,res)=>{
  const {user : {_id}}= req.session
  const {path : fileUrl}=req.file
  const { title, description, hashtags } = req.body;
  try {
    //데이터 베이스에 생성 및 저장
    const newVideo = await Video.create({
      owner : _id,
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashTag(hashtags), 
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("video/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  
}

export const deleteVideo = async(req, res) => {
  const {id} = req.params
  
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);
  const user = await User.findById(video.owner)
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  user.videos.pull(video._id)   // user에 videos에서 삭제 되지 않는 이슈 해결
  user.save()
  await Video.findByIdAndDelete(id)
  return res.redirect("/")
};

export const search = async(req, res) => {
  const {keyword}=req.query
  let videos = []
  if(keyword){
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    })
  }
  return res.render("search", { pageTitle: "Search", videos });

}