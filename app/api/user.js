const Router = require('koa-router');
const router = new Router({
    prefix:'/user'
});

const {Auth} = require('../../middlewares/auth');

const {User} = require('../modules/user');

const {success} = require('../lib/helper');

const {RegisterValidator,LoginValidator,PositiveIntergerValidator} = require('../validators/validator');

const {generateToken} = require('../../core/util');

router.post('/test', async (ctx)=>{
    ctx.body = {
        msg:"收到"
    }
})

router.post('/register',async (ctx)=>{
    // console.log('post')
    const v = await new RegisterValidator().validate(ctx);
    const user = {
        username:v.get('body.username'),
        password:v.get('body.password'),
        phone:v.get('body.phone'),
        email:v.get('body.email'),
    }
    const r = await User.create(user);
    success();
})

router.post('/login',async (ctx)=>{
    // console.log(ctx.req.headers.token);
    const v = await new LoginValidator().validate(ctx);
    const data = {
        username:v.get('body.username'),
        password:v.get('body.password'),
    };
    const user = await User.verifyUserPassword(data.username,data.password);
    let token = generateToken(user.id,user.username,user.phone);
    const result = User.upadteToken(user,token);
    if(result){
        ctx.body={
            code:0,
            user
        }
    }else{
       throw new global.error.ServerException();
    }
})

router.get('/checkToken', new Auth().m , async  (ctx)=>{
    ctx.body = ctx.auth;
})

router.get('/getAll',async (ctx)=>{
    const result = User.getAllUser();
    if(result){
        ctx.body = {
            code:0,
            data:result
        }
    }
    else{
        ctx.body = {
            code:500,
            errMsg :'成员列表状态异常'
        }
    }
})

module.exports = router;