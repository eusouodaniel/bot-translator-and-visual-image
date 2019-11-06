class IndexController {
  index(req, res) {
    return res.send('<h1><center>Api do bot</center></h1>');
  }
}

export default new IndexController();
