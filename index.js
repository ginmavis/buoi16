const express = require('express')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const fs = require('fs');
const Product = require('./mongoose')
const upload = require('./uploadConfig');

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));


// app.get('/', (req, res) => {
//    Product.find()
//       .then(products => res.render('index', { products }))
//       .catch(err => res.send(err.message))
// })

app.get('/admin', (req, res) => {
   Product.find()
      .then(products => res.render('admin', { products }))
      .catch(err => res.send(err.message))
});

app.get('/remove/:id', (req, res) => {
   const { id } = req.params
   Product.findByIdAndDelete(id)
      .then((product) => {

         // product chứa các thuộc tính của đối tượng bị xóa
         res.redirect('/admin');
         if (product.image === 'default.jpg') return;
         fs.unlink('./public/' + product.image, (err) => {
            if (err) console.log(err.message)
         })
      })
      .catch(err => res.send(err.message))
})

app.get('/add', (req, res) => res.render('add'))



app.post('/add', upload.single('image'), (req, res) => {
   const { name, video, desc } = req.body
      //nếu k tải lên file thì nó sẽ k request cho file nên phải kiểm tra
      // nếu k tải file thì req.file= undifined + .filename =>server sẽ bị die
      // nếu mà có file thì lấy filename còn không có thì gửi lên hình ảnh mặc định
   const image = req.file ? req.file.filename : 'default.jpg'
   const product = new Product({ name, video, desc, image }) // trong object thì đảo vịt trí cũng không ảnh hưởng
   product.save()
      .then(() => res.redirect('/admin'))
      .catch(err => res.send(err.message))
      //    res.send({ name, video, desc, image }) check
})

app.get('/edit/:id', (req, res) => {
   const { id } = req.params
   Product.findById(id)
      .then((product) => res.render('edit', { product }))
      .catch(err => res.send(err.message))
})
app.post('/update/:id', upload.single('image'), (req, res) => {
   const { id } = req.params
   const { name, video, desc, oldImage } = req.body;
   const image = req.file ? req.file.filename : oldImage;
   Product.findByIdAndUpdate(id, { name, video, desc, image })
      .then(() => {
         res.redirect('/admin');
         // co file moi thi phai xoa phai cu
         //kiểm tra điều kiện nếu sai exit luôn , nếu không sẽ tiếp tục thực hiện
         // đỡ phải thêm 1 if nữa => bớt đc 1 dòng
         if (!req.file) return;
         const path = './public/' + oldImage;
         fs.unlink(path, (err) => {
            if (err) console.log(err.message)
         });
      })
      .catch(err => res.send(err.message))
});

const uri = 'mongodb://localhost:27017/mydb';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })


mongoose.connection.once('open', () => {
   app.listen(3000, () => console.log('servser started'))

})