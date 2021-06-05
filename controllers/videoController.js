export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser });
export const see = (req, res) => {
  return res.render("watch");
};
export const edit = (req, res) => {
  return res.render("edit");
};
export const search = (req, res) => res.render("search");
export const upload = (req, res) => res.render("upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};
