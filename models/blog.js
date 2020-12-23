//untuk konek ke database
const mongoose = require('mongoose');

//pengubah text menjadi html
const marked = require('marked');

//mengubah spasi menjadi strip
//biasanya untuk judul blog
const slugify = require('slugify');

//pengubahan text biasa ke html
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const skemaBlog = new mongoose.Schema({
// Anggap saja dibawah ini adalah isi collection
  title: { type: String, required: true },
  isi: { type: String, required: true },
  // createdAt adalah tanggal yang akan dibuat otomati
  // jika membuat artikel baru
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true }
})
// required adalah wajib di isi
// unique adalah semua data di isi collection yang ditentukan dalam database tidak boleh sama
// type itu seperti variabel dalam pemograman

//skema untuk validasi
skemaBlog.pre('validate', function(next) {
    // jika collection dengan nama isi
    if(this.isi){
    // maka akan di ubah text biasa menjadi format html
      this.isi = dompurify.sanitize(marked(this.isi))
    };
    // jika yang di isi judul maka 
    if (this.title) {
        // pengubahan semua berfomat spasi diubah menjadi strip
      this.slug = slugify(this.title, { lower: true, strict: true })
    };
    // next artinya akan dilanjutkan ke script selanjutnya 
    next();
})

// lalu export lah semua isi disini
module.exports = mongoose.model('blog', skemaBlog)
// 'blog' adalah sebuah collection