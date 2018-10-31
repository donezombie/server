import { Router } from 'express';
import video from './video';
import user from './user';
import playlist from './playlist';
import classroom from './classroom';
import playlistadmin from './playlistforAdmin';
import auth from './auth';
import courseclassroom from './classroomcourse';
import exercises from './exercises';
import jwt from 'jsonwebtoken';
import { success, notFound, error } from '../services/response/';
import permissions from '../permissions.json';

const router = new Router();

router.get('/', (req, res) => {
    res.send("Lms API");
});

router.use('/auth', auth);

router.use((req, res, next) => {
    // Bypass authen to dev
    // return next();
    if(req.session.userInfo) {
        const user = req.session.userInfo;
        let i = 0
        for (let key in permissions) {
            if(req.originalUrl.indexOf(key) > -1) {
                const method = req.method;
                if(permissions[key][method] <= user.role) {
                    return next();
                } else {
                    return error(res, 403, "You don't have permission to access this!");
                }
            } else if(i + 1 === Object.keys(permissions).length) {
                error(res, 404, 'Url incorect!');
            }
            i++
        }
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
                    return next();
				}
			} else error(res, 401, 'Unauthenticated!');
		})
	} else error(res, 401, 'Unauthenticated!');
})

router.use('/videos', video);
router.use('/users', user);
router.use('/playlists', playlist);
router.use('/classrooms', classroom);
router.use('/courseclassroom', courseclassroom);
router.use('/playlistadmin', playlistadmin);
router.use('/exercises', exercises);

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */

export default router;
