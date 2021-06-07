//video model 사용
import Video from "../models/video"
export const home = async(req, res) =>{
  const videos = await Video.find({})
  return res.render("home", { pageTitle: "Home" , videos });
}
//video detail
export const watch = async(req, res) => {
  const {id}=req.params
  //데이터베이스에서 id로 id에 해당하는 것 찾기
  const video = await Video.findById(id)
  if(!video){
    return res.render('404', {pageTitle : 'Video not found'})
  }
  return res.render("watch",{pageTitle : video.title , video});
};

export const getEdit = async(req, res) => {
  const {id}=req.params
  const video = await Video.findById(id)
  //에러를 항상 먼저 잡아줘라!
  if(!video){
    // 여기서 return 하지 않으면 밑에꺼도 실행되기때문에 꼭 return 해준다
    return res.render("404",{pageTitle : "Video not found."})
  }
  return res.render("edit",{pageTitle : `Edit ${video.title}`,video});
};

export const postEdit = async(req, res) => {
  const {id} =req.params
  const {title,description,hashtags} = req.body
  console.log(title,description,hashtags)

  //model.exists = true,false를 반환하고 filter가 필요한데 filter는 모든 프로퍼티가 될수있다 , 타이틀, id , description 등
  // 여기서는 id에 해당하는게 있는지만 판별하면되기 때문에 exists 사용 
  const video = await Video.exists({_id : id})
  if(!video){
    return res.render("404",{pageTitle : "Video not found."})
  }
  //먼저 위에서 video 가 있는지 판별하고 있으면 id를 통해 찾아서 업데이트 한다
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
  return res.redirect(`/videos/${id}`)
};


export const search = (req, res) => res.render("search");
export const getUpload = (req, res) => res.render("upload" , {pageTitle : 'Upload Video'});
export const postUpload = async(req,res)=>{
  const { title, description, hashtags } = req.body;
  try {
    //데이터 베이스에 생성 및 저장
    await Video.create({
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`)), // word앞에 #이면 그냥 word 아니면 #word  ::: startsWith() 앞에 확인 
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  
}

export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};
