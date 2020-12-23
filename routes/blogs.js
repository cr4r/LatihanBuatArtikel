//export module
const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()


// Page Membuat Artikel
router.get('/new', async (req, res) => {
  const artikel = await Blog.find().sort({ createdAt: 'desc' });
  res.render('bahan/body', { isinya:'new', artikel:new Blog() });
})
 
// Page untuk mengedit Artikel
router.get('/edit/:id', async (req, res) => {
  const artikel = await Blog.findById(req.params.id);
  res.render('bahan/body', { isinya:'edit', artikel: artikel})
})
 
// Page untuk menampilkan Artikel
router.get('/:slug', async (req, res) => {
  const artikel = await Blog.findOne({ slug: req.params.slug });
  res.render('bahan/body', { isinya:'show', artikel: artikel })
})
 
// Mengambil data yang dikirimkan oleh client dan melanjutkan ke script saveArticleAndRedirect
router.post('/', async (req, res, next) => {
  req.artikel = new Blog(); next();
}, saveArticleAndRedirect('new'))
 
// Mengedit data Artikel yang baru saja diambil dan di edit ke database
router.put('/:id', async (req, res, next) => {
  req.artikel = await artikel.findById(req.params.id);next();
},saveArticleAndRedirect('edit'))
 
//menghapus Artikel sesuai slug atau bisa disebut judul artikel
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
})
 
function saveArticleAndRedirect(path) {
  return async (req, res) => {
  // Proses Mengambil data dari client
    let artikel = req.artikel;
    artikel.title = req.body.title;
    artikel.isi = req.body.isi;
  // Mencoba
    try {
  // Mengumpulkan data lalu simpan ke database
      artikel = await artikel.save();
  // lalu di arahkan ke /blog/judulArtikel
      res.redirect(`/${artikel.slug}`);
  //dan jika Error
    } catch (e) {
      res.render(`bahan/body`, { artikel: blog , isinya:path});
    }
  }
}
 
 
module.exports = router