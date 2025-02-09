const express = require("express");
const { v4: uuidv4 } = require("uuid");

const models = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {  
  const isAuthorized = req.session ? req.session.user : false;
  const playlistsFromDb = await models.Playlist.findAll({ include: models.User });
  const playlists = [];
  playlistsFromDb.forEach(async p => {
    playlists.push({ 
      playlist_id: p.id,
      playlist_title: p.playlist_title,
      created_by: p.User.username,
      isAuthorized: isAuthorized ? req.session.user.id == p.User.id : false
    });
  });
  res.render("home/index", {
    playlists,
    isAuthorized
  });
});

router.post("/", async (req, res) => {
  const playlist = await models.Playlist.create({
    id: uuidv4(),
    playlist_title: req.body.playlist_title
  });
  const user = await models.User.findOne({ where: { id: req.session.user.id }});
  await user.addPlaylist(playlist);
  res.redirect("/playlist/" + playlist.id)
});

module.exports = router;
