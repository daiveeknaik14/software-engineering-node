/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
  * @class LikeDao Implements Data Access Object managing data storage
  * of Likes
  * @property {LikeDao} likeDao Private single instance of LikeDao
  */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;

    /**
      * Creates singleton DAO instance
      * @returns LikeDap
      */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() {}

    /**
     * Uses LikeModel to find all users who liked the tuit.
     * @param {string} tid tuit primary key 
     * @returns Promise to be notified when liked user list is available
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Uses LikeModel to find all tuits liked by user
     * @param {string} uid user primary key
     * @returns Promise to be notified when liked tuit list is available
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .populate("tuit")
            .exec();

    /**
     * Uses LikeModel to like a tuit by taking tid and uid
     * @param {string} uid users primary key
     * @param {string} tid tuit primary key
     * @returns Promise to be notified when tuit is liked
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});
}