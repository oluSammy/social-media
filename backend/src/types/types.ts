export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  bio?: string;
  user: any;
  photo?: string;
  followers: string;
  followings: string;
  username: string;
  profilePic: string;
  coverPhoto: string;
  profilePicCloudinaryId: string;
  coverPhotoCloudinaryId: string;
}

export interface IFollow {
  userId: string;
  follows: string[];
}

export interface IPost {
  _id: string;
  createdBy: IUser;
  photos: { cloudId: string; url: string }[];
  text: string;
  numberOfLikes: number;
}

export interface ILikes {
  _id: string;
  postId: string;
  likedBy: string;
}

export interface IComment {
  _id: string;
  text: string;
  postId: string;
  createdBy: IUser;
}

export interface socketUser extends IUser {
  socketId: string;
}

export interface IMessage {
  _id: string;
  users: string[];
  senderId: string;
  images: string[];
  message: string;
  read: boolean;
  delivered: boolean;
}
