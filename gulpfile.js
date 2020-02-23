/**
 * @Author: lollipop
 * @Date: 2020/02/2020/2/20
 **/
const fs = require('fs'),
    join = require('path').join,
    ejs = require('ejs'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    {createProxyMiddleware } = require('http-proxy-middleware'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefixPlugin = new LessPluginAutoPrefix({
        browsers: ["last 5 versions"],
        cascade: true
    }),
    plumber = require('gulp-plumber'),  // 任务出错不中断任务，继续任务
    sourcemaps = require('gulp-sourcemaps'),
    babel = require("gulp-babel"),
    jshint = require('gulp-jshint'),  // js语法监测
    htmlmin = require('gulp-htmlmin'),              //html的压缩
    cleancss = require('gulp-clean-css'),             //css压缩
    autoprefixer = require('gulp-autoprefixer'),     //自动补全前缀
    uglify = require('gulp-uglify'),               //js压缩
    imagemin = require('gulp-imagemin'),            //图片的压缩
    base64 = require('gulp-base64'),                //- 把小图片转成base64字符串
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    browserSync = require('browser-sync').create(), //浏览器自动刷新
    reload = browserSync.reload,
    connect=require('gulp-connect'),
    //设置输入输出文件夹
    devSrc = join(__dirname,'src'),
    distDir = join(__dirname, 'dist'),
    devEjs = join(devSrc,'views'),
    devLess = join(devSrc,'less'),
    devJs = join(devSrc, 'js'),
    _ = require('lodash')

const fileArray = [
    'home', 
    'platform', 
    'solution', 
    'solution-bridge', 
    'cases', 
    'cases-bridge', 
    'hardware', 
    'hardware-collect', 
    'hardware-monitor', 
    'about-honors', 
    'about-news', 
    'about-newsDetails', 
    'contact', 
    'cloud-register',
    '404'
];

//compile ejs to html
gulp.task('ejscompile', async function() {
     await _.each(fileArray, ejsItem=> {
        let templateStr = fs.readFileSync(join(devEjs, `${ejsItem}.ejs`), 'utf8'),
            htmlTemplate = ejs.render(templateStr,{
                filename: join(devEjs, `${ejsItem}.ejs`),
                data: _.extend(
                    {},
                    require(join(devSrc,`datas/navdata.js`)),
                    require(join(devSrc,`datas/newsdata.js`)),
                    require(join(devSrc,`datas/hardwaredata.js`)),
                    require(join(devSrc,`datas/casesdata.js`)),
                    { filename: ejsItem}
                )
            });
        fs.writeFile(join(distDir, `views/${ejsItem}.html`), htmlTemplate, err=>{
            if(err) throw new Error(err);
            console.log(`${ejsItem} is saved`);
        });
     })
})


//compile less to css
gulp.task('lesscompile', function(done) {
     gulp.src(join(devLess, `*.less`))
        .pipe(plumber()) //通过gulp-plumber插件来忽略less编译错误
        .pipe(sourcemaps.init()) //标记 map 记录始发点
        .pipe(less({
            plugins: [autoprefixPlugin],
        }))
        .pipe(sourcemaps.write()) //生成记录位置信息的sourcemaps文件
        .pipe(gulp.dest(join(distDir, 'styles/')))
        .pipe(reload({stream:true}))
    done()
})


//compile js
gulp.task('jscompile', function(done) {
    gulp.src(join(devJs, '*.js'))
        .pipe(babel())
        // .pipe(uglify()) //js压缩
        .pipe(gulp.dest(join(distDir, 'js/')))
        .pipe(reload({stream:true}))
    done()
})

//html压缩
gulp.task('htmlmin', function(done) {
    gulp.src(join(distDir, `views/*.html`))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(join(distDir, `views/`)))
        .pipe(reload({stream:true}))
    done()
})

//lib迁移
gulp.task('copyLib', function(done) {
    gulp.src(join(__dirname, 'lib/**/*.*'))
        .pipe(gulp.dest(join(distDir, 'lib/')));
    done()
})

//图片压缩任务，支持JPEG、PNG、及GIF文件;
gulp.task('imgmin', async function() {
    let jpgmin = imageminJpegRecompress({
            accurate: true,  //高精度模式
            quality: "high", //图像质量:low,medium,high and veryhigh
            method: "smallfry",  //网络优化:mpe,ssim,ms-min and smallfry
            min: 70,//最低质量
            loops: 0,//循环尝试次数，默认为6
            progressive: false,//基线优化
            subsmaple: "default"//子采样:default,disable
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4
        });
    await gulp.src(join(distDir, 'static/imgs'), {allowEmpty: true})
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(join(distDir, 'static/imgs')))
})



//服务器任务，以根目录为入口
gulp.task('refreshed', async function() {
    await browserSync.init({
        server: {
            baseDir: './dist',
            index: '/views/home.html',
            middleware: createProxyMiddleware('/api', {
                target: 'http://www.example.org',    // 这里是你要代理的接口
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/api': ''
                }
            }),
        },
        files: [
            join(devEjs,`**/*.ejs`),
            join(devLess, '**/*.less'),
            join(devJs, '*.js'),
            join(distDir, 'static/imgs'),
            join(__dirname, 'lib')
        ],
    }, function(err, bs) {
        console.log('browser refreshed')
    });

})


// 监控并自动刷新
gulp.task('watchs', function() {
    watch(join(devEjs,`**/*.ejs`), gulp.series('ejscompile'));
    watch(join(devLess, '**/*.less'), gulp.series('lesscompile'));
    watch(join(devJs, '*.js'), gulp.series('jscompile'));
    watch(join(distDir, 'static/imgs'), gulp.series('imgmin'));
    watch(join(__dirname, 'lib'), gulp.series('copyLib'));
})

//1.自动监测文件变化并刷新浏览器

//初始生成dist目录
gulp.task('init', gulp.parallel('ejscompile', 'lesscompile', 'jscompile', 'copyLib'));

//启动任务connect:app服务，并监控变化
gulp.task('run', gulp.series('init', 'htmlmin', 'refreshed', 'watchs'));
