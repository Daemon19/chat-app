function render404NotFound(req, res) {
  res.status(404).render('404');
}

module.exports = { render404NotFound };
