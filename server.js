/**
 * @Author: lollipop
 * @Date: 2020/02/2020/2/20
 **/
const express = require('express'),
    join = require('path').join,
    app = express(),
    distDir = join(__dirname, 'dist')

app.use(express.static(distDir));
app.listen(3000,()=>{
    console.log('app listening on port 3000');
})
