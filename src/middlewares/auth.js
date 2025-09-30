const adminAuth = (req,res,next) => {
    console.log('admin auth is getting checked');
    const token = 'xsyz';
    const isAuthoruzed = token === 'xyz';
    if(!isAuthoruzed){
        res.status(401).send('Unauthorized');
    }else{
        next();
    }
};

module.exports = {adminAuth};

