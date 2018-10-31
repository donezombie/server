import { Router } from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
// import { middleware as query } from 'querymen'
// import { middleware as bodym } from 'bodymen'
import { success, error } from '../../services/response';

import { User } from '../user';
// import { log } from 'util';

const router = new Router();

router.get('/', (req, res) => {
	let { session } = req;

    if(session.userInfo) {
		User.findOne({ username: session.userInfo.username }, 'username role email firstName lastName linkFB phoneNumber fullName userSetting')
            .then(userFound => {
                if(!userFound) error(res, 404, "User not exist!")
                else success(res, 200, { user: userFound });
            });
    } else if(req.get("access_token") || req.query.access_token) {
		const access_token = req.get("access_token") || req.query.access_token;
		
		jwt.verify(access_token, process.env.SESSION_SECRET_KEY || 'justAlocalStoregade', (err, decoded) => {
			if(err) {
				console.log(err);
				error(res, 500, 'Verify token error!');
			} else if(decoded) {
				const now = new Date().valueOf();
				const exp = decoded.exp;
				if(exp < now) {
					return error(res, 401, 'Error validating access token: Session has expired on '+new Date(exp)+'. The current time is '+new Date(now)+'.!');
				} else {
					User.findOne({ username: decoded.username }, 'username role email firstName lastName linkFB phoneNumber fullName')
						.then(userFound => {
							if(!userFound) error(res, 404, "User not exist!")
							else success(res, 200, { user: userFound });
						});
				}
			} else error(res, 401, 'Unauthenticated!');
		})
	} else {
        error(res, 401, 'Unauthorized!');
    }
});

router.post('/', ({ body, session }, res) => {
    if(body.password && body.username) {
        User.findOne({ username: body.username })
            .then(userFound => {
                if(!userFound) error(res, 404, "User not exist!")
                else {
                    const isAuth = bcrypt.compareSync(body.password, userFound.hashPassword);
                    if(isAuth) {
						const { username, role, _id, hashPassword, userSetting  } = userFound;
						var d = new Date();
						var calculatedExpiresIn = (((d.getTime()) + (7 * 24 * 60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);
						const token = jwt.sign({ username, role, id: _id }, process.env.SESSION_SECRET_KEY || 'justAlocalStoregade', { expiresIn: calculatedExpiresIn });                     
						session.userInfo = { username, role, id: _id, userSetting }
                        success(res, 200, { user: { username, role, id: _id, userSetting }, access_token: token });
                    }
                    else error(res, 401, "Wrong password!");
                }
            })
    }
    else if(!body.username) error(res, 404, "Missing username!")
    else if(!body.password) error(res, 404, "Missing password!");
});

router.get('/signout', ({ session }, res) => {
    session.destroy();
    session.userInfo = undefined;
    success(res);
});

// const changeInfo = async ({ bodymen: { body }, params }, res, next) => {
// 	// const curPassword = body.password
// 	// const newPassword = body.newpassword
// 	// User.findById(params.id)
// 	//   .then(notFound(res))
// 	//   .then((user) => {
// 	// 	const isMatchPassword = bcrypt.compareSync(curPassword, user.hashPassword)
// 	// 	if (isMatchPassword) {
// 	// 	  user.set({ hashPassword: bcrypt.hashSync(newPassword)})
// 	// 	  user.save()
// 	// 	}
// 	// 	success(res, 200, {match: isMatchPassword})
// 	//   })
//   }

router.patch('/:id', ({body, params}, res)=>{
	// console.log(body);
	const curPassword = body.password
	const newPassword = body.newpassword
	User.findById(params.id)
	  .then((user) => {
		const isMatchPassword = bcrypt.compareSync(curPassword, user.hashPassword)
		if (isMatchPassword) {
		  user.set({ hashPassword: bcrypt.hashSync(newPassword)})
		  user.save()
		}
		success(res, 200, {match: isMatchPassword})
	  })
});

module.exports = router;