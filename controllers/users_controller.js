const User = require('../models/user');

module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err,user){
           if(user){
               return res.render('user_profile',{
                   title: 'User Profile',
                   user: user
               })
           }else{
               return res.redirect('/users/sign-in');
           }
        });
    }else{
        return res.redirect('/users/sign-in');
    }

}


//render the sign up page
module.exports.signUp = function(req,res){
  
     return res.render('user_sign_up',{
         title: "Codeial | Sign Up"
     })

}


//render the sign in page
module.exports.signIn = function(req,res){
  
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req,res){
    
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
               if(err){
                   console.log('Error in creating user while signing up');
                   return;
               }

               //after creating user redirecting it to the sign in page
               return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('/users/sign-in');
        }
    })
    
}


//to sign in and create a seesion for the user
module.exports.createSession = function(req,res){
    //Steps to authenticate  
    //find the user
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            console.log('Error in signing in');
            return;
        }
        //handle user found
        if(user){
           //handle password which don't match
           if(user.password != req.body.password){
               return res.redirect('back');
           }
           //handle session creation
           res.cookie('user_id',user.id);
           return res.redirect('/users/profile');

        }else{
           //handle user not found
           return res.redirect('back');
        }
    })
}

//To sign out of the profile page
module.exports.deleteSession = function(req,res){

    //delete the cookie by changing its value and immediately deleting it
    res.cookie('user_id',-1,{
        expires: new Date(1)
    });
    return res.redirect('/users/sign-in');
}